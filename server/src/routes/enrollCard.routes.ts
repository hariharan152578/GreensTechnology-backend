import { Router } from "express";
import { upload } from "../middlewares/upload.middleware";
import { createEnrollCards } from "../controllers/enrollCard.controller";

const router = Router();
router.post("/cards", upload.array("image", 5), createEnrollCards);
export default router;
