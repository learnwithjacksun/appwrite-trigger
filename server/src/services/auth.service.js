import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

const signToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("Email already registered", 409);
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user);

  return { user: sanitizeUser(user), token };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken(user);
  return { user: sanitizeUser(user), token };
};
