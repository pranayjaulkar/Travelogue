const dotenv = require("dotenv");
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
const jwt = require("jsonwebtoken");
const postMessage = require("../models/postMessage");
const mongoose = require("mongoose");
const customError = require("../utils/error.js");
const { postSchema, userSchema } = require("../models/schema");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports.isLoggedIn = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const accessToken = req.headers.authorization.split(" ")[1];
      const accessTokenData = jwt.verify(accessToken, JWT_SECRET);
      req.userId = accessTokenData?._id;
    } else {
      return res.status(403).json({ error: "ACCESS_TOKEN_NOT_FOUND" });
    }
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ error: "TOKEN_EXPIRED" });
    } else {
      next({ ...error, at: "/middleware/index.js" });
    }
  }
};
module.exports.isOwner = async (req, res, next) => {
  try {
    const { _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw new customError("INVALID_ID", 400, "/middleware/index.js");
    const post = await postMessage.findOne({ _id });
    if (!post.owner.equals(req.userId)) {
      res.status(403).json({ error: "USER_IS_NOT_OWNER" });
    }
    next();
  } catch (error) {
    next({ ...error, at: "/middleware/index.js" });
  }
};
module.exports.validatePost = async (req, res, next) => {
  try {
    const { error } = postSchema.validate(req.body);
    if (error) {
      console.log("JOI Post Schema Validation Error:- \n", error);
      throw new customError(error, 400);
    }
    next();
  } catch (error) {
    next({ ...error, at: "/middleware/index.js" });
  }
};
module.exports.validateUser = async (req, res, next) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      console.log("JOI User Schema Validation Error:- \n", error);
      throw new customError(error, 400);
    }
    next();
  } catch (error) {
    next({ ...error, at: "/middleware/index.js" });
  }
};
