import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse, sendResponse } from "../utils/ApiResponse.js";
import * as statsService from "../services/stats.service.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await statsService.getDashboardStats(req.user.id);
  sendResponse(res, new ApiResponse(200, "Dashboard stats fetched successfully", stats));
});
