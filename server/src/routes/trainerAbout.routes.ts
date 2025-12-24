import { Router } from "express";
import {
  getTrainerAbout,
  createTrainerAbout,
  updateTrainerAbout,
  deleteTrainerAbout,
} from "../controllers/trainerAbout.controller";

const router = Router();

/* ---------- PUBLIC ---------- */
router.get("/", getTrainerAbout);

/* ---------- ADMIN ---------- */
router.post("/", createTrainerAbout);
router.put("/:id", updateTrainerAbout);
router.delete("/:id", deleteTrainerAbout);

export default router;
