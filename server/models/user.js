const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostMessage",
    },
  ],
  externalId: { type: String, default: null },
  externalType: { type: String, default: null },
});

const user = mongoose.model("User", userSchema);

module.exports = user;
