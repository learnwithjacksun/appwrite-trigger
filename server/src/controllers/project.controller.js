import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse, sendResponse } from "../utils/ApiResponse.js";
import * as projectService from "../services/project.service.js";

export const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.user.id, req.validated.body);
  sendResponse(res, new ApiResponse(201, "Project created successfully", project));
});

export const getProjects = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.validated.query;
  const result = await projectService.getProjects(req.user.id, {
    page,
    limit,
    search,
  });
  sendResponse(res, new ApiResponse(200, "Projects fetched successfully", result));
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(req.user.id, req.validated.params.id);
  sendResponse(res, new ApiResponse(200, "Project fetched successfully", project));
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(
    req.user.id,
    req.validated.params.id,
    req.validated.body,
  );
  sendResponse(res, new ApiResponse(200, "Project updated successfully", project));
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await projectService.deleteProject(req.user.id, req.validated.params.id);
  sendResponse(res, new ApiResponse(200, "Project deleted successfully", project));
});
