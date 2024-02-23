import mongoose from "mongoose";

import HttpError from "./HttpError.js";

const isValidId = (req, _, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(HttpError(400, `${id} is not valid id`));
  }
  next();
};

export default isValidId;
