const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => db.end());

// GET /api/topics
describe("GET /api/topics", () => {
  test("Status 200: responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

// GET /api/nonExistingRoute
describe("GET /api/nonExistingRoute", () => {
  test("Status 404: responds with an error message for a route that doesn't exist", () => {
    return request(app)
      .get("/api/stories")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route Not Found");
      });
  });
});

// GET /api
describe("GET /api", () => {
  test("Status 200: responds with an object describing all the available endpoints on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
});

// GET /api/articles/:article_id (comment_count)
describe("GET /api/articles/:article_id", () => {
  test("Status 200: responds with an individual object which contains the articles properties", () => {
    return request(app)
      .get("/api/articles/9")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          title: "They're not exactly dogs, are they?",
          topic: "mitch",
          author: "butter_bridge",
          body: "Well? Think about it.",
          created_at: "2020-06-06T09:10:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("Status 200: responds with an individual object which contains comment_count added to the articles properties", () => {
    return request(app)
      .get("/api/articles/9?comment_count=9")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          title: "They're not exactly dogs, are they?",
          topic: "mitch",
          author: "butter_bridge",
          body: "Well? Think about it.",
          created_at: "2020-06-06T09:10:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 2,
        });
      });
  });

  test("Status 400: responds with an appropriate error message when article_id is an invalid type", () => {
    return request(app)
      .get("/api/articles/notAnID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Status 404: responds with an appropriate error message when article_id is valid but doesn't exist", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found");
      });
  });
});

// GET /api/articles (topic query)
describe("GET /api/articles", () => {
  test("Status 200: responds with an array of all the articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(13);
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
          );
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("Status 200: responds with an array of articles filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("Status 404: responds with an appropriate error message when passed a non existing topic", () => {
    return request(app)
      .get("/api/articles?topic=music")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Non Existing Topic");
      });
  });

  test("Status 200: responds with an empty array when a topic exists but has no associated articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toEqual([]);
      });
  });

  test("Status 200: responds with an array of articles sorted by title in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });

  test("Status 400: responds with an appropriate error message when passed an invalid sort_by value", () => {
    return request(app)
      .get("/api/articles?sort_by=movie")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort_by value");
      });
  });

  test("Status 200: responds with an array of articles ordered by ascending order", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("created_at");
      });
  });

  test("Status 200: responds with an array of articles ordered by descending order", () => {
    return request(app)
      .get("/api/articles?order=DESC")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("Status 400: responds with an appropriate error message when passed an invalid order value", () => {
    return request(app)
      .get("/api/articles?order=restaurant")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order value");
      });
  });

  test("Status 200: responds with an array of articles filtered by topic and sorted by title in ascending order", () => {
    return request(app)
      .get("/api/articles?topic=cats&sort_by=title&order=ASC")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(1);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
        expect(articles).toBeSortedBy("title");
      });
  });
});

// GET /api/articles/:article_id/comments
describe("GET /api/articles/:article_id/comments", () => {
  test("Status 200: responds with an array of comments sorted by date in descending order for a given article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toHaveLength(11);
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
          );
        });
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("Status 400: responds with an appropriate error message when article_id is an invalid type", () => {
    return request(app)
      .get("/api/articles/notAnID/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Status 404: responds with an appropriate error message when article_id is valid but doesn't exist", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found");
      });
  });

  test("Status 200: responds with an empty array when article_id exists but doesn't have any comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toEqual([]);
      });
  });
});

