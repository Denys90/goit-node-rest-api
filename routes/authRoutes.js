import express from "express";

import {
  getCurrent,
  login,
  logout,
  register,
  updateSubscription,
} from "../controllers/authControllers.js";

import { auth } from "../Middlewares/auth.js";
import upload from "../Middlewares/upload.js";

import validateBody from "../helpers/validateBody.js";

import { loginSchema, registerSchema, subscriptionSchema } from "../schemas/authSchemas.js";
import { getAvatar, uploadAvatar } from "../controllers/usersControllers.js";

const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post("/register", jsonParser, validateBody(registerSchema), register);
authRouter.post("/login", jsonParser, validateBody(loginSchema), login);

authRouter.get("/current", auth, getCurrent);
authRouter.get("/avatars", auth, jsonParser, getAvatar);

authRouter.patch("/subscription", auth, validateBody(subscriptionSchema), updateSubscription);
authRouter.patch("/avatars", auth, upload.single("avatar"), jsonParser, uploadAvatar);

authRouter.post("/logout", auth, logout);

export default authRouter;
