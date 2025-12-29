import { Router } from "express";
import {
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
router.post(
  "/",
  uploadAboutImages.fields([
    { name: "mainImages", maxCount: 5 },
    { name: "smallImages", maxCount: 5 },
  ]),
  createAbout
);

router.put(
  "/:id",
  uploadAboutImages.fields([
    { name: "mainImages", maxCount: 5 },
    { name: "smallImages", maxCount: 5 },
  ]),
  updateAbout
);

router.delete("/:id", deleteAbout);

export default router;
