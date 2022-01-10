import express from "express";
const router = express.Router();
import {
  createPost,
  getPosts,
  singlePost,
  deletePost,
  updatePost,
} from "../controllers/postcontrollers.js";
import { auth } from "../middleware/authMiddleware.js";

// @route   /api/posts/
// @desc    create a post
// @access  public
router.post("/", auth, createPost);

// @route   /api/posts/
// @desc    get all post
// @access  public
router.get("/", auth, getPosts);

// @route   /api/posts/:id
// @desc    get a single post
// @access  public
router.get("/:postId", singlePost);

// @route   /api/posts/:id
// @desc    delete a post
// @access  public
router.delete("/:postId", deletePost);

// @route   /api/posts/:id
// @desc    upload a post
// @access  public
router.put("/:postId", updatePost);

// module.exports = router;
export { router as postRouter };
