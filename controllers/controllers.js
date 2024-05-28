const {selectTopics} = require("../models/models")
const fs = require("fs")



exports.getTopics = (req, res) => {
    return selectTopics()
      .then((topics) => {
        res.status(200).send({ topics })
      }) 
}

exports.getEndpoints = (req, res) => {
    fs.readFile(__dirname + "/../endpoints.json", "utf-8", (err, data) => {
        if (err) {
            console.log(err)
        } else {
            res.status(200).send(JSON.parse(data))
        }
    })
}