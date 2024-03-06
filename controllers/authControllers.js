import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import gravatar from "gravatar";

import Users from "../models/users.js";
import HttpError from "../helpers/HttpError.js";

const { SECRET_KEY } = process.env;
// -------------------------------------------------->
export const register = async (req, res, next) => {
  const { email, password } = req.body;

  const normalizedEmail = email.toLowerCase();

  const options = {
    size: 200,
    rating: "pg",
    default: "identicon",
  };
  const avatarURL = gravatar.url(normalizedEmail, options);

  const user = await Users.findOne({ email: avatarURL });

  if (user !== null) {
    return res.status(409).send({ message: "Email in use!" });
  }

  const hachPassword = await bcrypt.hash(password, 10);

  const newUser = await Users.create({
    email: normalizedEmail,
    password: hachPassword,
    avatarURL,
  });

  res.status(201).send({ user: { email, subscription: newUser.subscription } });
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

    res.status(200).send({ token, user: { subscription: user.subscription, email: user.email } });
  } catch (error) {
    next(error);
  }
};
// -------------------------------------------------->
export const getCurrent = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const currentUser = await Users.findById(_id);

    res.status(200).send({ email: currentUser.email, subscription: currentUser.subscription });
  } catch (error) {
    next(error);
  }
};
// -------------------------------------------------->
export const logout = async (req, res, next) => {
  const { _id } = req.user;

  try {
    await Users.findByIdAndUpdate(_id, { token: null });

    res.status(204).send({ message: "No Content" });
  } catch (error) {
    next(error);
  }
};
// -------------------------------------------------->

export const updateSubscription = async (req, res, next) => {
  const { _id } = req.user;

  const subscription = req.body.subscription;

  const possibleSubscriptions = ["starter", "pro", "business"];

  if (!possibleSubscriptions.includes(subscription)) {
    throw HttpError(404, "Invalid subscription value");
  }

  try {
    const user = await Users.findById(_id);

    if (!user) {
      throw HttpError(404, "User not found");
    }

    user.subscription = subscription;
    await user.save();

    res.status(200).json({ id: user._id, subscription: user.subscription });
  } catch (error) {
    next(error);
  }
};
