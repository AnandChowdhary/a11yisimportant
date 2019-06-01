import express, { Response, Request } from "express";
const app = express();

import { followProcess, unfollowProcess, retweetProcess } from "./index";

app.get("/", (req: Request, res: Response) => res.json({ hello: "world" }));

app.get("/follow", (req: Request, res: Response) => {
  followProcess()
    .then(() => res.json({ followed: true }))
    .catch(error => res.json({ error }));
});

app.get("/unfollow", (req: Request, res: Response) => {
  unfollowProcess()
    .then(() => res.json({ followed: true }))
    .catch(error => res.json({ error }));
});

app.get("/retweet", (req: Request, res: Response) => {
  retweetProcess()
    .then(() => res.json({ retweeted: true }))
    .catch(error => res.json({ error }));
});

app.listen(process.env.PORT || 7001, () =>
  console.log("@a11yisimportant is ready.")
);
