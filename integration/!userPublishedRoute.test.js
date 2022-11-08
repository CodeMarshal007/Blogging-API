const supertest = require("supertest");
const mongoose = require("mongoose");
const UserModel = require("../model/userModel");
const app = require("../app");

const api = supertest(app);

beforeEach(async () => {
  await UserModel.deleteMany({});
});

describe("Non protected blog routes", () => {
  it("should allow logged in and not logged in users to be able to get a list of published blogs", async () => {
    const response = await api
      .get("/")
      .set("content-type", "application/json")
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", true);
    expect(response.body).toHaveProperty(
      "message",
      "successfully loaded all published articles"
    );
    expect(response.body).toHaveProperty("articles");
    expect(response.body.articles[0]).toHaveProperty("title");
    expect(response.body.articles[0]).toHaveProperty("author");
    expect(response.body.articles[0]).toHaveProperty("state", "published");
    expect(typeof response.body.articles[0].read_count).toBe("number");
    expect(response.body.articles[0]).toHaveProperty("tags");
    expect(Array.isArray(response.body.articles[0].tags)).toBe(true);
    expect(response.body.articles[0]).toHaveProperty("body");
    expect(response.body.articles[0]).toHaveProperty("postedBy");
    expect(response.body.articles[0]).toHaveProperty("createdAt");
    expect(response.body.articles[0]).toHaveProperty("updatedAt");
    expect(response.body.articles[0]).toHaveProperty("reading_time");
  });

  it("should allow logged in and not logged in users to be able to get a blog by Id", async () => {
    const response = await api
      .get("/636991b766dc785af80bd7c4") //got an Id of an article to test get an article by Id is working
      .set("content-type", "application/json")
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", true);
    expect(response.body).toHaveProperty(
      "message",
      "successfully loaded a published article by Id"
    );
    expect(response.body).toHaveProperty("article");
    expect(response.body.article).toHaveProperty("title");
    expect(response.body.article).toHaveProperty("author");
    expect(response.body.article).toHaveProperty("state", "published");
    expect(typeof response.body.article.read_count).toBe("number");
    expect(response.body.article).toHaveProperty("tags");
    expect(Array.isArray(response.body.article.tags)).toBe(true);
    expect(response.body.article).toHaveProperty("body");
    expect(response.body.article).toHaveProperty("postedBy");
    expect(response.body.article).toHaveProperty("createdAt");
    expect(response.body.article).toHaveProperty("updatedAt");
    expect(response.body.article).toHaveProperty("reading_time");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
