import { Router } from "express";
import {
  getAllTestimonials,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonial.controller";
import { uploadTestimonialImage } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", getTestimonials);
router.get("/add", getAllTestimonials);
router.post("/", uploadTestimonialImage.single("image"), createTestimonial);
router.put("/:id", uploadTestimonialImage.single("image"), updateTestimonial);
router.delete("/:id", deleteTestimonial);

export default router;
