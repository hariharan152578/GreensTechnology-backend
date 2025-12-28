import { Router } from "express";
import {
  getVideoTestimonials,
  createVideoTestimonial,
  updateVideoTestimonial,
  deleteVideoTestimonial,
} from "../controllers/videoTestimonial.controller";
import { uploadVideoThumbnailImage } from "../middlewares/upload.middleware";

const router = Router();

/* FRONTEND */
router.get("/", getVideoTestimonials);

/* ADMIN */
router.post(
  "/",
  uploadVideoThumbnailImage.single("image"), // 🔥 field MUST be "image"
  createVideoTestimonial
);

router.put(
  "/:id",
  uploadVideoThumbnailImage.single("image"),
  updateVideoTestimonial
);

router.delete("/:id", deleteVideoTestimonial);

export default router;
