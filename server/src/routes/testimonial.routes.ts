import { Router } from "express";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonial.controller";
import { uploadTestimonialImage } from "../middlewares/upload.middleware";

const router = Router();

/* FRONTEND */
router.get("/", getTestimonials);

/* ADMIN */
router.post(
  "/",
  uploadTestimonialImage.single("image"),
  createTestimonial
);

router.put(
  "/:id",
  uploadTestimonialImage.single("image"),
  updateTestimonial
);

router.delete("/:id", deleteTestimonial);

export default router;
