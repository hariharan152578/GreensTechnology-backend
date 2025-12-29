import { Router } from "express";
import {
  getStudentSuccess,
  createStudentSuccess,
  deleteStudentSuccess,
} from "../controllers/studentSuccess.controller";
import { uploadStudentSuccessImage } from "../middlewares/upload.middleware";

const router = Router();

/* ---------- PUBLIC ---------- */
router.get("/", getStudentSuccess);

/* ---------- ADMIN ---------- */
router.post(
  "/",
  uploadStudentSuccessImage.single("image"), // 🔥 field name = image
  createStudentSuccess
);

router.delete("/:id", deleteStudentSuccess);

export default router;
