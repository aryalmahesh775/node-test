import express, { response } from "express";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
const router = express.Router();
const client_id =
  "492121281414-3n2qf7pv29r5tcdtn9lnkoof1voiinsk.apps.googleusercontent.com";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const client = new OAuth2Client(client_id);

router.post("/googleLogin", async (req, res, next) => {
  const { tokenId } = req.body;

  client
    .verifyIdToken({
      idToken: tokenId,
      audience: client_id,
    })
    .then((response) => {
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (err) {
            return res.status(400).json({ error: "User already exist..." });
          } else {
            if (user) {
              const token = jwt.sign({ _id: user._id }, "googlesecretkey", {
                expiresIn: "7d",
              });
              const { _id, name, email } = user;

              res.json({
                token,
                user: { _id, name, email },
              });
            } else {
              let password = email + "googlesecretkey";
              let newUser = new User({ name, email, password });
              newUser.save((err, data) => {
                if (err) {
                  return res
                    .status(400)
                    .json({ error: "User already exist... after password" });
                }
                const token = jwt.sign({ _id: data._id }, "googlesecretkey", {
                  expiresIn: "7d",
                });
                const { _id, name, email } = newUser;

                res.json({
                  token,
                  user: { _id, name, email },
                });
              });
            }
          }
        });
      }
    });
});

// router.post("/googleLogin", async (req, res, next) => {
//   const { tokenId } = req.body;

//   try {
//     const response = await client.verifyIdToken({
//       idToken: tokenId,
//       audience: client_id,
//     });

//     if (response) {
//       const { email_verified, name, email } = response.payload;
//       if (email_verified) {
//         let mahesh = await User.findOne({ email });

//         if (mahesh) {
//           const token = jwt.sign({ _id: mahesh._id }, "googlesecretkey", {
//             expiresIn: "7d",
//           });
//           const { _id, name, email } = mahesh;

//           res.json({
//             token,
//             user: { _id, name, email },
//           });
//         } else {
//           let password = email + "googlesecretkey";
//           let newUser = new User({ name, email, password });
//           await newUser.save();
//           const token = jwt.sign({ _id: data._id }, "googlesecretkey", {
//             expiresIn: "7d",
//           });
//           const { _id, name, email } = newUser;

//           res.json({
//             token,
//             user: { _id, name, email },
//           });
//         }
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

router.get("/test", async (req, res, next) => {
  res.status(200).json({ message: "this is woking" });
});

export { router as googleRouter };
