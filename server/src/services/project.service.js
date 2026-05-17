import Project from "../models/Project.js";
import { AppError } from "../utils/AppError.js";
import { encrypt } from "../utils/encrypt.js";
import { normalizeAppwriteEndpoint } from "../utils/normalizeEndpoint.js";
import { toPublicProject, toPublicProjects } from "../utils/projectSerializer.js";

export const createProject = async (userId, data) => {
  const project = await Project.create({
    userId,
    projectName: data.projectName,
    appwriteEndpoint: normalizeAppwriteEndpoint(data.appwriteEndpoint),
    projectId: data.projectId,
    apiKey: encrypt(data.apiKey),
    autoPingEnabled: data.autoPingEnabled ?? true,
  });

  return toPublicProject(project);
};

export const getProjects = async (userId, { page, limit, search }) => {
  const filter = { userId };

  if (search) {
    filter.projectName = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Project.countDocuments(filter),
  ]);

  return {
    items: toPublicProjects(items),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getProjectById = async (userId, projectId) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    throw new AppError("Project not found", 404);
  }
  return toPublicProject(project);
};

export const updateProject = async (userId, projectId, data) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (data.projectName) project.projectName = data.projectName;
  if (data.appwriteEndpoint) {
    project.appwriteEndpoint = normalizeAppwriteEndpoint(data.appwriteEndpoint);
  }
  if (data.projectId) project.projectId = data.projectId;
  if (data.apiKey) project.apiKey = encrypt(data.apiKey);
  if (typeof data.autoPingEnabled === "boolean") {
    project.autoPingEnabled = data.autoPingEnabled;
  }

  await project.save();
  return toPublicProject(project);
};

export const deleteProject = async (userId, projectId) => {
  const project = await Project.findOneAndDelete({ _id: projectId, userId });
  if (!project) {
    throw new AppError("Project not found", 404);
  }
  return toPublicProject(project);
};
