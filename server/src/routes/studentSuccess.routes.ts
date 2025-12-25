import { Router } from "express";
import {
  getAllStudentSuccess,
  getStudentSuccess,
  createStudentSuccess,
  updateStudentSuccess,
  deleteStudentSuccess,
} from "../controllers/studentSuccess.controller";
import { uploadStudentSuccessImage } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", getStudentSuccess);
router.get("/all", getAllStudentSuccess);
router.post("/", uploadStudentSuccessImage.single("image"), createStudentSuccess);
router.put("/:id", uploadStudentSuccessImage.single("image"), updateStudentSuccess);
router.delete("/:id", deleteStudentSuccess);

export default router;
