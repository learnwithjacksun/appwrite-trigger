import { Router } from "express";
import authRoutes from "./auth.routes.js";
import projectRoutes from "./project.routes.js";
import statsRoutes from "./stats.routes.js";
import healthRoutes from "./health.routes.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.use("/auth", authLimiter, authRoutes);
router.use("/projects", projectRoutes);
router.use("/stats", statsRoutes);
router.use("/health", healthRoutes);

export default router;
