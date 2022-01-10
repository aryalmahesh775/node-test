import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morgan from "morgan";
const app = express();
// const PORT = process.env.PORT || 6000;
const PORT = process.env.PORT || 3001;

app.use(morgan("dev"));
app.use(cors());
// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import { postRouter } from "./src/routes/postRoute.js";
import { UserRouter } from "./src/routes/userRoutes.js";
import { googleRouter } from "./src/routes/UserGoogle.js";
import { facebookRouter } from "./src/routes/facebookLogin.js";
import { UserVRouter } from "./src/routes/accountVerification.js";

app.use("/api/v", UserVRouter);
app.use("/api/users", UserRouter);
app.use("/api/posts", postRouter);
app.use("/api", googleRouter);
app.use("/api", facebookRouter);

app.use((req, res, next) => {
  const error = new Error(" Route Not found....");
  error.status = 400;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      test: "k xa hajur",
    },
  });
});

const MONGO_URL =
  "mongodb+srv://mahesh:mahesh775@cluster0.nqeoe.mongodb.net/Image";

mongoose
  .connect(MONGO_URL)
  .then((result) => {
    console.log("Database connected...........");
  })
  .catch((err) => {
    console.log("Database connection failed................");
  });

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
