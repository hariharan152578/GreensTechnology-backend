import { Router } from "express";
import {
  getStudentSuccess,
  createStudentSuccess,
  updateStudentSuccess,
  deleteStudentSuccess,
} from "../controllers/studentSuccess.controller";
import { uploadTestimonialImage } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", getStudentSuccess);
router.post("/", uploadTestimonialImage.single("image"), createStudentSuccess);
router.put("/:id", uploadTestimonialImage.single("image"), updateStudentSuccess);
router.delete("/:id", deleteStudentSuccess);

export default router;
