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
import { SearchResult, User } from "./interfaces";

const init = async (mock: boolean = false) => {
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

const follow = async (person: User) =>
  new Promise(resolve => {
    client.post("friendships/create", { user_id: person.id }, (error, data) => {
      resolve(data || error);
    });
  });

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

export { init, follow, recentTweets, findPeople };
