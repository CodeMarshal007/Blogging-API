const request = require("supertest");
const connectToTestDatabase = require("../connectToDB/connctToDb");
const UserModel = require("../model/userModel");
const app = require("../app");

describe("Authentication", () => {
  let connection;

  beforeAll(async () => {
    connection = await connectToTestDatabase();
  });

  afterEach(async () => {
    await connection.cleanup();
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it("should save user to database", async () => {
    const response = await request(app)
      .post("/signup")
      .set("content-type", "application/json")
      .send({
        first_name: "Dimeji",
        last_name: "Adeniyi",
        email: "test@gmail.com",
        password: "111111",
        phone_number: "08012345678",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("status", "true");
    expect(response.body).toHaveProperty("message", "Signup successful");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email", "test@gmail.com");
    expect(response.body.user).toHaveProperty("first_name", "Dimeji");
    expect(response.body.user).toHaveProperty("last_name", "Adeniyi");
    expect(response.body.user).toHaveProperty("phone_number", "08012345678");
  });

  it("should login a user and issue a token to the user", async () => {
    const user = await UserModel.create({
      email: "test@gmail.com",
      password: "111111",
    });
    const response = await request(app)
      .post("/login")
      .set("content-type", "application/json")
      .send({
        email: "test@gmail.com",
        password: "111111",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "true");
    expect(response.body).toHaveProperty(
      "message",
      "Issued token successfully"
    );
    expect(response.body).toHaveProperty("token");
  });
});
