import express from "express";

import contactRoutes from "./contactsRouter.js";
import authRoutes from "./authRoutes.js";
import userRouter from "./usersRouters.js";

import { auth } from "../Middlewares/auth.js";

const routes = express.Router();

routes.use("/contacts", auth, contactRoutes);
routes.use("/users", authRoutes);
routes.use("/avatars", auth, userRouter);

export default routes;
