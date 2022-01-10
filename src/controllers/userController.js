import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const jwtSecret = "k xa hajur";

// For user signup
export const createUserController = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  let errors = [];

  try {
    if (!name || !email || !password || !confirmPassword) {
      errors.push({ message: "Please enter all the required fields" });
    }

    if (password != confirmPassword) {
      errors.push({ message: "Password do not match" });
    }

    //   for this password must be entered
    if (password && password.length < 6) {
      errors.push({ message: "password must be at least 6 characters" });
    }

    if (errors.length > 0) {
      return res.status(201).json({ errors: errors });
    }

    let isUser = await User.findOne({ email });

    if (isUser) {
      errors.push({ message: "user already exists" });
      // const error = new Error("User already exist");
      // next(error);
      // return res.status(401).json({ errors: errors });
    }

    if (errors.length > 0) {
      return res.status(201).json({ errors: errors });
    }

    const user = new User({
      name,
      email,
      password,
    });

    //   Encrypt password using bcrypt
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Return jsonwebToken
    const payload = {
      name,
      email,
      // password,
    };

    jwt.sign(payload, jwtSecret, { expiresIn: 3600000000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, message: "signup success" });
    });
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err);
    // next(err);
  }
};

// --------------------------------------------------------------------------------

// for login user
export const loginController = async (req, res, next) => {
  const { email, password } = req.body;

  let errors = [];

  try {
    if (!email || !password) {
      errors.push({ message: "Please enter all the required fields" });
    }

    if (password.length < 6) {
      errors.push({ message: "password must be at least 6 characters" });
    }

    // if (errors.length > 0) {
    //   return res.status(201).json({ errors: errors });
    // }

    let user = await User.findOne({ email });

    if (!user) {
      errors.push({ message: "User already exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // return res.status(400).json({ msg: "Invalid Credentials" });
      errors.push({ message: "Password do not match" });
    }

    if (errors.length > 0) {
      return res.status(201).json({ errors: errors });
    }

    const payload = {
      name: user.name,
      email: user.email,
      password: user.email,
    };

    jwt.sign(payload, jwtSecret, { expiresIn: 3600000000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, message: "Login success" });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};
