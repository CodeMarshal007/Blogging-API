const Article = require("../model/blogModel");
function filter(req, articles) {
  const queries = req.query;
  const filteredArticles = articles.filter((article) => {
    let isValid = true;
    for (key in queries) {
      // console.log(key, article[key], queries[key]);

      isValid = isValid && article[key] == queries[key];
    }
    return isValid;
  });

  return filteredArticles;
}

module.exports = filter;
