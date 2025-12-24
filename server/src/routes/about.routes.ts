import { Router } from "express";
import {
  getAboutData,
  createAbout,
  updateAbout,
  deleteAbout,
} from "../controllers/about.controller";

const router = Router();

/* ---------- PUBLIC ---------- */
router.get("/", getAboutData);

/* ---------- ADMIN ---------- */
router.post("/", createAbout);
router.put("/:id", updateAbout);
router.delete("/:id", deleteAbout);

export default router;
