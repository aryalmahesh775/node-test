import express from "express";
const router = express.Router();

import {
  createUserController,
  loginController,
} from "../controllers/userController.js";

router.post("/", createUserController);

router.post("/login", loginController);

export { router as UserRouter };
