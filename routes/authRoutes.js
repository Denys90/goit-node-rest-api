import express from "express";

import {
  getCurrent,
  login,
  logout,
  register,
  resendVerificationEmail,
  updateSubscription,
  verifyUser,
} from "../controllers/authControllers.js";
import { getAvatar, uploadAvatar } from "../controllers/usersControllers.js";

import { auth } from "../Middlewares/auth.js";
import upload from "../Middlewares/upload.js";

import validateBody from "../helpers/validateBody.js";

import {
  loginSchema,
  registerSchema,
  subscriptionSchema,
  verifyEmailSchema,
} from "../schemas/authSchemas.js";

const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post("/register", jsonParser, validateBody(registerSchema), register);
authRouter.post("/login", jsonParser, validateBody(loginSchema), login);
authRouter.post("/verify", validateBody(verifyEmailSchema), resendVerificationEmail);
authRouter.post("/logout", auth, logout);

authRouter.get("/current", auth, getCurrent);
authRouter.get("/avatars", auth, jsonParser, getAvatar);
authRouter.get("/verify/:verificationToken", verifyUser);

authRouter.patch("/subscription", auth, validateBody(subscriptionSchema), updateSubscription);
authRouter.patch("/avatars", auth, upload.single("avatar"), jsonParser, uploadAvatar);

export default authRouter;
