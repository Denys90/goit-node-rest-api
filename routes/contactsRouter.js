import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavoriteInContact,
} from "../controllers/contactsControllers.js";

import validateBody from "../helpers/validateBody.js";
import isValidId from "../helpers/isValidId.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();
const jsonParser = express.json();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post("/", jsonParser, validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", jsonParser, isValidId, validateBody(updateContactSchema), updateContact);

contactsRouter.patch(
  "/:id/favorite",
  jsonParser,
  isValidId,
  validateBody(updateFavoriteSchema),
  updateFavoriteInContact
);

export default contactsRouter;
