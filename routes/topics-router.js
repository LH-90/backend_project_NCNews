const express = require("express");
const { getTopics } = require("../controllers/controllers");
const topicsRouter = express.Router();

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
