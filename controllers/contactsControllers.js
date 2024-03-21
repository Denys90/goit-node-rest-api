import HttpError from "../helpers/HttpError.js";

import Contact from "../models/contacts.js";

// ===============================================================>
export const getAllContacts = async (req, res, next) => {
  const { page = 1, limit = 2, favorite } = req.query;

  const skip = (page - 1) * limit;

  try {
    const query = { owner: req.user._id };

    if (favorite !== undefined) {
      query.favorite = favorite.toLowerCase() === "true";
    }
    const result = await Contact.find(query).skip(skip).limit(limit);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
// ===============================================================>
export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await Contact.findById(id);

    if (!result) {
      throw HttpError(404, "Not found");
    }

    if (result.owner.toString() !== req.user._id) {
      throw HttpError(404, "Contact not found");
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
// ===============================================================>
export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await Contact.findByIdAndDelete(id);

    if (result.owner.toString() !== req.user._id) {
      throw HttpError(404, "Contact not found");
    }

    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
// // ===============================================================>

export const createContact = async (req, res, next) => {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      owner: req.user._id,
    };
    const existingContact = await Contact.findOne({ email: contact.email });

    if (existingContact) {
      throw HttpError(409, "Contact already exists");
    }

    const result = await Contact.create(contact);
    console.log(result);

    res.status(201).json(result);
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
      ([key, value]) => value !== null && value !== undefined
    );

    if (nonEmptyFields.length === 0) {
      return res.status(400).json({ message: "Body must have at least one field" });
    }

    const result = await Contact.findByIdAndUpdate(id, changedContact, { new: true });

    if (result === null) {
      throw HttpError(404, "Not found");
    }

    if (result.owner.toString() !== req.user._id) {
      throw HttpError(404, "Contact not found");
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
// ===============================================================>
export const updateFavoriteInContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const favorite = req.body.favorite;

    const result = await Contact.findByIdAndUpdate(id, { favorite }, { new: true });

    if (!result) {
      throw HttpError(404, "Not found");
    }

    if (result.owner.toString() !== req.user._id) {
      throw HttpError(404, "Contact not found");
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
