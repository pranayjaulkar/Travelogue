const express = require("express");
const {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPostsBySearch,
  imageUpload,
} = require("../controllers/posts.js");
const { isLoggedIn, isOwner } = require("../middleware/index.js");
const { storage } = require("../cloudinaryConfig.js");
const multer = require("multer");
const catchAsync = require("../utils/catchAsync.js");
const { validatePost } = require("../middleware/index.js");
const upload = multer({ storage });
const router = express.Router();

router
  .route("/")
  .get(catchAsync(getPosts))
  .post(isLoggedIn, validatePost, catchAsync(createPost));
router.get("/search", catchAsync(getPostsBySearch));
router.post(
  "/images",
  isLoggedIn,
  upload.array("images"),
  catchAsync(imageUpload)
);
router
  .route("/:_id")
  .get(catchAsync(getPost))
  .patch(isLoggedIn, isOwner, validatePost, catchAsync(updatePost))
  .delete(isLoggedIn, isOwner, catchAsync(deletePost));
router.patch("/:_id/likePost", isLoggedIn, catchAsync(likePost));

module.exports = router;
