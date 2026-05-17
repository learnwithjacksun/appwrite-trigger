import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

export const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (env.nodeEnv === "development") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(env.nodeEnv === "development" && { stack: err.stack }),
  });
};
