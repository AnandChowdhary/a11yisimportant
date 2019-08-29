import {
  recentTweets,
  follow,
  findPeople,
  followProcess,
  retweetProcess,
  getTweet
} from "../";
import { SearchResult, User, Tweet } from "../interfaces";

const defaultOptions = {
  screen_name: "a11yisimportant",
  hashtag: "a11y",
  consumer_key: process.env.API_KEY as string,
  consumer_secret: process.env.API_SECRET as string,
  access_token_key: process.env.ACCESS_TOKEN as string,
  access_token_secret: process.env.ACCESS_SECRET as string,
};

let searchResult: any;
const cachedRecentTweets = () =>
  new Promise((resolve, reject) => {
    if (searchResult) return resolve(searchResult);
    recentTweets("a11y", "recent", defaultOptions)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

let peopleResult: any;
const cachedFindPeople = () =>
  new Promise((resolve, reject) => {
    if (peopleResult) return resolve(peopleResult);
    findPeople(defaultOptions)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

let tweetResult: any;
const cachedGetTweet = () =>
  new Promise((resolve, reject) => {
    if (tweetResult) return resolve(tweetResult);
    getTweet("1106516296085188609", defaultOptions)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

test("search completed in less than 10 seconds", async () => {
  const tweets = <SearchResult>await cachedRecentTweets();
  expect(tweets.search_metadata.completed_in).toBeLessThanOrEqual(10);
});

test("search should result in a number of tweets", async () => {
  const tweets = <SearchResult>await cachedRecentTweets();
  expect(tweets.search_metadata.count).toBeGreaterThan(0);
});

test("a tweet should have an id", async () => {
  const tweets = <SearchResult>await cachedRecentTweets();
  const tweet = tweets.statuses[0];
  expect(typeof tweet.id_str).toBe("string");
});

test("a tweet should have some text", async () => {
  const tweets = <SearchResult>await cachedRecentTweets();
  const tweet = tweets.statuses[0];
  expect(typeof tweet.text).toBe("string");
});

test("a tweet should have some (long) text", async () => {
  const tweets = <SearchResult>await cachedRecentTweets();
  const tweet = tweets.statuses[0];
  expect(tweet.text.length).toBeGreaterThan(0);
});

test("a tweet should have a tweeter", async () => {
  const tweets = <SearchResult>await cachedRecentTweets();
  const tweet = tweets.statuses[0];
  expect(typeof tweet.user.id_str).toBe("string");
});

test("tweeter should have a username", async () => {
  const tweets = <SearchResult>await cachedRecentTweets();
  const tweet = tweets.statuses[0];
  expect(tweet.user.screen_name.length).toBeGreaterThan(0);
});

test("tweeter should have tweeted", async () => {
  const tweets = <SearchResult>await cachedRecentTweets();
  const tweet = tweets.statuses[0];
  expect(tweet.user.statuses_count).toBeGreaterThan(0);
});

test("should be able to follow a user", async () => {
  const tweets = <SearchResult>await cachedRecentTweets();
  const user = tweets.statuses[0].user;
  const completed = await follow(user, defaultOptions);
  expect(typeof completed).toBe("object");
});

test("should find some people", async () => {
  const people = <User[]>await cachedFindPeople();
  expect(people.length).toBeGreaterThan(0);
});

test("person should have an id", async () => {
  const person = (<User[]>await cachedFindPeople())[0];
  expect(typeof person.id_str).toBe("string");
});

test("person should have a username", async () => {
  const person = (<User[]>await cachedFindPeople())[0];
  expect(typeof person.screen_name).toBe("string");
});

test("follow process should be completed", () => {
  const mock = jest.fn();
  followProcess(true, defaultOptions)
    .then(() => mock())
    .then(() => expect(mock).toBeCalled());
});

test("follow process should return an object", async () => {
  const result = await followProcess(true, defaultOptions);
  expect(typeof result).toBe("object");
});

test("follow process should return a promise", () => {
  expect(followProcess(true, defaultOptions) instanceof Promise).toBeTruthy();
});

test("retweet process should be completed", () => {
  const mock = jest.fn();
  retweetProcess(true, defaultOptions)
    .then(() => mock())
    .then(() => expect(mock).toBeCalled());
});

test("retweet process should return an object", async () => {
  const result = await retweetProcess(true, defaultOptions);
  expect(typeof result).toBe("object");
});

test("retweet process should return a promise", () => {
  expect(retweetProcess(true, defaultOptions) instanceof Promise).toBeTruthy();
});

test("get a tweet", async () => {
  const tweet = <Tweet>await cachedGetTweet();
  expect(typeof tweet).toBe("object");
});

test("tweet should have an id", async () => {
  const tweet = <Tweet>await cachedGetTweet();
  expect(typeof tweet.id_str).toBe("string");
});

test("tweet should some text", async () => {
  const tweet = <Tweet>await cachedGetTweet();
  expect(typeof tweet.text).toBe("string");
});

test("tweet should some (long) text", async () => {
  const tweet = <Tweet>await cachedGetTweet();
  expect(tweet.text.length).toBeGreaterThan(0);
});
