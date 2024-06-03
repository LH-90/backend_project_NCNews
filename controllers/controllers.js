const {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectCommentsByArticle,
  insertComment,
  modifyArticle,
  removeComment,
  selectUsers,
  selectUserByUsername
} = require("../models/models");
const fs = require("fs/promises");

exports.getTopics = (req, res) => {
  return selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getEndpoints = (req, res) => {
  fs.readFile(__dirname + "/../endpoints.json", "utf-8").then((result) => {
    res.status(200).send(JSON.parse(result));
  });
};

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  const commentCount = req.query.comment_count;
  return selectArticleById(articleId, commentCount)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  return selectArticles(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticle = (req, res, next) => {
  const article_id = req.params.article_id;
  Promise.all([
    selectArticleById(article_id),
    selectCommentsByArticle(article_id),
  ])
    .then(([article, comments]) => {
      res.status(200).send({ article, comments });
    })
    .catch(next);
};

exports.addComment = (req, res, next) => {
  const { username, body } = req.body;
  const article_id = req.params.article_id;
  return insertComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  const { inc_votes } = req.body;
  const article_id = req.params.article_id;
  return modifyArticle(inc_votes, article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const comment_id = req.params.comment_id;
  return removeComment(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.getUsers = (req, res) => {
  return selectUsers()
  .then((users) => {
    res.status(200).send({ users });
  });
};


exports.getUserByUsername = (req, res, next) => {
  const username = req.params.username
  return selectUserByUsername(username)
  .then ((user) => {
    res.status(200).send({ user })
  })
  .catch(next)
}

