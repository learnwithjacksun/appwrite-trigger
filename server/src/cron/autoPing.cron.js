import cron from "node-cron";
import Project from "../models/Project.js";
import { pingProjectById } from "../services/ping.service.js";
import { env } from "../config/env.js";

let cronStarted = false;
let isRunning = false;

export const startAutoPingCron = () => {
  if (cronStarted) return;
  cronStarted = true;

  if (!cron.validate(env.cronSchedule)) {
    console.error(`[cron] Invalid schedule: ${env.cronSchedule}`);
    return;
  }

  cron.schedule(env.cronSchedule, async () => {
    if (isRunning) {
      console.warn("[cron] Skipping — previous run still in progress");
      return;
    }

    isRunning = true;
    console.log("[cron] Starting auto-ping job...");

    try {
      const projects = await Project.find({ autoPingEnabled: true }).select(
        "_id userId projectName",
      );

      for (const project of projects) {
        try {
          const result = await pingProjectById(project._id, null, "cron");
          console.log(
            `[cron] ${project.projectName}: ${result.success ? "OK" : "FAIL"} (${result.responseTimeMs}ms)`,
          );
        } catch (error) {
          console.error(`[cron] ${project.projectName}: ERROR — ${error.message}`);
        }
      }

      if (env.autoRetryFailed) {
        const failedProjects = await Project.find({
          status: "failed",
          autoPingEnabled: true,
        }).select("_id userId projectName");

        for (const project of failedProjects) {
          try {
            const result = await pingProjectById(project._id, null, "retry");
            console.log(
              `[cron-retry] ${project.projectName}: ${result.success ? "OK" : "FAIL"}`,
            );
          } catch (error) {
            console.error(`[cron-retry] ${project.projectName}: ERROR — ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.error("[cron] Job failed:", error.message);
    } finally {
      isRunning = false;
      console.log("[cron] Auto-ping job finished");
    }
  });

  console.log(`[cron] Scheduled auto-ping: ${env.cronSchedule}`);
};
