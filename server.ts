import express, { Response, Request } from "express";
const app = express();

import { followProcess, unfollowProcess, retweetProcess } from "./index";

app.get("/", (req: Request, res: Response) => res.json({ hello: "world" }));

app.get("/follow", (req: Request, res: Response) => {
  res.json({ queued: "follow" });
  followProcess(false, Object.keys(req.query).length ? req.query : undefined)
    .then(() => {})
    .catch(() => {})
});

app.get("/unfollow", (req: Request, res: Response) => {
  res.json({ queued: "unfollow" });
  unfollowProcess(false, Object.keys(req.query).length ? req.query : undefined)
    .then(() => {})
    .catch(() => {})
});

app.get("/retweet", (req: Request, res: Response) => {
  res.json({ queued: "retweet" });
  retweetProcess(false, Object.keys(req.query).length ? req.query : undefined)
    .then(() => {})
    .catch(() => {})
});

app.listen(process.env.PORT || 7001, () =>
  console.log("@a11yisimportant is ready.")
);
