import * as dotenv from "dotenv";
dotenv.config();

import Twitter from "twitter";
const client = new Twitter({
  consumer_key: <string>process.env.API_KEY,
  consumer_secret: <string>process.env.API_SECRET,
  access_token_key: <string>process.env.ACCESS_TOKEN,
  access_token_secret: <string>process.env.ACCESS_SECRET
});

import { SearchResult, Tweet, User } from "./interfaces";

const init = async () => {
  // Remove duplicates and filter users you don't follow
  const people = [...new Set(await findPeople())].filter(
    user => !user.following && !user.follow_request_sent
  );
  console.log("Got people", people.length);
};

const recentTweets = async (hashTag: string) =>
  new Promise((resolve, reject) => {
    client.get("search/tweets", { q: hashTag }, (error, tweets) => {
      if (error) return reject(error);
      resolve(tweets);
    });
  });

const findPeople = async () => {
  const tweets = <SearchResult>await recentTweets("a11y");
  const people: User[] = [];
  tweets.statuses.forEach(tweet => people.push(tweet.user));
  return people;
};

init()
  .then(() => console.log("Completed script"))
  .catch(error => console.log("Error", error));
