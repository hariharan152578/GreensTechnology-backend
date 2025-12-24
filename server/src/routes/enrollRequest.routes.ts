import { Router } from "express";
import { upload } from "../middlewares/upload.middleware";
import { createEnrollRequest } from "../controllers/enrollRequest.controller";

const router = Router();

router.post(
  "/request",
  upload.single("file"),
  createEnrollRequest
);
export default router;
