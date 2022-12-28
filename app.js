const express = require("express");
const passport = require("passport");
const {
  connectToDatabase,
  connectToLocalDatabase,
} = require("./connectToDB/connctToDb");
const userAuthRoute = require("./route/userAuthRoute");
const blogRoute = require("./route/blogRoute");
const userRoute = require("./route/userRoute");
require("express-async-errors");
const {
  findAllArticles,
  findAPublishArticleById,
} = require("./controller/articleController");
require("./auth/auth");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = express();
// connectToDatabase();
connectToLocalDatabase(); //comment this out after testing

// MIDDLEWARES

// Ejs
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//ROUTES
app.use("/app/auth", userAuthRoute);
app.use(
  "/app/user",
  passport.authenticate("jwt", { session: false }),
  userRoute
);
app.use(
  "/app/article",
  passport.authenticate("jwt", { session: false }),
  blogRoute
);

// Get all Published blogs
app.get("/app", findAllArticles);

// Get a published article by Id
app.get("/app/:articleId", findAPublishArticleById);

// ERROR HANDLER
app.use((error, req, res, next) => {
  console.log(error.message);

  res.status(401).json({ message: error.message });
});

app.listen(PORT, (req, res) => {
  console.log(`server listening on port ${PORT}`);
});

module.exports = app;
