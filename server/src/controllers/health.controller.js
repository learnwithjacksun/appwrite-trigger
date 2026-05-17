import mongoose from "mongoose";
import process from "process";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse, sendResponse } from "../utils/ApiResponse.js";

export const getHealth = asyncHandler(async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? "connected" : "disconnected";

  sendResponse(
    res,
    new ApiResponse(200, "Service is healthy", {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbStatus,
    }),
  );
});
