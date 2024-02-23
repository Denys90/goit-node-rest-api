import express from "express";

import contactRoutes from "./contactsRouter.js";

const router = express.Router();

router.use("/contacts", contactRoutes);

export default router;
