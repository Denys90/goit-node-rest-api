import "dotenv";

import supertest from "supertest";
import mongoose from "mongoose";

import app from "../app.js";
import Users from "../models/users.js";
// ==============================================>
const DB_URI = process.env.DB_URI;
const LOGIN_URL = "/api/users/login";
const REGISTER_URL = "/api/users/register";
// ==============================================>

async function loginUser(credentials) {
  return await supertest(app).post(LOGIN_URL).send(credentials);
}
// ---
async function registerUser(credentials) {
  return await supertest(app).post(REGISTER_URL).send(credentials);
}
// ==============================================>
describe("login", () => {
  beforeAll(async () => {
    await mongoose.connect(DB_URI);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("Successful login", async () => {
    const userCredentials = { email: "DM1@gmail.com", password: "123qwe123" };
    const registerationResponse = await registerUser(userCredentials);

    const verificationToken = registerationResponse.body.verificationToken;

    const user = await Users.findOne({ verificationToken });

    if (!user) {
      throw new Error("User not found");
    }

    await Users.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

    const loginResponse = await loginUser(userCredentials);

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.token).toStrictEqual(expect.any(String));
    expect(loginResponse.body.user).toStrictEqual(
      expect.objectContaining({
        email: expect.any(String),
        subscription: expect.any(String),
      })
    );
  }, 50000); // Додав затримку в 50000, т.я. погане підключення до інтернету і тест падав!

  test("Unsuccessful login", async () => {
    const userCredentials = { email: "DM2@gmail.com", password: "123qwe123" };
    const response = await loginUser(userCredentials);

    expect(response.statusCode).toBe(401);
  });
});
// ==============================================>
