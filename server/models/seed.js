const mongoose = require("mongoose");
const postMessage = require("../models/postMessage.js");

mongoose
  .connect(
    "mongodb+srv://pranaypj13:hZyvbNFJfAmpyOpp@cluster0.7ve7y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(async () => {
      const posts = await postMessage.find();
      const images = new Map()
    posts.forEach((post) => {
      post.images.forEach((img) => {
        if (images.get(img._id)) console.log(img._id);
        else images.set(img._id, true   );
      });
    });
  })
  .catch((error) => {});
