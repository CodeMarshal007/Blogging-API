const express = require("express");
const blogRoute = express.Router();
const {
  createAarticle,
  updateAnArticleById,
  deleteAnArticleById,
  findAnArticleById,
  myAarticles,
} = require("../controller/articleController");

// create article
blogRoute.post("/", createAarticle);

// list of own Blogs
blogRoute.get("/myarticles", myAarticles);

// Login users can get their OWN draft and published article by id
blogRoute.get("/:articleId", findAnArticleById);

// Update an article
blogRoute.patch("/:articleId", updateAnArticleById);

// Delete an article by Id
blogRoute.delete("/:articleId", deleteAnArticleById);

module.exports = blogRoute;
