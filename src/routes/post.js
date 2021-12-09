import express from "express";
const router = express.Router();
import {
  createPost,
  getPosts,
  singlePost,
  deletePost,
  updatePost,
} from "../controllers/postcontrollers.js";

// @route   /api/posts/
// @desc    create a post
// @access  public
router.post("/", createPost);

// @route   /api/posts/
// @desc    get all post
// @access  public
router.get("/", getPosts);
// router.get("/", (req, res, next) => {
//   console.log(req.body);
//   res.send("create post");
// });

// @route   /api/posts/:id
// @desc    get a single post
// @access  public
router.get("/:Pid", singlePost);

// @route   /api/posts/:id
// @desc    delete a post
// @access  public
router.delete("/:Pid", deletePost);

// @route   /api/posts/:id
// @desc    upload a post
// @access  public
router.put("/:Pid", updatePost);

// module.exports = router;
export { router as postRouter };
