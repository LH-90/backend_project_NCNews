const express = require("express")
const app = express()
const {getTopics} = require("./controllers/controllers")

app.get("/api/topics", getTopics)

app.all("*", (req, res) => {
    res.status(404).send({ msg: "Route Non Found" })
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  })

  

module.exports = app