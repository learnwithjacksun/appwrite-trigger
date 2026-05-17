import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

export const protect = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new AppError("Unauthorized — provide a valid Bearer token", 401);
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    next(new AppError("Invalid or expired token", 401));
  }
};
