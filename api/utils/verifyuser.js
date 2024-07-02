import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, "Un Authorized"));
  jwt.verify(
    token, 
    process.env.JWT_SECRET, 
    (err, user) => {
    if (err) return next(errorHandler(404, "Forbidden User"));
    req.user = user;
    next();
  });
};
