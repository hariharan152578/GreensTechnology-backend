import { Router } from "express";
import {
  getCareerImpact,
  createCareerImpact,
  updateCareerImpact,
  deleteCareerImpact,
} from "../controllers/careerImpact.controller";

const router = Router();

/**
 * PUBLIC (Frontend)
 * GET /api/career-impact?domainId=0&courseId=0
 */
router.get("/", getCareerImpact);

/**
 * ADMIN (CRUD)
 */
router.post("/", createCareerImpact);
router.put("/:id", updateCareerImpact);
router.delete("/:id", deleteCareerImpact);

export default router;
