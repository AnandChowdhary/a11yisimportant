import express from "express";
const app = express();

import follow from "./follow";

app.get("/", (req, res) => res.json({ hello: "world" }));
app.get("/follow", follow);

app.listen(process.env.PORT || 7001, () =>
  console.log("@a11yisimportant is ready.")
);
