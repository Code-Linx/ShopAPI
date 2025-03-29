import express, { Express, Request, Response } from "express";
import { PORT } from "./secret";

const app: Express = express();
app.get("/", (req: Request, res: Response) => {
  res.send("working");
});

app.listen(PORT, () => {
  console.log("App Working!");
});
