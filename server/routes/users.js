const express = require("express");
const {validateUser}=require("../middleware/index")
const {
  signUp,
  signIn,
  refreshAccessToken,
  logout,
} = require("../controllers/users.js");
const catchAsync = require("../utils/catchAsync.js");

const router = express.Router();

router.get("/logout", catchAsync(logout));
router.post("/signUp", validateUser,catchAsync(signUp));
router.post("/signIn", catchAsync(signIn));
router.get("/refresh", catchAsync(refreshAccessToken));

module.exports = router;
