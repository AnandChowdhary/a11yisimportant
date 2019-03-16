import dotenv from "dotenv";
dotenv.config();

import Twitter from "twitter";
const client = new Twitter({
  consumer_key: <string>process.env.API_KEY,
  consumer_secret: <string>process.env.API_SECRET,
  access_token_key: <string>process.env.ACCESS_TOKEN,
  access_token_secret: <string>process.env.ACCESS_SECRET
});

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

const retweetProcess = async (mock: boolean = false) => {
  // Select recent tweets to @a11yisimportant
  let tweets = (<SearchResult>await recentTweets("@a11yisimportant", "recent"))
    .statuses;
  // Loop through these tweets and use original tweet if it's a retweet
  tweets.forEach((tweet, index) => {
    if (typeof tweet.retweeted_status === "object")
      tweets[index] = tweet.retweeted_status;
  });
  // Remove any tweets from @a11yisimportant
  tweets = tweets.filter(tweet => tweet.user.screen_name != "a11yisimportant");
  // Remove any tweets already retweeted
  tweets = tweets.filter(tweet => !tweet.retweeted);
  // Remove any tweets which are replies
  tweets = tweets.filter(tweet => !tweet.in_reply_to_status_id);
  // Remove duplicates from this array
  tweets = uniqBy(tweets, "id");
  console.log(JSON.stringify(tweets));
  // Retweet each tweet in the list
  const promises = tweets.map(tweet => () =>
    new Promise((resolve, reject) => {
      if (mock) return resolve({});
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
      console.log("Retweeted", id);
    });
  });

const getTweet = async (id: number) =>
  new Promise(resolve => {
    client.get("statuses/show", { id }, (error, data) => {
      resolve(data || error);
    });
  });

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

const recentTweets = async (q: string, result_type: string = "mixed") =>
  new Promise((resolve, reject) => {
    client.get("search/tweets", { q, result_type }, (error, tweets) => {
      if (error) return reject(error);
      resolve(tweets);
    });
  });

const findPeople = async () => {
  const tweets = <SearchResult>await recentTweets("#a11y");
  const people: User[] = [];
  tweets.statuses.forEach(tweet => people.push(tweet.user));
  return people;
};

export { followProcess, retweetProcess, follow, recentTweets, findPeople };
