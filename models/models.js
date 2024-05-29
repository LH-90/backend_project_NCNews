const db = require("../db/connection")

exports.selectTopics = () => {
    return db.query("SELECT * FROM topics;")
       .then((result) => {
          return result.rows
       })
}

exports.selectArticleById = (article_id) => {
   return db.query(`SELECT author, title, article_id, body, topic, CAST(created_at AS VARCHAR), votes, article_img_url FROM articles WHERE article_id = $1;`, [article_id])
      .then((result) => {
         if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not Found" })    
         }
         return result.rows[0]
      })
}

exports.selectArticles = (date) => {
   const fields = ["author", "title", "article_id", "topic", "created_at", "votes", "article_img_url", "comment_count"]

   if (date && !fields.includes(date)) {
      return Promise.reject({ status: 400, msg: "Bad Request" })
   }

   let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, CAST(articles.created_at AS VARCHAR), articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count 
   FROM articles
   LEFT JOIN comments
   ON articles.article_id = comments.article_id
   GROUP BY articles.article_id`

   if (fields.includes(date)) {
      queryStr += ` ORDER BY ${date} DESC`
  }
  
  queryStr += ";"
  return db.query(queryStr)
      .then((result) => {
          return result.rows
      }) 

}