const {selectTopics, selectArticleById} = require("../models/models")
const fs = require("fs/promises")



exports.getTopics = (req, res) => {
    return selectTopics()
      .then((topics) => {
        res.status(200).send({ topics })
      }) 
}

exports.getEndpoints = (req, res) => {
    fs.readFile(__dirname + "/../endpoints.json", "utf-8")
        .then((result) => {
            res.status(200).send(JSON.parse(result))
        })
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    return selectArticleById(article_id)
      .then((article) => {
        res.status(200).send({ article })
      })
      .catch(next)

}