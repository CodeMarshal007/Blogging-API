const userModel = require("../model/userModel");
const Article = require("../model/blogModel");
const filter = require("../utils/filter");
const logger = require("../logger/logger");

// Create a new article
async function createAarticle(req, res, next) {
  try {
    logger.info(`The create blog route was requested`);
    const user = req.user;
    const body = req.body;
    const foundUser = await userModel.findById(user._id);

    const tags = body.tags.split(" ");

    const article = await Article.create({
      title: body.title,
      description: body.description,
      author: body.author,
      state: body.state,
      tags: tags,
      body: body.body,
      postedBy: user._id,
    });

    foundUser.posts = foundUser.posts.concat(article._id);
    await foundUser.save();
    res.status(201).json({
      status: true,
      message: "successfully created an article",
      article,
    });
  } catch (error) {
    return next(error);
  }
}

// get all published blogs
async function findAllArticles(req, res, next) {
  try {
    logger.info(`The homepage/ get all published blog route was requested`);

    // paginations
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.perPage ? parseInt(req.query.perPage) : 20;
    const startIndex = (page - 1) * limit;

    // Sort ||orderable
    const sort = {};
    if (req.query.sortBy && req.query.OrderBy) {
      sort[req.query.sortBy] =
        req.query.OrderBy.toLowerCase() === "desc" ? -1 : 1;
    } else if (req.query.OrderBy === undefined) {
      sort[req.query.sortBy] = req.query.OrderBy = 1;
    } else {
      sort.createdAt = -1;
    }

    // Search
    const search = req.query.search
      ? {
          $or: [
            { author: { $regex: req.query.search } },
            { title: { $regex: req.query.search } },
            { tags: { $regex: req.query.search } },
          ],
        }
      : { state: "published" };

    const articles = await Article.find({ state: "published" })
      .find(search)
      .limit(limit)
      .sort(sort)
      .skip(startIndex);

    res.status(200).json({
      status: true,
      message: "successfully loaded all published articles",
      articles: articles,
    });

    // res.status(200);
    // res.render("index", { articles });
  } catch (error) {
    return next(error);
  }
}

// Get a published article by Id
async function findAPublishArticleById(req, res, next) {
  try {
    logger.info(`The get a published blog by id route was requested`);
    const { articleId } = req.params;
    const article = await Article.findById(articleId).populate("postedBy", {
      first_name: 1,
      last_name: 1,
      email: 1,
      phone_number: 1,
    });
    if (!article) {
      return res.status(404).json({ status: false, article: null });
    }

    if (article.state === "draft") {
      return res.status(401).json({
        status: false,
        message:
          "Unauthorized. You tried to get a draft article, login to see your draft article",
      });
    }

    // Increase the read count
    article.read_count += 1;
    article.save();

    res.status(200).json({
      status: true,
      message: "successfully loaded a published article by Id",
      article,
    });

    // res.status(200);
    // res.render("publishedById", { article });
  } catch (error) {
    next(error);
  }
}

// List of user's articles
async function myAarticles(req, res, next) {
  try {
    logger.info(`The get users owned blog list route was requested`);
    const reqUserId = req.user._id;

    const foundUser = await userModel.findById(reqUserId).populate("posts", {
      _id: 1,
      title: 1,
      description: 1,
      author: 1,
      state: 1,
      read_count: 1,
      reading_time: 1,
      tags: 1,
      body: 1,
      createdAt: 1,
      updatedAt: 1,
    });

    const articles = foundUser.posts;

    const filteredArticles = await filter(req, articles);
    res.status(200).json({
      status: true,
      message: "successfully loaded all your article(s)",
      filteredArticles,
    });
  } catch (error) {
    next(error);
  }
}

// Login users can get their OWN draft and published article by id
async function findAnArticleById(req, res, next) {
  try {
    logger.info(
      `The get owned blog (published or draft) by id route was requested`
    );
    const { articleId } = req.params;

    const reqUser = req.user;

    const foundUser = await userModel.findById(reqUser._id);
    const article = await Article.findById(articleId).populate("postedBy", {
      first_name: 1,
      last_name: 1,
      email: 1,
      phone_number: 1,
    });
    if (!article) {
      return res
        .status(404)
        .json({ status: false, message: "article not found", article: null });
    }

    const userId = JSON.stringify(foundUser._id);
    const postId = JSON.stringify(article.postedBy._id);
    // checking if the user is the owner of the article
    if (userId !== postId) {
      return res.status(401).json({
        status: false,
        message:
          "Unauthorized, you tried to access an article that is not yours",
        article: null,
      });
    }

    // Increase the read count if a user gets their own pulished article
    if (article.state !== "draft") {
      article.read_count += 1;
      article.save();
    }
    res.status(200).json({
      status: true,
      message: "successfully sent an article",
      article,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

// Update an article by Id
async function updateAnArticleById(req, res, next) {
  try {
    logger.info(`The update a blog by Id route was requested`);
    const { articleId } = req.params;

    const reqUser = req.user;
    const body = req.body;

    const foundUser = await userModel.findById(reqUser._id);
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ status: false, article: null });
    }

    const userId = JSON.stringify(foundUser._id);
    const postId = JSON.stringify(article.postedBy);
    // checking if the user is the owner of the article
    if (userId !== postId) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }

    const updatedArticle = await article.updateOne(body);

    res.status(200).json({
      status: true,
      message: "successfully updated an article",
      updatedArticle,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

// Delete an article by Id
async function deleteAnArticleById(req, res, next) {
  try {
    logger.info(`The delete a blog by Id route was requested`);
    const { articleId } = req.params;
    const reqUser = req.user;

    const foundUser = await userModel.findById(reqUser._id);
    const article = await Article.findById({ _id: articleId });

    if (!article) {
      return res
        .status(404)
        .json({ status: false, message: "Article not found", article: null });
    }

    const userId = JSON.stringify(foundUser._id);
    const postId = JSON.stringify(article.postedBy);
    // checking if the user is the owner of the article
    if (userId !== postId) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized, you are not the owner of this article",
      });
    }

    const deletedArticle = await article.deleteOne({ _id: articleId });

    // Remove the article's Id from the user list of posts
    let posts = foundUser.posts;
    const index = posts.indexOf(articleId);

    // Only romeve id when it's index is found
    if (index > -1) {
      posts.splice(index, 1);
    }
    await foundUser.save();
    res.status(200).json({
      status: true,
      message: "successfully deleted an article",
      deletedArticle,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createAarticle,
  findAllArticles,
  findAPublishArticleById,
  findAnArticleById,
  updateAnArticleById,
  deleteAnArticleById,
  myAarticles,
};
