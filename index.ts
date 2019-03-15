import * as dotenv from "dotenv";
dotenv.config();

import axios from "axios";

const init = async () => {
  findPeople();
}

const recentTweets = async (hashTag: string) => {
  console.log(hashTag);
  // axios({
  //   method: "GET",
  //   url: `https://api.twitter.com/1.1/search/tweets.json?q=nasa`
  // });
}

const findPeople = async () => {
  await recentTweets("a11y");
}

export { init };
