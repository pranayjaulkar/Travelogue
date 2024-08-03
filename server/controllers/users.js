const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret";
const saltRounds = process.env.SALT_ROUNDS || 10;

const createTokens = (user) => {
  //create accesstoken
  const accessToken = jwt.sign(
    {
      _id: user._id,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  //create refreshtoken
  const refreshToken = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

const createCookie = (
  res,
  refreshToken,
  expiresIn = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
) => {
  return res.cookie("userId", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresIn,
  });
};

const configureUser = (user, accessToken) => {
  return (user = {
    ...user._doc,
    accessToken,
    name: `${user.firstName} ${user.lastName}`,
  });
};


module.exports.signIn = async (req, res) => {
  let userData = req.body;
  let googleUser = false;
  if (userData && userData.credential) {
    userData = jwt.decode(userData.credential);
  }
  let user = await User.findOne({ email: userData.email });
  //if user exists then sign in else return user not signed up

  if (user) {
    //if user has already signed in with google then turn googleUser true
    if (user.externalId && user.externalType === "GOOGLE") {
      googleUser = true;
    }
    //if User has previously signed in with google and is   also currently signing in with google then sign in user
    if (googleUser && userData.sub) {
      const { accessToken, refreshToken } = createTokens(user);
      //create cookie to embed refresh token
      createCookie(res, refreshToken);
      user = configureUser(user, accessToken);
      res.status(200).json(user);
    }
    //if User has previously signed in with google and is currently signing in with email and password then send user is google user error
    else if (googleUser && !userData.sub) {
      return res.status(400).json({ error: "USER_IS_GOOGLE_USER" });
    }
    //if User has previously signed up with email and password and is currently signing in with google then link user account with google account
    else if (!googleUser && userData.sub) {
      if (user.email && !user.externalId) {
        user.externalId = userData.sub;
        user.externalType = "GOOGLE";
        user = await user.save();
      }
      const { accessToken, refreshToken } = createTokens(user);
      //create cookie to embed refresh token
      createCookie(res, refreshToken);
      user = configureUser(user, accessToken);
      res.status(200).json(user);
    }
    //if user has previously signed up with email and password and is currently signing in with email and password
    else {
      const match = await bcrypt.compare(userData.password, user.password);
      if (!match) {
        return res.status(400).json({ error: "INCORRECT_EMAIL_OR_PASSWORD" });
      }
      const { accessToken, refreshToken } = createTokens(user);
      //create cookie to embed refresh token
      createCookie(res, refreshToken);
      //add name field and accesstoken to user object
      user = configureUser(user, accessToken);
      res.status(200).json(user);
    }
  }
  //user is signing in with google for the first time then create user account and sign in
  else if (userData.sub) {
    user = new User({
      firstName: userData.name.split(" ")[0],
      lastName: userData.name.split(" ")[1],
      email: userData.email,
      externalId: userData.sub,
      externalType: "GOOGLE",
    });
    user = await user.save();
    const { accessToken, refreshToken } = createTokens(user);
    //create cookie to embed refresh token
    createCookie(res, refreshToken);
    user = configureUser(user, accessToken);
    res.status(200).json(user);
  }
  //user does not exist
  else {
    return res.status(404).json({ error: "USER_NOT_FOUND" });
  }
};

module.exports.signUp = async (req, res) => {
  let userData = req.body;
  const foundUser = await User.findOne({ email: userData.email });
  //if user already exists then return error response
  if (foundUser) {
    return res.status(400).json({ error: "USER_ALREADY_EXISTS" });
  } else {
    //hash password with bcrypt
    const password = await bcrypt.hash(userData.password, saltRounds);
    //create new user
    const newUser = new User({ ...userData, password });
    //save user to database
    let user = await newUser.save();
    const { accessToken, refreshToken } = createTokens(user);
    //create cookie to embed refresh token
    createCookie(res, refreshToken);
    user = configureUser(user, accessToken);
    res.status(200).json(user);
  }
};

module.exports.logout = async (req, res) => {
  createCookie(res, "", new Date(Date.now()));
  res.status(200).send();
};

module.exports.refreshAccessToken = async (req, res) => {
  const { userId } = req.cookies;
  if (userId) {
    const decodedData = jwt.verify(userId, JWT_SECRET);
    let user = await User.findById(decodedData._id);
    if (user) {
      const { accessToken } = createTokens(user);
      user = configureUser(user, accessToken);
      res.status(200).json(user);
    } else {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }
  } else {
    return res.status(404).json({ error: "TOKEN_NOT_FOUND" });
  }
};
