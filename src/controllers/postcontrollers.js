import { Posts } from "../models/posts.js";

export const createPost = async (req, res, next) => {
  const { title, description } = req.body;
  const post = new Posts({
    title,
    description,
  });
  try {
    const savePost = await post.save();
    res.status(201).json({
      message: "Created post successfully",
      createdProduct: savePost,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const posts = await Posts.find();
    res.status(200).json({
      message: "Product retrive successfully",
      posts: posts,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const id = req.params.Pid;
    const { title, description } = req.body;
    const updatePost = {
      title: title,
      description: description,
    };
    const post = await Posts.findByIdAndUpdate(id, updatePost, { new: true });
    res.status(201).json({
      message: "Product updated successfully",
      post: post,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const singlePost = async (req, res, next) => {
  const id = req.params.Pid;
  try {
    const post = await Posts.findById(id);
    res.status(200).json({
      message: "Post retrive successfully",
      post: post,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deletePost = async (req, res, next) => {
  const id = req.params.Pid;
  try {
    const post = await Posts.findByIdAndDelete(id);
    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// ----------------------------------------------------------------
// ------------- then and catch----  get posts -----------------------------------------------
// ------------------------------------------------------
// export const getPosts = (req, res, next) => {
//   const post = Posts.find();
//   post
//     .then((result) => {
//       res.status(200).json({
//         message: "Product retrive successfully",
//         posts: result,
//       });
//     })
//     .catch((error) => {
//       res.status(500).json({ error: error });
//     });
// };

// ----------------------------------------------------------------
// ------------------then and catch--- Create post-------------------------------------------
// ----------------------------------------------------------------
// export const createPost = (req, res, next) => {
//   const { title, description } = req.body;

//   const post = new Posts({
//     title,
//     description,
//   });

//   post
//     .save()
//     .then((result) => {
//       res.status(201).json({
//         message: "created post successfully",
//         createdProduct: result,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err });
//     });
// };

// ----------------------------------------------------------------
// ----------------then and catch------Update post------------------------------------------
// --then and catch--------------------------------------------------------------
// export const updatePost = (req, res, next) => {
//   const id = req.params.Pid;
//   const { title, description } = req.body;
//   console.log(req.body);
//   const updatePost = {
//     title: title,
//     description: description,
//   };

//   const post = Posts.findByIdAndUpdate(id, updatePost, { new: true });
//   post
//     .then((result) => {
//       res.status(201).json({
//         message: "Product updated successfully",
//         post: result,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err });
//     });
// };

// ----------------------------------------------------------------
// ------------------------then and catch----get single post------------------------------------
// ----------------------------------------------------------------
// export const singlePost = (req, res, next) => {
//   const id = req.params.Pid;

//   const post = Posts.findById(id);
//   post
//     .then((result) => {
//       res.status(200).json({
//         message: "Post retrive successfully",
//         post: result,
//       });
//     })
//     .catch((error) => {
//       res.status(500).json({ error: error });
//     });
// };

// ----------------------------------------------------------------
// ------------------------then and catch-- delete post--------------------------------------
// ----------------------------------------------------------------
// export const deletePost = (req, res, next) => {
//   const id = req.params.Pid;

//   const post = Posts.findByIdAndDelete(id);
//   post
//     .then((result) => {
//       return res.status(200).json({
//         message: "Post deleted successfully",
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err });
//     });
// };
