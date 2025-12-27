import { Router } from "express";
import {
  createEnrollCards,
  getEnrollCards,
  updateEnrollCard,
  deleteEnrollCard,
  hardDeleteEnrollCard,
} from "../controllers/enrollCard.controller";

import { upload } from "../middlewares/upload.middleware";

const router = Router();

/* CREATE (MULTIPLE IMAGES) */
router.post("/cards", upload.array("image", 5), createEnrollCards);

/* READ */
router.get("/cards", getEnrollCards);

/* UPDATE (OPTIONAL IMAGE) */
router.put("/cards/:id", upload.single("image"), updateEnrollCard);

/* SOFT DELETE */
router.delete("/cards/:id", deleteEnrollCard);

/* HARD DELETE (OPTIONAL) */
router.delete("/cards/:id/hard", hardDeleteEnrollCard);

export default router;
