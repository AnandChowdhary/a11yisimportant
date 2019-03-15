import * as dotenv from "dotenv";
dotenv.config();

const init = () => {
  console.log("init!", process.env.SAMPLE);
}

export { init };
