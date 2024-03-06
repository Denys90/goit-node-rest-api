import * as fs from "node:fs/promises";
import * as path from "node:path";

import Users from "../models/users.js";
import HttpError from "../helpers/HttpError.js";
// ================================================================>
export const uploadAvatar = async (req, res, next) => {
  const { _id } = req.user;

  try {
    await fs.rename(req.file.path, path.join(process.swd(), "public/avatars", req.file.filename));

    const result = await Users.findByIdAndUpdate(
      _id,
      { avatarURL: req.file.filename },
      { new: true }
    );

    if (result.owner.toString() !== _id) {
      throw HttpError(404, "User not found!");
    }

    if (result === null) {
      throw HttpError(404, "User not found!");
    }

    res.send(result);
  } catch (error) {
    next(error);
  }
};
// ================================================================>
export const getAvatar = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const result = await Users.findById(_id);

    if (result === null) {
      throw HttpError(404, "User not found");
    }

    if (result.avatarURL === null) {
      throw HttpError(404, "Avatar not found");
    }

    res.sendFile(path.join(process.cwd(), "public/avatars", result.avatarURL));
  } catch (error) {
    next(error);
  }
};
