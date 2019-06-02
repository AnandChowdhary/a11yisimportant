import dotenv from "dotenv";
dotenv.config();

import Twitter from "twitter";
const client = new Twitter({
  consumer_key: <string>process.env.API_KEY,
  consumer_secret: <string>process.env.API_SECRET,
  access_token_key: <string>process.env.ACCESS_TOKEN,
  access_token_secret: <string>process.env.ACCESS_SECRET
});

const account = process.env.SCREEN_NAME || "a11yisimportant";
const hashTag = process.env.HASHTAG || "a11y";

// @ts-ignore
import serial from "promise-serial";
import { uniqBy } from "lodash";
import { SearchResult, User, Tweet } from "./interfaces";

const followProcess = async (mock: boolean = false) => {
  // Remove duplicates and filter users you don't follow
  const people = uniqBy(
    (await findPeople()).filter(
      user => !user.following && !user.follow_request_sent
    ),
    "id"
  );
  // Follow each person in the list
  const promises = people.map(person => () =>
    new Promise((resolve, reject) => {
      if (mock) return resolve({});
      follow(person)
        .then(response => resolve(response))
        .catch(error => reject(error));
    })
  );
  return serial(promises);
};

const listFollowing = async () =>
  new Promise(resolve => {
    client.get("friends/list", (error, data) => {
      resolve(data.users || error);
    });
  });

const unfollowProcess = async (mock: boolean = false) => {
  const following = (await listFollowing()) as User[];
  for await (const user of following) {
    await unfollow(user);
  }
  return { unfollowed: following.length };
};

const retweetProcess = async (mock: boolean = false) => {
  // Select recent tweets to @account
  let tweets = (<SearchResult>await recentTweets(`@${account}`, "recent"))
    .statuses;
  // Loop through these tweets and use original tweet if it's a retweet
  tweets.forEach((tweet, index) => {
    if (typeof tweet.retweeted_status === "object")
      tweets[index] = tweet.retweeted_status;
  });
  // Remove any tweets from @account
  tweets = tweets.filter(tweet => tweet.user.screen_name != account);
  // Remove any tweets already retweeted
  tweets = tweets.filter(tweet => !tweet.retweeted);
  // Like each tweet in this list
  await likeTweets(tweets);
  // Get the original tweet if this is a reply
  let index = 0;
  for (let tweet of tweets) {
    if (tweet.in_reply_to_status_id_str) {
      tweets[index] = <Tweet>await getOriginalTweet(tweet);
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
      retweet(tweet.id_str)
        .then(response => resolve(response))
        .catch(error => reject(error));
    })
  );
  return serial(promises);
};

const retweet = async (id: string) =>
  new Promise(resolve => {
    client.post("statuses/retweet", { id }, (error, data) => {
      resolve(data || error);
    });
  });

const getTweet = async (id: string): Promise<Tweet> =>
  new Promise((resolve, reject) => {
    client.get("statuses/show", { id }, (error, data) => {
      if (error) return reject(error);
      resolve(<Tweet>data);
    });
  });

const getOriginalTweet = async (tweet: Tweet): Promise<Tweet> => {
  if (tweet.in_reply_to_status_id_str) {
    const newTweet = await getTweet(tweet.in_reply_to_status_id_str);
    if (newTweet.in_reply_to_status_id_str)
      return await getOriginalTweet(tweet);
    return newTweet;
  }
  return tweet;
};

const follow = async (person: User) =>
  new Promise(resolve => {
    client.post(
      "friendships/create",
      { user_id: person.id_str },
      (error, data) => {
        resolve(data || error);
      }
    );
  });

const unfollow = async (person: User) =>
  new Promise(resolve => {
    client.post(
      "friendships/destroy",
      { user_id: person.id_str },
      (error, data) => {
        resolve(data || error);
      }
    );
  });

const recentTweets = async (q: string, result_type: string = "mixed") =>
  new Promise((resolve, reject) => {
    client.get("search/tweets", { q, result_type }, (error, tweets) => {
      if (error) return reject(error);
      resolve(tweets);
    });
  });

const findPeople = async () => {
  const tweets = <SearchResult>await recentTweets(`#${hashTag}`);
  await likeTweets(tweets.statuses);
  const people: User[] = [];
  tweets.statuses.forEach(tweet => people.push(tweet.user));
  return people;
};

const likeTweet = async (tweet: Tweet) =>
  new Promise(resolve => {
    client.post("favorites/create", { id: tweet.id_str }, (error, data) => {
      resolve(data || error);
    });
  });

const likeTweets = async (tweets: Tweet[]) => {
  for (let tweet of tweets) {
    await likeTweet(tweet);
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
