import { Router } from "express";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller";

const router = Router();

/* ---------- PUBLIC ---------- */
router.get("/", getCourses);

/* ---------- ADMIN ---------- */
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
