import { Router } from "express";
import {
  getAllAbouts,
  getAboutData,
  createAbout,
  updateAbout,
  deleteAbout,
} from "../controllers/about.controller";
import { uploadAboutImages } from "../middlewares/upload.middleware";

const router = Router();

/* ---------- PUBLIC ---------- */
router.get("/", getAboutData);

/* ---------- ADMIN ---------- */
router.get("/all", getAllAbouts);
router.post("/", uploadAboutImages, createAbout);
router.put("/:id", uploadAboutImages, updateAbout);
router.delete("/:id", deleteAbout);

export default router;
