import jwt from "jsonwebtoken";
// const config = require('config')
const jwtSecret = "k xa hajur";

export const auth = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No Token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, jwtSecret);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
