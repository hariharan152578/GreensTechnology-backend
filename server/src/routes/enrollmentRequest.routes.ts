import { Router } from "express";
import {
  createEnrollmentRequest,
  getAllEnrollmentRequests,
  updateEnrollmentRequest,
  deleteEnrollmentRequest,
  getEnrollmentStats
} from "../controllers/enrollmentRequest.controller";
import { uploadEnrollmentProof } from "../middlewares/upload.middleware";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

/* ---------- FRONTEND ---------- */
router.post(
  "/request",
  uploadEnrollmentProof.single("file"),
  createEnrollmentRequest
);

/* ---------- ADMIN ---------- */
router.get("/", authenticateAdmin, getAllEnrollmentRequests);
router.get("/stats", authenticateAdmin, getEnrollmentStats);
router.put("/:id", authenticateAdmin, updateEnrollmentRequest);
router.delete("/:id", authenticateAdmin, deleteEnrollmentRequest);

export default router;