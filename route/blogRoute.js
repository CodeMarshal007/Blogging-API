const express = require("express");
const blogRoute = express.Router();
const {
  createAarticle,
  updateAnArticleById,
  deleteAnArticleById,
  findAnArticleById,
  myAarticles,
} = require("../controller/articleController");

/**
 * @api  {Post}  /article
 * @apiName add new article
 * @apiPermission Private
 * @apiSuccess (201) {Object}
 */
blogRoute.post("/", createAarticle);

/**
 * @api  {get}  /article/myarticles
 * @apiName list of own articles
 * @apiPermission Private
 * @apiSuccess (200) {Object}
 */
blogRoute.get("/myarticles", myAarticles);

/**
 * @api  {get}  /article/articleId
 * @apiName get own article by Id
 * @apiPermission Private
 * @apiSuccess (200) {Object}
 */
blogRoute.get("/:articleId", findAnArticleById);

/**
 * @api  {patch}  /article/articleId
 * @apiName Update an article by Id
 * @apiPermission Private
 * @apiSuccess (200) {Object}
 */
blogRoute.patch("/:articleId", updateAnArticleById);

/**
 * @api  {delete}  /article/articleId
 * @apiName delete an article by Id
 * @apiPermission Private
 * @apiSuccess (200) {Object}
 */
blogRoute.delete("/:articleId", deleteAnArticleById);

module.exports = blogRoute;
