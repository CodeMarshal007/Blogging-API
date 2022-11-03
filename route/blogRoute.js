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
blogRoute.post("/", (req, res, next) => {
  createAarticle(req, res)
    .then((article) => {
      res.status(200).json({
        status: true,
        message: "successfully created an article",
        article,
      });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

// list of own Blogs
blogRoute.get("/myarticles", (req, res, next) => {
  myAarticles(req, res)
    .then((articles) => {
      res.status(200).json({
        status: true,
        message: "successfully loaded all your article(s)",
        articles,
      });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

// Login users can get their OWN draft and published article by id
blogRoute.get("/:articleId", (req, res, next) => {
  findAnArticleById(req, res)
    .then((article) => {
      res.status(200).json({
        status: true,
        message: "successfully sent an article",
        article,
      });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

// Update an article
blogRoute.patch("/:articleId", (req, res, next) => {
  updateAnArticleById(req, res)
    .then((updatedArticle) => {
      res.status(200).json({
        status: true,
        message: "successfully updated an article",
        updatedArticle,
      });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

// Delete an article by Id
blogRoute.delete("/:articleId", (req, res, next) => {
  deleteAnArticleById(req, res)
    .then((deletedArticle) => {
      res.status(200).json({
        status: true,
        message: "successfully deleted an article",
        deletedArticle,
      });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

module.exports = blogRoute;
