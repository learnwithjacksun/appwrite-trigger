import mongoose from "mongoose";
import Project from "../models/Project.js";
import PingLog from "../models/PingLog.js";

export const getDashboardStats = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [projectStats, pingStats] = await Promise.all([
    Project.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] } },
          autoPingEnabled: { $sum: { $cond: ["$autoPingEnabled", 1, 0] } },
          lastPinged: { $max: "$lastPinged" },
        },
      },
    ]),
    PingLog.aggregate([
      { $match: { userId: userObjectId, createdAt: { $gte: since24h } } },
      {
        $group: {
          _id: null,
          totalPings: { $sum: 1 },
          successfulPings: { $sum: { $cond: ["$success", 1, 0] } },
          avgResponseTime: { $avg: "$responseTimeMs" },
        },
      },
    ]),
  ]);

  const projects = projectStats[0] || {
    total: 0,
    active: 0,
    failed: 0,
    autoPingEnabled: 0,
    lastPinged: null,
  };

  const pings = pingStats[0] || {
    totalPings: 0,
    successfulPings: 0,
    avgResponseTime: 0,
  };

  const successRate =
    pings.totalPings > 0
      ? Math.round((pings.successfulPings / pings.totalPings) * 100)
      : 0;

  return {
    totalProjects: projects.total,
    activeProjects: projects.active,
    failedProjects: projects.failed,
    autoPingEnabledCount: projects.autoPingEnabled,
    lastPinged: projects.lastPinged,
    pingsLast24h: pings.totalPings,
    successfulPingsLast24h: pings.successfulPings,
    successRateLast24h: successRate,
    avgResponseTimeMs: Math.round(pings.avgResponseTime || 0),
  };
};
