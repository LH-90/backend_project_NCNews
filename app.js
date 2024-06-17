const express = require("express");
const app = express();
const topicsRouter = require("./routes/topics-router");
const articlesRouter = require("./routes/articles-router");
const commentsRouter = require("./routes/comments-router");
const usersRouter = require("./routes/users-router");
const endpointsRouter = require("./routes/endpoints-router");
const cors = require('cors')

app.use(cors())

app.use(express.json());

app.use("/api/topics", topicsRouter);
app.use("/api", endpointsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/users", usersRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route Not Found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502" || err.code === "23503") {
    return res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
