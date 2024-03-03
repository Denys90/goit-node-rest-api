import express from "express";

import { getCurrent, login, logout, register } from "../controllers/authControllers.js";

import { auth } from "../Middlewares/auth.js";

import validateBody from "../helpers/validateBody.js";

import { loginSchema, registerSchema } from "../schemas/usersSchemas.js";

const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post("/register", jsonParser, validateBody(registerSchema), register);
authRouter.post("/login", jsonParser, validateBody(loginSchema), login);
authRouter.get("/current", auth, getCurrent);
authRouter.post("/logout", auth, logout);

export default authRouter;
