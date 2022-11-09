const supertest = require("supertest");
const mongoose = require("mongoose");
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
      title: "4 Of Africa",
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

  it("should allow logged in users to be able to get their blog by Id", async () => {
    const response = await api

      .get("/article/636ae2858573862d6f272633") //got an Id of an article to test get an article by Id is working
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

  it("should allow logged in users to be able to update their own blog by Id", async () => {
    const body = {
      title: "testing 3",
    };
    const response = await api
      .patch("/article/636ae2858573862d6f272633") //got an Id of an article to test update an article by Id is working
      .set("Authorization", `Bearer ${token}`)
      .send(body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", true);
    expect(response.body).toHaveProperty(
      "message",
      "successfully updated an article"
    );
    expect(response.body).toHaveProperty("updatedArticle");
    expect(response.body.updatedArticle).toHaveProperty("acknowledged", true);
    expect(
      response.body.updatedArticle &&
        typeof response.body.updatedArticle === "object"
    ).toBe(true);
  });

  it("should allow logged in users to be able to delete their own blog by Id", async () => {
    const response = await api
      .delete("/article/636ae2858573862d6f272633") //got an Id of an article to test delete an article by Id is working
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toBe(204);
  });
});

afterAll(async () => {
  // await Article.deleteMany({});
  await mongoose.connection.close();
});
