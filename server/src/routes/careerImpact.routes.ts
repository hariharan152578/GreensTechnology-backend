import { Router } from "express";
import {
  getCareerImpact,
  createCareerImpact,
  updateCareerImpact,
  deleteCareerImpact,
} from "../controllers/careerImpact.controller";

const router = Router();

/* ---------- PUBLIC ---------- */
router.get("/", getCareerImpact);

/* ---------- ADMIN ---------- */
router.post("/", createCareerImpact);
router.put("/:id", updateCareerImpact);
router.delete("/:id", deleteCareerImpact);

export default router;
