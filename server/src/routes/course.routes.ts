import { Router } from "express";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller";
import { uploadCourseImage } from "../middlewares/upload.middleware";

const router = Router();

/* ---------- PUBLIC ---------- */
router.get("/", getCourses);

/* ---------- ADMIN ---------- */
router.post("/", uploadCourseImage.single("image"), createCourse);

router.put("/:id", uploadCourseImage.single("image"), updateCourse);

router.delete("/:id", deleteCourse);

export default router;
