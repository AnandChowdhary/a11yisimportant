import express, { Response, Request } from "express";
const app = express();

import { followProcess, unfollowProcess, retweetProcess } from "./index";

app.get("/", (req: Request, res: Response) => res.json({ hello: "world" }));

app.get("/follow", (req: Request, res: Response) => {
  res.json({ queued: "follow" });
  followProcess()
    .then(() => {})
    .catch(() => {})
});

app.get("/unfollow", (req: Request, res: Response) => {
  res.json({ queued: "unfollow" });
  unfollowProcess()
    .then(() => {})
    .catch(() => {})
});

app.get("/retweet", (req: Request, res: Response) => {
  res.json({ queued: "retweet" });
  retweetProcess()
    .then(() => {})
    .catch(() => {})
});

app.listen(process.env.PORT || 7001, () =>
  console.log("@a11yisimportant is ready.")
);
