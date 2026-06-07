import express, { Response, Request } from "express";
const app = express();

import {
  defaultOptions,
  followProcess,
  unfollowProcess,
  retweetProcess,
  likeProcess,
  TwitterOptions
} from "./index";

const twitterOptionKeys: Array<keyof TwitterOptions> = [
  "screen_name",
  "hashtag",
  "consumer_key",
  "consumer_secret",
  "access_token_key",
  "access_token_secret"
];

const stringQueryValue = (value: unknown): string | undefined =>
  typeof value === "string" && value ? value : undefined;

const twitterOptionsFromQuery = (
  query: Request["query"]
): TwitterOptions | undefined => {
  const overrides = twitterOptionKeys.reduce((options, key) => {
    const value = stringQueryValue(query[key]);
    return value ? { ...options, [key]: value } : options;
  }, {} as Partial<TwitterOptions>);

  return Object.keys(overrides).length
    ? { ...defaultOptions, ...overrides }
    : undefined;
};

app.get("/", (req: Request, res: Response) => res.json({ hello: "world" }));

app.get("/follow", (req: Request, res: Response) => {
  res.json({ queued: "follow" });
  followProcess(false, twitterOptionsFromQuery(req.query))
    .then(() => {})
    .catch(e => console.log("Got error", e));
});

app.get("/unfollow", (req: Request, res: Response) => {
  res.json({ queued: "unfollow" });
  unfollowProcess(false, twitterOptionsFromQuery(req.query))
    .then(() => {})
    .catch(e => console.log("Got error", e));
});

app.get("/retweet", (req: Request, res: Response) => {
  res.json({ queued: "retweet" });
  retweetProcess(false, twitterOptionsFromQuery(req.query))
    .then(() => {})
    .catch(e => console.log("Got error", e));
});

app.get("/like", (req: Request, res: Response) => {
  res.json({ queued: "like" });
  likeProcess(false, twitterOptionsFromQuery(req.query))
    .then(() => {})
    .catch(e => console.log("Got error", e));
});

app.listen(process.env.PORT || 7001, () =>
  console.log("@a11yisimportant is ready.")
);
