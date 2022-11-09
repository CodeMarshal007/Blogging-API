const supertest = require("supertest");
const mongoose = require("mongoose");
const Article = require("../model/blogModel");
const app = require("../app");

const api = supertest(app);

let token = " ";

beforeAll(async () => {
  const response = await api
    .post("/user/login")
    .set("content-type", "application/json")
    .send({
      email: "test@gmail.com",
      password: "111111",
    });
  token = response.body.token;
});

describe("get own article by Id", async () => {
  const article = await Article.create({
    title: "Second Of Africa",
    description: "History of Africa",
    author: "Wole Soyinka",
    tags: "#Africa",
    body: "The essence of 'The Truth' that uses a bit of African history as a vehicle of expression",
  });

  console.log(article);
  it("should allow logged in users to be able to get their blog by Id", async () => {
    const response = await api

      .get("/636991b766dc785af80bd7c4") //got an Id of an article to test get an article by Id is working
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", true);
    expect(response.body).toHaveProperty(
      "message",
      "successfully sent an article"
    );
    expect(response.body).toHaveProperty("article");
    expect(response.body.article).toHaveProperty("title");
    expect(response.body.article).toHaveProperty("author");
    expect(response.body.article).toHaveProperty("state");
    expect(typeof response.body.article.read_count).toBe("number");
    expect(response.body.article).toHaveProperty("tags");
    expect(Array.isArray(response.body.article.tags)).toBe(true);
    expect(response.body.article).toHaveProperty("body");
    expect(response.body.article).toHaveProperty("postedBy");
    expect(
      response.body.article.postedBy &&
        typeof response.body.article.postedBy === "object"
    ).toBe(true);
    expect(response.body.article.postedBy).toHaveProperty("first_name");
    expect(response.body.article.postedBy).toHaveProperty("last_name");
    expect(response.body.article.postedBy).toHaveProperty("email");
    expect(response.body.article.postedBy).toHaveProperty("phone_number");

    expect(response.body.article).toHaveProperty("createdAt");
    expect(response.body.article).toHaveProperty("updatedAt");
    expect(response.body.article).toHaveProperty("reading_time");
  });
});

afterAll(async () => {
  await Article.deleteMany({});
  await mongoose.connection.close();
});
