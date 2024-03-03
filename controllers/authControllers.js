import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Users from "../models/users.js";
import HttpError from "../helpers/HttpError.js";

const { SECRET_KEY } = process.env;
// -------------------------------------------------->
export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const normalizedEmail = email.toLowerCase();

  const user = await Users.findOne({ email: normalizedEmail });

  if (user !== null) {
    return res.status(409).send({ message: "User already registered" });
  }

  const hachPassword = await bcrypt.hash(password, 10);

  await Users.create({
    name,
    email: normalizedEmail,
    password: hachPassword,
  });

  res.status(201).send({ message: "Registration successfully" });
  try {
  } catch (error) {
    next(error);
  }
};
// -------------------------------------------------->
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const normalizedEmail = email.toLowerCase();
  try {
    const user = await Users.findOne({ email: normalizedEmail });
    if (user === null) {
      throw HttpError(401, "Email or password invalid");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password invalid");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    await Users.findByIdAndUpdate(user._id, { token });

    res.send({ token });
  } catch (error) {
    next(error);
  }
};
// -------------------------------------------------->
export const getCurrent = async (req, res, next) => {
  const { name, email } = req.user;
  res.send({ name, email });
};
// -------------------------------------------------->
export const logout = async (req, res, next) => {
  const { id } = req.user;
  await Users.findbyIdAndUpdate(id, { token: null });
  res.status(204).send({ message: "Logout success" });
};
// -------------------------------------------------->
