const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  images: [
    {
      originalname: { type: String, required: true },
      mimetype: { type: String, required: true },
      path: { type: String, required: true },
      size: { type: Number, required: true },
      filename: { type: String, required: true },
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [
    {
      text: { type: String, required: true },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
  tags: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const postMessage = mongoose.model("PostMessage", postSchema);
module.exports = postMessage;
