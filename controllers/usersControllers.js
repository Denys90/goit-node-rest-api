import * as fs from "node:fs/promises";
import * as path from "node:path";

import Users from "../models/users.js";
import HttpError from "../helpers/HttpError.js";
import { resizeImage } from "../utils/resizeImage.js";

const AVATARS_DIR = path.join(process.cwd(), "public/avatars");
// ================================================================>

export const uploadAvatar = async (req, res, next) => {
  try {
    const newAvatarPath = path.join(AVATARS_DIR, req.file.filename);

    await fs.rename(req.file.path, newAvatarPath);
    await resizeImage(newAvatarPath);

    const user = await Users.findByIdAndUpdate(
      req.user._id,
      { avatarURL: req.file.filename },
      { new: true }
    );

    if (user === null) {
      throw HttpError(404, "User not found");
    }

    res.send({ avatarURL: `/${user.avatarURL}` });
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
