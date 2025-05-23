import express from "express";
import router from "./router";
import morgan from "morgan";
import cors from "cors";
import { createNewUser, signIn } from "./handlers/user";
import { protect } from "./modules/auth";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("Request received");
  res.status(200);
  res.json({ message: "Hello!" });
});

app.use("/api", protect, router);

app.post("/user", createNewUser);
app.post("/signin", signIn);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err.type === "auth") {
      res.status(401).json({ message: "unauthorzied" });
    } else if (err.type === "input") {
      res.status(401).json({ message: "invalid input" });
    } else {
      res.status(500).json({ message: "oops, Internal Server Error" });
    }
    next(err);
  }
);

export default app;
