import cron from "node-cron";
import axios from "axios";
import { env } from "../config/env.js";

let cronStarted = false;
let isRunning = false;

export const startSelfPingCron = () => {
  if (cronStarted) return;
  cronStarted = true;

  if (!env.selfPingUrl) {
    console.log("[self-ping] Disabled — set SELF_PING_URL to enable");
    return;
  }

  if (!cron.validate(env.selfPingSchedule)) {
    console.error(`[self-ping] Invalid schedule: ${env.selfPingSchedule}`);
    return;
  }

  const pingUrl = `${env.selfPingUrl.replace(/\/$/, "")}/api/v1/ping`;

  cron.schedule(env.selfPingSchedule, async () => {
    if (isRunning) {
      console.warn("[self-ping] Skipping — previous run still in progress");
      return;
    }

    isRunning = true;

    try {
      const startedAt = Date.now();
      const response = await axios.get(pingUrl, {
        timeout: 10_000,
        validateStatus: () => true,
      });
      const elapsedMs = Date.now() - startedAt;

      if (response.status >= 200 && response.status < 300) {
        console.log(`[self-ping] OK ${response.status} (${elapsedMs}ms) → ${pingUrl}`);
      } else {
        console.warn(
          `[self-ping] Unexpected status ${response.status} (${elapsedMs}ms) → ${pingUrl}`,
        );
      }
    } catch (error) {
      console.error(`[self-ping] Failed → ${pingUrl}: ${error.message}`);
    } finally {
      isRunning = false;
    }
  });

  console.log(`[self-ping] Scheduled: ${env.selfPingSchedule} → ${pingUrl}`);
};
