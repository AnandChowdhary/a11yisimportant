import { init } from "./index";
import { Response, Request } from "express";

export default (req: Request, res: Response) => {
  init()
    .then(() => res.json({ followed: true }))
    .catch(error => res.json({ error }));
};
