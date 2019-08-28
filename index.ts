import dotenv from "dotenv";
import Twitter from "twitter";
dotenv.config();

interface TwitterOptions {
  screen_name: string;
  hashtag: string;
  consumer_key: string;
  consumer_secret: string;
  access_token_key: string;
  access_token_secret: string;
}
const defaultOptions = {
  screen_name: "a11yisimportant",
  hashtag: "a11y",
  consumer_key: process.env.API_KEY as string,
  consumer_secret: process.env.API_SECRET as string,
  access_token_key: process.env.ACCESS_TOKEN as string,
  access_token_secret: process.env.ACCESS_SECRET as string,
};

// @ts-ignore
import serial from "promise-serial";
import { uniqBy } from "lodash";
import { SearchResult, User, Tweet } from "./interfaces";

const followProcess = async (mock = false, options = defaultOptions as TwitterOptions) => {
  // Remove duplicates and filter users you don't follow
  const people = uniqBy(
    (await findPeople(options)).filter(
      user => !user.following && !user.follow_request_sent
    ),
    "id"
  );
  // Follow each person in the list
  const promises = people.map(person => () =>
    new Promise((resolve, reject) => {
      if (mock) return resolve({});
      follow(person, options)
        .then(response => resolve(response))
        .catch(error => reject(error));
    })
  );
  return serial(promises);
};

const listFollowing = async (options: TwitterOptions) =>
  new Promise(resolve => {
    const client = new Twitter({
      consumer_key: options.consumer_key,
      consumer_secret: options.consumer_secret,
      access_token_key: options.access_token_key,
      access_token_secret: options.access_token_secret
    });
    client.get("friends/list", (error, data) => {
      resolve(data.users || error);
    });
  });

const unfollowProcess = async (mock = false, options = defaultOptions as TwitterOptions) => {
  const following = (await listFollowing(options)) as User[];
  for await (const user of following) {
    await unfollow(user, options);
  }
  return { unfollowed: following.length };
};

const retweetProcess = async (mock = false, options = defaultOptions as TwitterOptions) => {
  // Select recent tweets to @account
  let tweets = (<SearchResult>await recentTweets(`@${options.screen_name}`, "recent", options))
    .statuses;
  // Loop through these tweets and use original tweet if it's a retweet
  tweets.forEach((tweet, index) => {
    if (typeof tweet.retweeted_status === "object")
      tweets[index] = tweet.retweeted_status;
  });
  // Remove any tweets from @account
  tweets = tweets.filter(tweet => tweet.user.screen_name != options.screen_name);
  // Remove any tweets already retweeted
  tweets = tweets.filter(tweet => !tweet.retweeted);
  // Like each tweet in this list
  await likeTweets(tweets, options);
  // Get the original tweet if this is a reply
  let index = 0;
  for (let tweet of tweets) {
    if (tweet.in_reply_to_status_id_str) {
      tweets[index] = <Tweet>await getOriginalTweet(tweet, options);
    }
    index++;
  }
  // Remove duplicates from this array
  tweets = uniqBy(tweets, "id");
  // Retweet each tweet in the list
  const promises = tweets.map(tweet => () =>
    new Promise((resolve, reject) => {
      if (mock) return resolve({});
      // Don't retweet tweets which say "Thanks for the follow!"
      if (
        tweet.text.toLocaleLowerCase().includes("follow") &&
        tweet.text.toLocaleLowerCase().includes("thank")
      )
        return resolve({});
      // or messages like "Our biggest fans this week"
      if (
        tweet.text.toLocaleLowerCase().includes("biggest fan") &&
        tweet.text.toLocaleLowerCase().includes("thank")
      )
        return resolve({});
      // or messages with bulk tag many account
      if ((tweet.text.match(/@/g) || []).length > 3) return resolve({});
      retweet(tweet.id_str, options)
        .then(response => resolve(response))
        .catch(error => reject(error));
    })
  );
  return serial(promises);
};

