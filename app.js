const express = require("express");
const passport = require("passport");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

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
const CONFIG = require("./config");

const PORT = CONFIG.PORT || 4000;

const app = express();
connectToDatabase();
// connectToLocalDatabase();

// MIDDLEWARES

// Ejs
app.set("view engine", "ejs");
app.set("views", "views");

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Apply the rate limiting middleware to all requests
app.use(limiter);

//security middleware
app.use(helmet());

//ROUTES
app.use("/app/auth", userAuthRoute); //Handles signup and login
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
  const errorStatus = error.status || 500;

  res.status(errorStatus).json({ message: error.message });
});

app.listen(PORT, (req, res) => {
  console.log(`server listening on port ${PORT}`);
});

module.exports = app;
