import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/database.js";
import { env } from "./config/env.js";
import apiRoutes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { apiLimiter } from "./middleware/rateLimit.middleware.js";
import { startAutoPingCron } from "./cron/autoPing.cron.js";
import { startSelfPingCron } from "./cron/selfPing.cron.js";
import { getPing } from "./controllers/keepAlive.controller.js";

await connectDB();

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: env.clientOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Appwrite Trigger API is running",
    docs: "/api/v1/health",
  });
});

// Keep-alive ping — mounted outside apiLimiter so self-pings do not burn the budget
app.get("/api/v1/ping", getPing);

app.use("/api/v1", apiLimiter, apiRoutes);

app.use(notFound);
app.use(errorHandler);

startAutoPingCron();
startSelfPingCron();

app.listen(env.port, () => {
  console.log(`Server running at http://localhost:${env.port}`);
});
