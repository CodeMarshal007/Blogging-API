const supertest = require("supertest");
const mongoose = require("mongoose");
const UserModel = require("../model/userModel");
const app = require("../app");

const api = supertest(app);

beforeEach(async () => {
  await UserModel.deleteMany({});
});

describe("Authentication", () => {
  it("should save user to database", async () => {
    const body = {
      first_name: "Dimeji",
      last_name: "Adeniyi",
      email: "test@gmail.com",
      password: "111111",
      phone_number: "08012345678",
    };

    const response = await api
      .post("/user/signup")
      .set("content-type", "application/json")
      .send(body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("status", true);
    expect(response.body).toHaveProperty("message", "Signup successful");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email", "test@gmail.com");
    expect(response.body.user).toHaveProperty("first_name", "Dimeji");
    expect(response.body.user).toHaveProperty("last_name", "Adeniyi");
    expect(response.body.user).toHaveProperty("phone_number", 8012345678);
  });

  it("should login a user and issue a token to the user", async () => {
    const user = await UserModel.create({
      first_name: "Dimeji",
      last_name: "Adeniyi",
      email: "test@gmail.com",
      password: "111111",
      phone_number: "08012345678",
    });
    const response = await api
      .post("/user/login")
      .set("content-type", "application/json")
      .send({
        email: "test@gmail.com",
        password: "111111",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", true);
    expect(response.body).toHaveProperty(
      "message",
      "Issued token successfully"
    );
    expect(response.body).toHaveProperty("token");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
