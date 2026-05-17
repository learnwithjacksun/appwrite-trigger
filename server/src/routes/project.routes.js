import { Router } from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";
import { pingProject, getPingHistory } from "../controllers/ping.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createProjectSchema,
  updateProjectSchema,
  projectIdParamSchema,
  listProjectsSchema,
  pingHistorySchema,
} from "../validators/project.validator.js";

const router = Router();

router.use(protect);

router.post("/", validate(createProjectSchema), createProject);
router.get("/", validate(listProjectsSchema), getProjects);
router.get("/:id", validate(projectIdParamSchema), getProject);
router.put("/:id", validate(updateProjectSchema), updateProject);
router.delete("/:id", validate(projectIdParamSchema), deleteProject);
router.post("/:id/ping", validate(projectIdParamSchema), pingProject);
router.get("/:id/ping-history", validate(pingHistorySchema), getPingHistory);

export default router;
