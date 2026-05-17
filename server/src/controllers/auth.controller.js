import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse, sendResponse } from "../utils/ApiResponse.js";
import * as authService from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.validated.body);
  sendResponse(
    res,
    new ApiResponse(201, "User registered successfully", result),
  );
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.validated.body);
  sendResponse(res, new ApiResponse(200, "Login successful", result));
});
