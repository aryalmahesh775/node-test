import express from "express";
const router = express.Router();
import { User } from "../models/User.js";
import _ from "lodash";
import jwt from "jsonwebtoken";
const jwtSecret = "k xa hajur";
const jwtSecretRESET = "k xa hajur tapai lai";
const CLIENT_URL = "http://localhost:3000";
// -------------------------------------------------
import mailgun from "mailgun-js";
const DOMAIN = "sandbox683c6ce3a2114b9e8055a2223f3069dc.mailgun.org";
const api_key = "1aeff13e4c0e2ba12e40f07daf81adb1-0be3b63b-3d9e135f";
const mg = mailgun({ apiKey: api_key, domain: DOMAIN });

router.post("/signUp", (req, res, next) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res
        .status(400)
        .json({ error: "User with the email already exist" });
    }

    const token = jwt.sign({ name, email, password }, jwtSecret, {
      expiresIn: "30m",
    });

    const data = {
      from: "bibush@gmail.com",
      to: email,
      subject: "Account Activation Link",
      html: `
        <h2>Please click on given link to activate your account</h2>
        <p> ${CLIENT_URL}/authentication/activate/${token} </p>
      `,
    };
    mg.messages().send(data, function (error, body) {
      if (error) {
        return res.json({
          error: err.message,
        });
      }
      return res.json({
        message: "Email has been sent, kindely activate your account",
      });
    });

    // let newUser = new User({ name, email, password });
    // newUser.save((err, success) => {
    //   if (err) {
    //     console.log("Error in signUp:", err);
    //     return res.status(400).json({ error: err });
    //   }
    //   res.json({
    //     message: "Signup success!!",
    //   });
    // });
  });
});

router.post("/email-activate", (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, jwtSecret, function (err, decodedToken) {
      if (err) {
        return res.status(400).json({ errors: "Incorrect or expired link" });
      }
      const { name, email, password } = decodedToken;
      User.findOne({ email }).exec((err, user) => {
        if (user) {
          return res
            .status(400)
            .json({ error: "User with the email already exists." });
        }
        let newUser = new User({ name, email, password });
        newUser.save((err, success) => {
          if (err) {
            console.log("Error in signup while account activation", err);
            return res.status(400).json({ error: "Error activating account" });
          }
          res.json({
            message: "Signup Success",
          });
        });
      });
    });
  } else {
    return res.json({ error: "Somthing went worng !!!" });
  }
});

router.put("/forget-password", (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ error: "User with this email does not exist." });
    }
    const token = jwt.sign({ _id: user._id }, jwtSecretRESET, {
      expiresIn: "30m",
    });

    const data = {
      from: "bibush@gmail.com",
      to: email,
      subject: "Account Activation Link",
      html: `
              <h2>Please click on given link to reset your password</h2>
              <p> ${CLIENT_URL}/resetpassword/${token} </p>
            `,
    };

    return user.updateOne({ reset_token: token }, (err, success) => {
      if (err) {
        return res.status(400).json({ error: "Reset password link error" });
      } else {
        mg.messages().send(data, function (error, body) {
          if (error) {
            return res.json({
              error: err.message,
            });
          }
          return res.json({
            message: "Email has been sent, kindely follow the instruction",
          });
        });
      }
    });
  });
});

router.put("/reset-password", (req, res) => {
  const { reset_token, newPass } = req.body;
  if (reset_token) {
    jwt.verify(reset_token, jwtSecretRESET, (error, decodedData) => {
      if (error) {
        return res.json({
          error: "Incorrect token or it is expired..",
        });
      }
      User.findOne({ reset_token }, (err, user) => {
        if (err || !user) {
          return res
            .status(400)
            .json({ error: "User with this token does not exist" });
        }
        const obj = {
          password: newPass,
          reset_token: "",
        };

        user = _.extend(user, obj);
        user.save((err, result) => {
          if (err) {
            return res.status(400).json({ error: "reset password link error" });
          } else {
            return res.status(200).json({
              message: "Your password has been changed",
            });
          }
        });
      });
    });
  } else {
    return res.status(401).json({ error: "Authentication error!! ." });
  }
});

export { router as UserVRouter };
