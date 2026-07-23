import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse, sendResponse } from "../utils/ApiResponse.js";

export const getPing = asyncHandler(async (req, res) => {
  sendResponse(
    res,
    new ApiResponse(200, "pong", {
      timestamp: new Date().toISOString(),
    }),
  );
});
