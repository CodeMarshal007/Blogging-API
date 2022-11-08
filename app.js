const express = require("express");
const passport = require("passport");
const { connectToDatabase } = require("./connectToDB/connctToDb");
const userRouter = require("./route/userRoute");
const blogRoute = require("./route/blogRoute");
const {
  findAllArticles,
  findAPublishArticleById,
} = require("./controller/articleController");
require("./auth/auth");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = express();
connectToDatabase();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//ROUTES
app.use("/user", userRouter);
app.use(
  "/article",
  passport.authenticate("jwt", { session: false }),
  blogRoute
);

// Get all Published blogs
app.get("/", findAllArticles);

// Get a published article by Id
app.get("/:articleId", findAPublishArticleById);

// ERROR HANDLER
app.get((error, req, res, next) => {
  console.log(error.message);
  res.status(401).json({ message: "Something broke" });
});

app.listen(PORT, (req, res) => {
  console.log(`server listening on port ${PORT}`);
});

module.export = app;
