const express = require("express")
const app = express()
const {getTopics, getEndpoints, getArticleById} = require("./controllers/controllers")


app.get("/api/topics", getTopics)

app.get('/api', getEndpoints)

app.get('/api/articles/:article_id', getArticleById)






app.all("*", (req, res) => {
    res.status(404).send({ msg: "Route Non Found" })
})


app.use((err, req, res, next) => {
  if (err.code === "22P02") {
      return res.status(400).send({ msg: "Bad Request" })
  } else {
    next(err)
  }
})

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg })
  }
})



module.exports = app