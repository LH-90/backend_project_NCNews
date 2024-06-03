const express = require("express");
const { deleteComment, updateComment } = require("../controllers/controllers");
const commentsRouter = express.Router();

commentsRouter.delete("/:comment_id", deleteComment);

commentsRouter.patch("/:comment_id", updateComment);

module.exports = commentsRouter;
