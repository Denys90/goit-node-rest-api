import jwt from "jsonwebtoken";

import Users from "../models/users.js";

const { SECRET_KEY } = process.env;

export const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (typeof authorization === "undefined") {
    return res.status(401).send({ message: "Invalid token" });
  }

  const [bearer, token] = authorization.split(" ", 2);

  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Invalid token" });
  }

  jwt.verify(token, SECRET_KEY, async (err, decode) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).send({ message: "Token expired" });
      }
      return res.status(401).send({ message: "Invalid token" });
    }

    const user = await Users.findById(decode.id);

    if (user.token !== token) {
      return res.status(401).send({ message: "Invalid token" });
    }

    req.user = {
      _id: decode.id,
      name: decode.name,
    };

    next();
  });
};
