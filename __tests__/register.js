import "dotenv";

import supertest from "supertest";
import mongoose from "mongoose";

import app from "../app.js";
// ==============================================>
const DB_URI = process.env.DB_URI;
const REGISTER_URL = "/api/users/register";
// ==============================================>
async function registerUser(credentials) {
  return await supertest(app).post(REGISTER_URL).send(credentials);
}
// ==============================================>
describe("register", () => {
  beforeAll(async () => {
    await mongoose.connect(DB_URI);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("Successful register", async () => {
    const userCredentials = {
      email: "DM1@gmail.com",
      password: "123qwe123 ",
    };
    const response = await registerUser(userCredentials);

    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          email: expect.any(String),
          subscription: expect.any(String),
        }),
      })
    );
  }, 40000); // Додав затримку в 40000, т.я. погане підключення до інтернету і тест падав!

  test("Unsuccessful register, email in use!", async () => {
    const userCredentials = { email: "DM1@gmail.com", password: "123qwe123" };
    await registerUser(userCredentials);

    const response = await registerUser(userCredentials);

    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({
      message: "Email in use!",
    });
  });
});
// ==============================================>
