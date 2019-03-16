import express, { Response, Request } from "express";
const app = express();

import { init } from "./index";

app.get("/", (req: Request, res: Response) => res.json({ hello: "world" }));
app.get("/follow", (req: Request, res: Response) => {
  init()
    .then(() => res.json({ followed: true }))
    .catch(error => res.json({ error }));
});

app.listen(process.env.PORT || 7001, () =>
  console.log("@a11yisimportant is ready.")
);
