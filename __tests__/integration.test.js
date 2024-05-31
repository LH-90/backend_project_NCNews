const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")
const endpoints = require("../endpoints.json")



beforeEach(()=>{
    return seed(data)
  })

afterAll(() => db.end())

// GET /api/topics
describe("GET /api/topics", () => {
    
    test("Status 200: responds with an array of topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            const topics = body.topics
            expect(topics).toHaveLength(3)
            topics.forEach((topic) => {
                expect(topic).toEqual(
                  expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String)
                    })
                )
            })
          })
    })
})


// GET /api/not-an-endpoint
describe("GET /api/not-an-endpoint", () => {    
    test("Status 404: responds with an error message for a route that doesn't exist", () => {
        return request(app)
          .get("/api/stories")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Route Non Found")
            })
    })
})


// GET /api
describe("GET /api", () => {
    
    test("Status 200: responds with an object describing all the available endpoints on the API", () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                expect(body).toEqual(endpoints)
            })
    })    
})



// GET /api/articles/:article_id
describe("GET /api/articles/:article_id", () => {
    
  test("Status 200: responds with an individual object", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toMatchObject({
              author: "icellusedkars",
              title: "Sony Vaio; or, The Laptop",
              article_id: 2,
              body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
              topic: "mitch",
              created_at: "2020-10-16T05:03:00.000Z",
              votes: 0,
              article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            })
        })
  })

  test("Status 400: responds with an error message when article_id is an invalid type", () => {
    return request(app)
        .get("/api/articles/notAnID")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad Request")
            })
  })

  test("Status 404: responds with an error message when article_id is valid but doesn't exist", () => {
    return request(app)
        .get("/api/articles/1000")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Article Not Found")
            })
  })

})


// GET /api/articles
describe("GET /api/articles", () => {
    
  test("Status 200: responds with an array of all the articles sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles
          expect(articles).toHaveLength(13)
          articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  author: expect.any(String),
                  title: expect.any(String),
                  article_id: expect.any(Number),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  article_img_url: expect.any(String),
                  comment_count: expect.any(Number),
                  })
              )
          })
          expect(articles).toBeSortedBy("created_at", { descending: true })
        })
  })  
})

// GET /api/articles/:article_id/comments
describe("GET /api/articles/:article_id/comments", () => {
    
  test("Status 200: responds with an array of comments for a given article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
            const comments = body.comments
            expect(comments).toHaveLength(11)
            comments.forEach((comment) => {
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: expect.any(Number),
                    })
                )
            })
            expect(comments).toBeSortedBy("created_at", { descending: true })
        })
  })

  test("Status 400: responds with an error message when article_id is an invalid type", () => {
    return request(app)
        .get("/api/articles/notAnID/comments")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad Request")
            })
  })

  test("Status 404: responds with an error message when article_id is valid but doesn't exist", () => {
    return request(app)
        .get("/api/articles/1000/comments")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Article Not Found")
            })
  })

  test("Status 200: responds with an empty array when article_id is valid but doesn't have any comments", () => {
    return request(app)
        .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body }) => {
              const comments = body.comments
              expect(comments).toEqual([])
            })
  })

})

// POST /api/articles/:article_id/comments
describe("POST /api/articles/:article_id/comments", () => {
    
  test("Status 201: responds with the posted comment", () => {
      const newComment = {
        username: "icellusedkars",
        body: "No, wrong reasoning"
      }
      return request(app)
        .post("/api/articles/11/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
            const comment = body.comment
                expect(comment).toMatchObject({
                  comment_id: 19,
                  body: 'No, wrong reasoning',
                  article_id: 11,
                  author: 'icellusedkars',
                  votes: 0,
                  created_at: expect.any(String)
                })
    
  })

})

  test("Status 400: responds with an error message when missing a required field", () => {
    const newComment = {
      username: "icellusedkars",
    }
    return request(app)
      .post("/api/articles/11/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
         expect(body.msg).toBe("Bad Request")
      })

  })

  test("Status 400: responds with an error message when passed a non-existant username", () => {
    const newComment = {
      username: "Léa",
      body: "No, wrong reasoning"
    }
    return request(app)
      .post("/api/articles/11/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
         expect(body.msg).toBe("Bad Request")
      })

  })
  
})


// PATCH /api/articles/:article_id
describe("PATCH /api/articles/:article_id", () => {
    
  test("Status 200: responds with the updated comment", () => {
      const updatedArticle = {
        inc_votes: 4
      }
      return request(app)
        .patch("/api/articles/1")
        .send(updatedArticle)
        .expect(200)
        .then(({ body }) => {
            const article = body.article
                expect(article).toMatchObject({
                  title: "Living in the shadow of a great man",
                  topic: "mitch",
                  author: "butter_bridge",
                  body: "I find this existence challenging",
                  created_at: "2020-07-09T20:11:00.000Z",
                  votes: 104,
                  article_img_url:
                    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                })
    
  })

})

  test("Status 400: responds with an error message when missing a required field", () => {
    const updatedArticle = {}
    return request(app)
      .patch("/api/articles/1")
      .send(updatedArticle)
      .expect(400)
      .then(({ body }) => {
         expect(body.msg).toBe("Bad Request")
      })

  })

  test("Status 400: responds with an error message when passed an incorrect type", () => {
    const updatedArticle = {
      inc_votes: "chocolate"
    }
    return request(app)
      .patch("/api/articles/1")
      .send(updatedArticle)
      .expect(400)
      .then(({ body }) => {
         expect(body.msg).toBe("Bad Request")
      })

  })
  
})


// DELETE /api/comments/:comment_id
describe("DELETE /api/comments/:comment_id", () => {
    
  test("Status 204", () => {
      return request(app)
        .delete("/api/comments/5")
        .expect(204)
  })


  test("Status 400: responds with an error message when comment_id is an invalid type", () => {
    return request(app)
        .delete("/api/comments/notAnId")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request")
        })
  })
  

  test("Status 404: responds with an error message when comment_id is valid but doesn't exist", () => {
    return request(app)
        .delete("/api/comments/1000")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Comment Not Found")
            })
  })

})
