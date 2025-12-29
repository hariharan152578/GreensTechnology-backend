import { Router } from "express";
import {
  createEnrollmentRequest,
  getAllEnrollmentRequests,
  updateEnrollmentRequest,
  deleteEnrollmentRequest,
} from "../controllers/enrollmentRequest.controller";
import { uploadEnrollmentProof } from "../middlewares/upload.middleware";

const router = Router();

router.post(
  "/request",
  uploadEnrollmentProof.single("file"),
  createEnrollmentRequest
);

router.get("/", getAllEnrollmentRequests);
router.put("/:id", updateEnrollmentRequest);
router.delete("/:id", deleteEnrollmentRequest);

export default router;