// POST /api/articles/:article_id/comments
describe("POST /api/articles/:article_id/comments", () => {
  test("Status 201: responds with the posted comment", () => {
    const newComment = {
      username: "icellusedkars",
      body: "No, wrong reasoning",
    };
    return request(app)
      .post("/api/articles/11/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toMatchObject({
          comment_id: 19,
          body: "No, wrong reasoning",
          article_id: 11,
          author: "icellusedkars",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });

  test("Status 400: responds with an appropriate error message when article_id is an invalid type", () => {
    return request(app)
      .post("/api/articles/notAnID/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Status 404: responds with an appropriate error message when article_id is valid but doesn't exist", () => {
    return request(app)
      .post("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found");
      });
  });

  test("Status 400: responds with an appropriate error message when missing a required property", () => {
    const newComment = {
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/11/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Status 400: responds with an appropriate error message when passed an invalid property", () => {
    const newComment = {
      username: 50,
      body: "No, wrong reasoning",
    };
    return request(app)
      .post("/api/articles/11/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Status 400: responds with an appropriate error message when passed a valid but non-existant username (foreign key constraint violation)", () => {
    const newComment = {
      username: "Léa",
      body: "No, wrong reasoning",
    };
    return request(app)
      .post("/api/articles/11/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

// PATCH /api/articles/:article_id
describe("PATCH /api/articles/:article_id", () => {
  test("Status 200: responds with the updated article", () => {
    const updatedArticle = {
      inc_votes: 4,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedArticle)
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 104,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("Status 400: responds with an appropriate error message when missing a required field", () => {
    const updatedArticle = {};
    return request(app)
      .patch("/api/articles/1")
      .send(updatedArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Status 400: responds with an appropriate error message when passed an invalid type", () => {
    const updatedArticle = {
      inc_votes: "chocolate",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Status 400: responds with an appropriate error message when article_id is an invalid type", () => {
    return request(app)
      .patch("/api/articles/notAnID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Status 404: responds with an appropriate error message when article_id is valid but doesn't exist", () => {
    return request(app)
      .patch("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found");
      });
  });
});

// DELETE /api/comments/:comment_id
describe("DELETE /api/comments/:comment_id", () => {
  test("Status 204", () => {
    return request(app).delete("/api/comments/5").expect(204);
  });

  test("Status 400: responds with an appropriate error message when comment_id is an invalid type", () => {
    return request(app)
      .delete("/api/comments/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Status 404: responds with an appropriate error message when comment_id is valid but doesn't exist", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment Not Found");
      });
  });
});

// GET /api/users
describe("GET /api/users", () => {
  test("Status 200: responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

// GET /api/users/:username
describe("GET /api/users/:username", () => {
  test("Status 200: responds with an individual object containing the user properties", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const user = body.user;
        expect(user).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });

  test("Status 404: responds with an appropriate error message when username doesn't exist", () => {
    return request(app)
      .get("/api/users/Alex")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Non Existing Username");
      });
  });
});

// PATCH /api/comments/:comment_id
describe("PATCH api/comments/:comment_id", () => {
  test("Status 200: responds with the updated comment", () => {
    const updatedComment = {
      inc_votes: 20,
    };
    return request(app)
      .patch("/api/comments/9")
      .send(updatedComment)
      .expect(200)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toMatchObject({
          body: "Superficially charming",
          votes: 20,
          author: "icellusedkars",
          article_id: 1,
          created_at: "2020-01-01T03:08:00.000Z",
        });
      });
  });

  test("Status 400: responds with an appropriate error message when missing a required field", () => {
    const updatedComment = {};
    return request(app)
      .patch("/api/comments/9")
      .send(updatedComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Status 400: responds with an appropriate error message when passed an invalid type", () => {
    const updatedArticle = {
      inc_votes: "actor",
    };
    return request(app)
      .patch("/api/comments/9")
      .send(updatedArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Status 400: responds with an appropriate error message when comment_id is an invalid type", () => {
    return request(app)
      .patch("/api/comments/notAnID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Status 404: responds with an appropriate error message when comment_id is valid but doesn't exist", () => {
    return request(app)
      .patch("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment Not Found");
      });
  });
});

// POST /api/articles

describe("POST /api/articles", () => {
  test("Status 201: responds with the posted article", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "Hamlet",
      body: "To be, or not to be, that is the question",
      topic: "paper",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        const article = body.Addedarticle;
        expect(article).toMatchObject({
          article_id: 14,
          title: "Hamlet",
          topic: "paper",
          author: "butter_bridge",
          body: "To be, or not to be, that is the question",
          created_at: expect.any(String),
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
          comment_count: 0,
        });
      });
  });

  test("Status 400: responds with an appropriate error message when missing a required property", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "Hamlet",
      body: "To be, or not to be, that is the question",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Status 400: responds with an appropriate error message when passed an invalid property", () => {
    const newArticle = {
      author: true,
      title: "Hamlet",
      body: "To be, or not to be, that is the question",
      topic: "paper",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Status 400: responds with an appropriate error message when passed a valid but non-existant author (foreign key constraint violation)", () => {
    const newArticle = {
      author: "William Shakespeare",
      title: "Hamlet",
      body: "To be, or not to be, that is the question",
      topic: "paper",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
