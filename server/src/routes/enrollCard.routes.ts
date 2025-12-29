import { Router } from "express";
import {
  getEnrollCards,
  getEnrollCardsAdmin,
  createEnrollCard,
  updateEnrollCard,
  deleteEnrollCard,
  updateEnrollCardOrder,
  hardDeleteEnrollCard, // optional
} from "../controllers/enrollCard.controller";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

// Public endpoint (for frontend)
router.get("/", getEnrollCards);

// Admin endpoints
router.get("/admin", getEnrollCardsAdmin);
router.post("/", upload.single("image"), createEnrollCard);
router.put("/:id", upload.single("image"), updateEnrollCard);
router.put("/update-order", updateEnrollCardOrder);
router.delete("/:id", deleteEnrollCard);

// Optional: Hard delete endpoint
router.delete("/hard/:id", hardDeleteEnrollCard);

export default router;