import { Router } from "express";
import { handleMailActions } from "../controllers/mail.controller";
import { mailUpload } from "../middlewares/upload.middleware";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Client (no auth)
router.post("/process", mailUpload.single("attachment"), handleMailActions);

// Admin (protected)
router.post(
  "/admin",
  authenticateAdmin,
  mailUpload.single("attachment"),
  handleMailActions
);

export default router;
