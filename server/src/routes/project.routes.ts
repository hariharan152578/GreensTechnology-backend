// src/routes/project.routes.ts
import { Router } from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  addProjectTech,
} from "../controllers/project.controller";
import { uploadProjectImage } from "../middlewares/upload.middleware";

const router = Router();

/* FRONTEND */
router.get("/", getProjects);

/* ADMIN */
router.post("/", uploadProjectImage.single("image"), createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

/* TECH */
router.post("/tech", addProjectTech);

export default router;
