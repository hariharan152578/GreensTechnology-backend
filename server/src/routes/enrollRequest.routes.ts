import { Router } from "express";
import {
  createEnrollRequest,
  getEnrollRequests,
} from "../controllers/enrollRequest.controller";
import { uploadEnrollImage } from "../middlewares/upload.middleware";

const router = Router();

/* USER */
router.post(
  "/request",
  uploadEnrollImage.single("proofImage"),
  createEnrollRequest
);

/* ADMIN */
router.get("/request", getEnrollRequests);

export default router;
