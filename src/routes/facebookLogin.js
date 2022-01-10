import express, { response } from "express";
import fetch from "node-fetch";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const router = express.Router();

// router.post("/facebookLogin", (req, res) => {
//   const { accessToken, userID } = req.body;
//   let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;
//   fetch(urlGraphFacebook, {
//     method: "GET",
//   })
//     .then((res) => res.json())
//     .then((res) => {
//         const {email, name} = res;
//     //   if (user) {
//     //     const token = jwt.sign({ _id: user._id }, "googlesecretkey", {
//     //       expiresIn: "7d",
//     //     });
//     //     req.session = {
//     //       user_jwt: token,
//     //     };
//     //     const { _id, name, email } = user;
//     //     return res.status(200).json({ token, user: { _id, name, email } });
//     //   } else {
//     //     let password = email + "googlesecretkey";
//     //     bcrypt
//     //       .hash(password, 12)
//     //       .then((hashedpassword) => {
//     //         let newuser = new User({
//     //           name,
//     //           email,
//     //           password: hashedpassword,
//     //           reset_token: "",
//     //         });
//     //         newuser.save((err, data) => {
//     //           if (err) {
//     //             return res
//     //               .status(400)
//     //               .json({ message: "something went wrong" });
//     //           }
//     //           const token = jwt.sign({ _id: data._id }, "googlesecretkey", {
//     //             expiresIn: "7d",
//     //           });
//     //           //   req.session = {
//     //           //     user_jwt: token,
//     //           //   };
//     //           const { _id, name, email } = data;
//     //           return res.status(200).json({
//     //             token,
//     //             user: { _id, name, email },
//     //           });
//     //         });
//     //       })
//     //       .catch((error) => {
//     //         console.log(error);
//     //       });
//     //   }
//     // });

// })
// }

router.post("/facebookLogin", (req, res) => {
  const { accessToken, userID } = req.body;

  let urlGraphFacebook = `https://graph.facebook.com/v12.0/${userID}/?fields=id,name,email&access_token=${accessToken}`;
  fetch(urlGraphFacebook, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((response) => {
      const { email, name } = response;
      User.findOne({ email }).exec((err, user) => {
        if (err) {
          return res.status(400).json({
            error: "Somthing went wrong",
          });
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
            let password = email + "";
            let newUser = new User({ name, email, password });
            newUser.save((err, data) => {
              if (err) {
                return res.status(400).json({
                  error: "Somthing went wrong",
                });
              }
              const token = jwt.sign({ _id: data._id }, "googlesecretkey", {
                expiresIn: "7d",
              });
              const { _id, name, email } = data;

              res.json({
                token,
                user: { _id, name, email },
              });
            });
          }
        }
      });
    });
});

export { router as facebookRouter };
