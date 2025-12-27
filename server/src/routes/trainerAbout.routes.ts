import { Router } from "express";
import {
  getTrainerAbout,
  createTrainerAbout,
  updateTrainerAbout,
  deleteTrainerAbout,
} from "../controllers/trainerAbout.controller";
import { uploadTrainerAboutImages } from "../middlewares/upload.middleware";

const router = Router();

/* ---------- PUBLIC ---------- */
router.get("/", getTrainerAbout);

/* ---------- ADMIN ---------- */
router.post(
  "/",
  uploadTrainerAboutImages.fields([
    { name: "mainImages", maxCount: 5 },
    { name: "smallImages", maxCount: 5 },
  ]),
  createTrainerAbout
);

router.put(
  "/:id",
  uploadTrainerAboutImages.fields([
    { name: "mainImages", maxCount: 5 },
    { name: "smallImages", maxCount: 5 },
  ]),
  updateTrainerAbout
);

router.delete("/:id", deleteTrainerAbout);

export default router;