const retweet = async (id: string, options: TwitterOptions) =>
  new Promise(resolve => {
    const client = new Twitter({
      consumer_key: options.consumer_key,
      consumer_secret: options.consumer_secret,
      access_token_key: options.access_token_key,
      access_token_secret: options.access_token_secret
    });
    client.post("statuses/retweet", { id }, (error, data) => {
      resolve(data || error);
    });
  });

const getTweet = async (id: string, options: TwitterOptions): Promise<Tweet> =>
  new Promise((resolve, reject) => {
    const client = new Twitter({
      consumer_key: options.consumer_key,
      consumer_secret: options.consumer_secret,
      access_token_key: options.access_token_key,
      access_token_secret: options.access_token_secret
    });
    client.get("statuses/show", { id }, (error, data) => {
      if (error) return reject(error);
      resolve(<Tweet>data);
    });
  });

const getOriginalTweet = async (tweet: Tweet, options: TwitterOptions): Promise<Tweet> => {
  if (tweet.in_reply_to_status_id_str) {
    const newTweet = await getTweet(tweet.in_reply_to_status_id_str, options);
    if (newTweet.in_reply_to_status_id_str)
      return await getOriginalTweet(tweet, options);
    return newTweet;
  }
  return tweet;
};

const follow = async (person: User, options: TwitterOptions) =>
  new Promise(resolve => {
    const client = new Twitter({
      consumer_key: options.consumer_key,
      consumer_secret: options.consumer_secret,
      access_token_key: options.access_token_key,
      access_token_secret: options.access_token_secret
    });
    client.post(
      "friendships/create",
      { user_id: person.id_str },
      (error, data) => {
        setTimeout(() => {
          resolve(data || error);
        }, 2500);
      }
    );
  });

const unfollow = async (person: User, options: TwitterOptions) =>
  new Promise(resolve => {
    const client = new Twitter({
      consumer_key: options.consumer_key,
      consumer_secret: options.consumer_secret,
      access_token_key: options.access_token_key,
      access_token_secret: options.access_token_secret
    });
    client.post(
      "friendships/destroy",
      { user_id: person.id_str },
      (error, data) => {
        setTimeout(() => {
          resolve(data || error);
        }, 2500);
      }
    );
  });

const recentTweets = async (q: string, result_type: string = "mixed", options: TwitterOptions) =>
  new Promise((resolve, reject) => {
    const client = new Twitter({
      consumer_key: options.consumer_key,
      consumer_secret: options.consumer_secret,
      access_token_key: options.access_token_key,
      access_token_secret: options.access_token_secret
    });
    client.get("search/tweets", { q, result_type }, (error, tweets) => {
      if (error) return reject(error);
      resolve(tweets);
    });
  });

const findPeople = async (options: TwitterOptions) => {
  const tweets = <SearchResult>await recentTweets(`#${options.hashtag}`, "mixed", options);
  await likeTweets(tweets.statuses, options);
  const people: User[] = [];
  tweets.statuses.forEach(tweet => people.push(tweet.user));
  return people;
};

const likeTweet = async (tweet: Tweet, options: TwitterOptions) =>
  new Promise(resolve => {
    const client = new Twitter({
      consumer_key: options.consumer_key,
      consumer_secret: options.consumer_secret,
      access_token_key: options.access_token_key,
      access_token_secret: options.access_token_secret
    });
    client.post("favorites/create", { id: tweet.id_str }, (error, data) => {
      setTimeout(() => {
        resolve(data || error);
      }, 2500);
    });
  });

const likeTweets = async (tweets: Tweet[], options: TwitterOptions) => {
  for (let tweet of tweets) {
    await likeTweet(tweet, options);
  }
};

export {
  followProcess,
  unfollowProcess,
  retweetProcess,
  follow,
  recentTweets,
  findPeople,
  getTweet,
  likeTweets,
  likeTweet
};
