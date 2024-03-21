import crypto from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import Users from "../models/users.js";
import HttpError from "../helpers/HttpError.js";
import generateAvatar from "../utils/generateAvatar.js";

const { SECRET_KEY } = process.env;
const { MAILTRAP_USER } = process.env;
const { MAILTRAP_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,

  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASSWORD,
  },
});

// -------------------------------------------------->
export const register = async (req, res, next) => {
  const { email, password } = req.body;

  const normalizedEmail = email.toLowerCase();

  try {
    const avatarPath = await generateAvatar(normalizedEmail);

    const user = await Users.findOne({ email: normalizedEmail });

    if (user !== null) {
      throw HttpError(409, "Email in use!");
    }

    const hachPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();

    await transporter.sendMail({
      to: email,
      from: "DM__90@gmail.com",
      subject: "Welcome to FindContacts",
      html: `To confirm your registration please click on the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
      text: `To confirm you registration please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
    });

    const newUser = await Users.create({
      verificationToken,
      email: normalizedEmail,
      password: hachPassword,
      avatarURL: avatarPath,
    });

    res.status(201).send({ user: { email, subscription: newUser.subscription } });
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

    if (user.verify === false) {
      throw HttpError(401, "Your account is not verified");
    }

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
// -------------------------------------------------->
export const verifyUser = async (req, res, next) => {
  const { verificationToken } = req.params;

  try {
    const user = await Users.findOne({ verificationToken });

    if (user === null) {
      throw HttpError(404, "User not found");
    }

    await Users.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

    res.send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};
// -------------------------------------------------->

export const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      throw HttpError(400, "Missing required field email");
    }

    const normalizedEmail = email.toLowerCase();

    const user = await Users.findOne({ email: normalizedEmail });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    const verificationToken = crypto.randomUUID();

    await transporter.sendMail({
      to: email,
      from: "DM__90@gmail.com",
      subject: "Welcome to FindContacts",
      html: `To confirm your registration please click on the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
      text: `To confirm you registration please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
    });

    res.status(200).send({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
