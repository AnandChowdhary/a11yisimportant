import * as dotenv from "dotenv";
dotenv.config();

import axios from "axios";

const init = async () => {
  findPeople();
}

const recentTweets = async (hashTag: string) => {
  console.log(hashTag);
  try {
    const response = await axios({
      method: "GET",
      url: `https://api.twitter.com/1.1/search/tweets.json?q=nasa`
    });
    console.log(response);
  } catch (error) {
    console.log("Got error in Axios", error.response.data);
  }
}

const findPeople = async () => {
  await recentTweets("a11y");
}

init()
  .then(() => console.log("Completed script"))
  .catch(error => console.log("Error", error));
