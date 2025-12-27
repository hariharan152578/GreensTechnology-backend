import { Router } from "express";
import {
  getVideoTestimonials,
  createVideoTestimonial,
  deleteVideoTestimonial,
} from "../controllers/videoTestimonial.controller";
import { uploadVideoImage } from "../middlewares/upload.middleware";

const router = Router();

/* FRONTEND */
router.get("/", getVideoTestimonials);

/* ADMIN */
router.post("/", uploadVideoImage.single("image"), createVideoTestimonial);
router.delete("/:id", deleteVideoTestimonial);

export default router;
