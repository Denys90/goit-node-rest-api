import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateToContact,
} from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

// ===============================================================>
export const getAllContacts = async (_, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};
// ===============================================================>
export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await getContactById(id);

    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};
// ===============================================================>
export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedContact = await removeContact(id);

    if (!deletedContact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};
// ===============================================================>

export const createContact = async (req, res, next) => {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    const newContact = await addContact(contact.name, contact.email, contact.phone);

    if (newContact.email !== contact.email) {
      throw HttpError(409, "Contact already exists");
    }

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};
// ===============================================================>

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const changedContact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    const nonEmptyFields = Object.entries(changedContact).filter(
      ([_, value]) => value !== null && value !== undefined
    );

    if (nonEmptyFields.length === 0) {
      return res.status(400).json({ message: "Body must have at least one field" });
    }

    const contact = await updateToContact(id);

    if (!contact) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};
