import dotenv from "dotenv";
import process from "process";

dotenv.config();

const required = ["MONGO_URI", "JWT_SECRET", "ENCRYPTION_KEY"];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Error: ${key} is not set in environment variables`);
    process.exit(1);
  }
}

const encryptionKey = process.env.ENCRYPTION_KEY;
const placeholderKeys = [
  "your_64_character_hex_encryption_key_here",
  "replace-with-a-long-random-secret-min-32-chars",
];

if (
  !encryptionKey ||
  encryptionKey.length !== 64 ||
  !/^[0-9a-fA-F]{64}$/.test(encryptionKey) ||
  placeholderKeys.includes(encryptionKey)
) {
  console.error(
    "Error: ENCRYPTION_KEY must be a 64-character hex string (32 bytes).\n" +
      "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
  );
  process.exit(1);
}

if (placeholderKeys.includes(process.env.JWT_SECRET)) {
  console.error(
    "Error: Replace JWT_SECRET with a strong random string in your .env file.",
  );
  process.exit(1);
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientOrigins: (process.env.CLIENT_ORIGINS || "http://localhost:5173,http://localhost:3000")
    .split(",")
    .map((o) => o.trim()),
  cronSchedule: process.env.CRON_SCHEDULE || "0 0 * * *",
  autoRetryFailed: process.env.AUTO_RETRY_FAILED === "true",
  selfPingUrl: (process.env.SELF_PING_URL || "").replace(/\/$/, ""),
  selfPingSchedule: process.env.SELF_PING_SCHEDULE || "*/10 * * * *",
  nodeEnv: process.env.NODE_ENV || "development",
};
