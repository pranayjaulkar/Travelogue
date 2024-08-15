const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const postRoutes = require("./routes/posts.js");
const userRoutes = require("./routes/users.js");
const path = require("path");
const cookieParser = require("cookie-parser");
const customError = require("./utils/error.js");
const PORT = process.env.PORT;
const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL;

const logger = (req, res, next) => {
  const time = new Date(Date.now());
  console.log(`${time.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}  ${req.method}  ${req.path}`);
  next();
};

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist/")));
  app.use(cors({ credentials: true }));
} else {
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

mongoose
  .connect(DB_CONNECTION_URL)
  .then(() => console.log("Database Connected"))
  .catch((error) => {
    console.log("MongoDB Connection Error\n", error);
  });

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}
app.all("*", (req, res, next) => {
  next(new customError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  console.log(`ERROR:\nat:${err.at}\n`, err);
  if (!err.statusCode) err.statusCode = 500;
  if (!err.message) err.message = "Something went wrong";
  res.status(err.statusCode).json({ error: err.message });
});
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
