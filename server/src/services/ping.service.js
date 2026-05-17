import axios from "axios";
import Project from "../models/Project.js";
import PingLog from "../models/PingLog.js";
import { decrypt } from "../utils/encrypt.js";
import { AppError } from "../utils/AppError.js";
import { normalizeAppwriteEndpoint } from "../utils/normalizeEndpoint.js";

const buildHealthUrl = (endpoint) => {
  const base = normalizeAppwriteEndpoint(endpoint);
  return `${base}/v1/health`;
};

const pingFailureMessage = (status, data) => {
  if (status === 404) {
    return (
      "Ping failed (404): Appwrite endpoint not found. Use your instance host only " +
      "(e.g. https://cloud.appwrite.io or https://fra.cloud.appwrite.io), not the /v1 API path."
    );
  }
  if (status === 401 || status === 403) {
    return "Ping failed: Invalid project ID or API key.";
  }
  const detail = typeof data === "string" ? data : data?.message;
  return detail ? `Ping failed (HTTP ${status}): ${detail}` : `Ping failed (HTTP ${status})`;
};

const savePingLog = async (payload) => {
  try {
    await PingLog.create(payload);
  } catch (error) {
    console.error("[ping] Failed to save ping log:", error.message);
  }
};

export const pingProjectById = async (projectId, userId, source = "manual") => {
  const query = { _id: projectId };
  if (userId) query.userId = userId;

  const project = await Project.findOne(query).select("+apiKey");
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const apiKey = decrypt(project.apiKey);
  const url = buildHealthUrl(project.appwriteEndpoint);
  const start = Date.now();

  try {
    const response = await axios.get(url, {
      headers: {
        "X-Appwrite-Project": project.projectId,
        "X-Appwrite-Key": apiKey,
        "X-Appwrite-Response-Format": "1.6.0",
        "Content-Type": "application/json",
      },
      timeout: 15000,
      validateStatus: () => true,
    });

    const responseTimeMs = Date.now() - start;
    const success = response.status >= 200 && response.status < 300;
    const message = success
      ? "Ping successful"
      : pingFailureMessage(response.status, response.data);

    project.lastPinged = new Date();
    project.status = success ? "active" : "failed";
    await project.save();

    await savePingLog({
      projectId: project._id,
      userId: project.userId,
      success,
      responseTimeMs,
      statusCode: response.status,
      message,
      appwriteResponse: response.data,
      source,
    });

    return {
      success,
      message,
      responseTimeMs,
      appwriteResponse: response.data,
      statusCode: response.status,
      requestUrl: url,
    };
  } catch (error) {
    const responseTimeMs = Date.now() - start;

    project.lastPinged = new Date();
    project.status = "failed";
    await project.save();

    await savePingLog({
      projectId: project._id,
      userId: project.userId,
      success: false,
      responseTimeMs,
      message: error.message,
      appwriteResponse: null,
      source,
    });

    return {
      success: false,
      message: error.message,
      responseTimeMs,
      appwriteResponse: null,
    };
  }
};

export const getPingHistory = async (userId, projectId, { page, limit }) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const skip = (page - 1) * limit;
  const filter = { projectId, userId };

  const [items, total] = await Promise.all([
    PingLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    PingLog.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  };
};
