import express from "express";

import { getAvatar, uploadAvatar } from "../controllers/usersControllers.js";

const userRouter = express.Router();
const jsonParser = express.json();

userRouter.patch("/avatars", jsonParser, uploadAvatar);
userRouter.get("/avatars", jsonParser, getAvatar);

export default userRouter;
