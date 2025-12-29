import { Router } from "express";
import {
  getEnrollCards,
  createEnrollCard,
  updateEnrollCard,
  deleteEnrollCard,
} from "../controllers/enrollCard.controller";
import { uploadEnrollCardImage } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", getEnrollCards);
router.post("/", uploadEnrollCardImage.single("image"), createEnrollCard);
router.put("/:id", uploadEnrollCardImage.single("image"), updateEnrollCard);
router.delete("/:id", deleteEnrollCard);

export default router;
