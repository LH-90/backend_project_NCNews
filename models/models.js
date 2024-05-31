const db = require("../db/connection")


exports.selectTopics = () => {
    return db.query("SELECT * FROM topics;")
       .then((result) => {
          return result.rows
       })
}

exports.selectArticleById = (article_id) => {
   return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
      .then((result) => {
         if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article Not Found" })    
         }
         return result.rows[0]
      })
}

exports.selectArticles = () => {
   return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count 
   FROM articles
   LEFT JOIN comments
   ON articles.article_id = comments.article_id
   GROUP BY articles.article_id
   ORDER BY created_at DESC;`)
      .then((result) => {
          return result.rows
      }) 

}


exports.selectCommentsByArticle = (article_id) => {
        return db.query(`SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;`, [article_id])
        .then((result) => {
           return result.rows
        })
}
 

exports.insertComment = (article_id, username, body) => {
   return db.query(`INSERT INTO comments (body, article_id, author)
   VALUES ($1, $2, $3) RETURNING *;`, [body, article_id, username])
   .then((result) => {
      return result.rows[0]
   })
}

exports.modifyArticle = (inc_votes, article_id) => {
   return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*;`, [inc_votes, article_id])
   .then((result) => {
         return result.rows[0]
      })
}


exports.removeComment = (comment_id) => {
   return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [comment_id])
   .then((result) => {
      if (result.rowCount === 0) {
         return Promise.reject({ status: 404, msg: "Comment Not Found" })    
      }
   })
}
