const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")


beforeEach(()=>{
    return seed(data)
  })

afterAll(() => db.end())


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

    test("Status 404: responds with an error message for a route that doesn't exist", () => {
        return request(app)
          .get("/api/stories")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Route Non Found")
            })
    })



})