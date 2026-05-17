import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse, sendResponse } from "../utils/ApiResponse.js";
import * as pingService from "../services/ping.service.js";

export const pingProject = asyncHandler(async (req, res) => {
  const result = await pingService.pingProjectById(
    req.validated.params.id,
    req.user.id,
    "manual",
  );

  const statusCode = result.success ? 200 : 502;
  sendResponse(
    res,
    new ApiResponse(statusCode, result.message, {
      responseTimeMs: result.responseTimeMs,
      success: result.success,
      appwriteResponse: result.appwriteResponse,
    }),
  );
});

export const getPingHistory = asyncHandler(async (req, res) => {
  const { page, limit } = req.validated.query;
  const result = await pingService.getPingHistory(req.user.id, req.validated.params.id, {
    page,
    limit,
  });
  sendResponse(res, new ApiResponse(200, "Ping history fetched successfully", result));
});
