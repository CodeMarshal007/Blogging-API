const userModel = require("../model/userModel");
const Article = require("../model/blogModel");

// Create a new article
function createAarticle(req, res) {
  return new Promise(async (resolve, reject) => {
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
    resolve(article);
  });
}
// get all published blogs
function findAllArticles(req, res) {
  return new Promise(async (resolve, reject) => {
    const articles = await Article.find({ state: "published" });
    resolve(articles);
  });
}

// Get a published article by Id
function findAPublishArticleById(req, res) {
  return new Promise(async (resolve, reject) => {
    const { articleId } = req.params;
    const article = await Article.findById(articleId).populate("postedBy", {
      first_name: 1,
      last_name: 1,
      email: 1,
      phone_number: 1,
    });
    if (!article) {
      reject(res.status(404).json({ status: false, article: null }));
    }

    if (article.state === "draft") {
      reject(
        res.status(401).json({
          status: false,
          message:
            "Unauthorized. You tried to get a draft article, login to see your draft article",
        })
      );
    }

    // Increase the read count
    article.read_count += 1;
    article.save();
    resolve(article);
  });
}

// List of user's articles
function myAarticles(req, res) {
  return new Promise(async (resolve, reject) => {
    const reqUserId = req.user._id;
    console.log(reqUserId);

    const foundUser = await userModel.findById(reqUserId).populate("posts", {
      title: 1,
      description: 1,
      state: 1,
      read_count: 1,
      tags: 1,
      createdAt: 1,
    });

    const articles = foundUser.posts;
    resolve(articles);
  });
}

// Login users can get their OWN draft and published article by id
function findAnArticleById(req, res) {
  return new Promise(async (resolve, reject) => {
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
      reject(
        res
          .status(404)
          .json({ status: false, message: "article not found", article: null })
      );
    }

    const userId = JSON.stringify(foundUser._id);
    const postId = JSON.stringify(article.postedBy._id);
    // checking if the user is the owner of the article
    if (userId !== postId) {
      reject(
        res.status(401).json({
          status: false,
          message:
            "Unauthorized, you tried to access an article that is not yours",
          article: null,
        })
      );
    }

    // Increase the read count if a user gets their own pulished article
    if (article.state !== "draft") {
      article.read_count += 1;
      article.save();
    }
    resolve(article);
  });
}

// Update an article by Id
function updateAnArticleById(req, res) {
  return new Promise(async (resolve, reject) => {
    const { articleId } = req.params;
    const reqUser = req.user;
    const body = req.body;

    const foundUser = await userModel.findById(reqUser._id);
    const article = await Article.findById(articleId);
    if (!article) {
      reject(res.status(404).json({ status: false, article: null }));
    }

    const userId = JSON.stringify(foundUser._id);
    const postId = JSON.stringify(article.postedBy);
    // checking if the user is the owner of the article
    if (userId !== postId) {
      reject(
        res.status(401).json({
          status: false,
          message: "Unauthorized",
        })
      );
    }

    const updatedArticle = await article.updateOne(body);
    resolve(updatedArticle);
  });
}

// Delete an article by Id
function deleteAnArticleById(req, res) {
  return new Promise(async (resolve, reject) => {
    const { articleId } = req.params;
    const reqUser = req.user;

    const foundUser = await userModel.findById(reqUser._id);
    const article = await Article.findById({ _id: articleId });

    if (!article) {
      reject(
        res
          .status(404)
          .json({ status: false, message: "Article not found", article: null })
      );
    }

    const userId = JSON.stringify(foundUser._id);
    const postId = JSON.stringify(article.postedBy);
    // checking if the user is the owner of the article
    if (userId !== postId) {
      reject(
        res.status(401).json({
          status: false,
          message: "Unauthorized",
        })
      );
    }

    const deletedArticle = await article.deleteOne({ _id: articleId });

    // Remove the article's Id from the user list of posts
    let posts = foundUser.posts;
    const index = posts.indexOf(articleId);
    console.log(index);
    // Only romeve id when it's index is found
    if (index > -1) {
      posts.splice(index, 1);
    }
    await foundUser.save();
    resolve(deletedArticle);
  });
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
