const express = require("express")
const app = express()
const {getTopics, getEndpoints} = require("./controllers/controllers")
const fs = require("fs")

app.get("/api/topics", getTopics)

app.get('/api', getEndpoints)








app.all("*", (req, res) => {
    res.status(404).send({ msg: "Route Non Found" })
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  })



//   app.listen(9090, (err) => {
//     if (err) console.log(err)
//     else console.log("Listening on port 9090")
// })


module.exports = app