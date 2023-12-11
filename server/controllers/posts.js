const postMessage = require("../models/postMessage.js");
const User = require("../models/user.js");
const mongoose = require("mongoose");
const customError = require("../utils/error.js");
const { cloudinary } = require("../cloudinaryConfig");

module.exports.getPost = async (req, res, next) => {
  const { _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id))
    throw new customError("INVALID_ID", 400);
  const post = await postMessage
    .findOne({ _id })
    .populate("owner", "-password")
    .populate({
      path: "comments",
      populate: { path: "owner", select: "-password" },
    });
  res.status(200).json(post);
};

module.exports.getPosts = async (req, res, next) => {
  let { page } = req.query;
  if (!page) page = 1;
  else page = Number(page);
  const limit = 8;
  const startIndex = (page - 1) * limit;
  const total = await postMessage.countDocuments();
  const posts = await postMessage
    .find()
    .sort("-_id")
    .skip(startIndex)
    .limit(limit)
    .populate("owner", "-password")
    .populate({
      path: "comments",
      populate: { path: "owner", select: "-password" },
    });
  res.status(200).json({
    posts,
    noOfPages: Math.ceil(total / limit),
    currentPage: page,
  });
};

module.exports.getPostsBySearch = async (req, res, next) => {
  let { q, tags } = req.query;
  if ((!q || q === "none") && (!tags || !tags.length)) {
    const posts = await postMessage
      .find()
      .populate("owner", "-password")
      .populate({
        path: "comments",
        populate: { path: "owner", select: "-password" },
      });
    return res.status(200).json(posts);
  } else if (tags.length) {
    tags = tags.split(",");
  } else {
    tags = [];
  }
  const title = new RegExp(q, "i");
  const posts = await postMessage
    .find({
      $or: [{ title }, { tags: { $in: tags } }],
    })
    .populate("owner", "-password")
    .populate({
      path: "comments",
      populate: { path: "owner", select: "-password" },
    });
  res.status(200).json(posts);
};

module.exports.imageUpload = async (req, res, next) => {
  const files = req.files;
  res.status(200).json(files);
};

module.exports.createPost = async (req, res) => {
  let post = req.body;
  const postInstance = new postMessage(post);
  //save post in database
  const { _id } = await postInstance.save();
  //get post from database and populate owner object without password field
  post = await postMessage
    .findById(_id)
    .populate("owner", "-password")
    .populate({
      path: "comments",
      populate: { path: "owner", select: "-password" },
    });
  //link post in user object
  let user = await User.findById(post.owner._id);
  user.posts.push(post._id);
  await user.save();

  res.status(200).json(post);
};

module.exports.updatePost = async (req, res) => {
  const { _id } = req.params;
  const post = req.body;
  const updatedPost = await postMessage
    .findByIdAndUpdate(_id, post, {
      new: true,
    })
    .populate("owner", "-password") //populate owner object without password field
    .populate({
      path: "comments",
      populate: { path: "owner", select: "-password" },
    }); //populate owner object without password in every comment object

  res.status(200).json(updatedPost);
};

module.exports.likePost = async (req, res) => {
  const { _id } = req.params;
  //id is already validated in isOwner middleware
  let post = await postMessage.findById(_id);
  let index = -1;
  //if posts has likes then search for userid in likes. if userId exists then remove it from likes or if doesnt exists then add userid to likes
  if (post.likes.length) {
    index = post.likes.findIndex((_id) => _id.toString() === req.userId);
  }
  //if userId is not found in likes array then add it
  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    //if userid found in likes array then remove it from likes array
    post.likes = post.likes.filter((_id) => _id.toString() !== req.userId);
  }
  const updatedPost = await postMessage
    .findByIdAndUpdate(_id, post, {
      new: true,
    })
    .populate("owner", "-password")
    .populate({
      path: "comments",
      populate: { path: "owner", select: "-password" },
    });
  res.status(200).json(updatedPost);
};

module.exports.deletePost = async (req, res) => {
  const { _id } = req.params;
  //id is already validated in isOwner middleware
  // find post and delete all images
  let post = await postMessage.findOne({ _id });
  if (post.images && post.images.length) {
    for (let image of post.images) {
      const res = await cloudinary.uploader.destroy(image.filename);
    }
  }
  const deletedPost = await postMessage
    .findByIdAndDelete(_id)
    .populate("owner", "-password")
    .populate({
      path: "comments",
      populate: { path: "owner", select: "-password" },
    });
  res.status(200).json(deletedPost);
};
