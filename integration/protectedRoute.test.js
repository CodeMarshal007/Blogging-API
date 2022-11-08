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

describe("Protected blog routes", () => {
  it("should add a new article to the database", async () => {
    let body = {
      title: "Of Africa",
      description: "History of Africa",
      author: "Wole Soyinka",
      tags: "#Africa",
      body: "The essence of 'The Truth' that uses a bit of African history as a vehicle of expression",
    };
    const response = await api
      .post("/article")
      .set("Authorization", `Bearer ${token}`)
      .send(body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("status", true);
    expect(response.body).toHaveProperty(
      "message",
      "successfully created an article"
    );
    expect(response.body).toHaveProperty("article");
    expect(response.body.article).toHaveProperty("title");
    expect(response.body.article).toHaveProperty("author");
    expect(response.body.article).toHaveProperty("state", "draft");
    expect(typeof response.body.article.read_count).toBe("number");
    expect(response.body.article).toHaveProperty("tags");
    expect(Array.isArray(response.body.article.tags)).toBe(true);
    expect(response.body.article).toHaveProperty("body");
    expect(response.body.article).toHaveProperty("postedBy");
    expect(response.body.article).toHaveProperty("createdAt");
    expect(response.body.article).toHaveProperty("updatedAt");
    expect(response.body.article).toHaveProperty("reading_time");
  });

  it("should get a list of users article", async () => {
    const response = await api
      .get("/article/myarticles")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", true);
    expect(response.body).toHaveProperty(
      "message",
      "successfully loaded all your article(s)"
    );
    expect(response.body).toHaveProperty("filteredArticles");
    expect(response.body.filteredArticles[0]).toHaveProperty("title");
    expect(response.body.filteredArticles[0]).toHaveProperty("author");
    expect(response.body.filteredArticles[0]).toHaveProperty("state");
    expect(typeof response.body.filteredArticles[0].read_count).toBe("number");
    expect(response.body.filteredArticles[0]).toHaveProperty("tags");
    expect(Array.isArray(response.body.filteredArticles[0].tags)).toBe(true);
    expect(response.body.filteredArticles[0]).toHaveProperty("body");
    expect(response.body.filteredArticles[0]).toHaveProperty("createdAt");
    expect(response.body.filteredArticles[0]).toHaveProperty("updatedAt");
    expect(response.body.filteredArticles[0]).toHaveProperty("reading_time");
  });
});

afterAll(async () => {
  await Article.deleteMany({});
  await mongoose.connection.close();
});
