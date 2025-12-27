import { Router } from "express";
import {
  getHeroData,
  createHero,
  updateHero,
  deleteHero,
} from "../controllers/hero.controller";
import { uploadHeroImages } from "../middlewares/upload.middleware";

const router = Router();

/* ---------- PUBLIC ---------- */
router.get("/", getHeroData);

/* ---------- ADMIN ---------- */
router.post("/", uploadHeroImages.array("images", 5), createHero);

router.put("/:id", uploadHeroImages.array("images", 5), updateHero);

router.delete("/:id", deleteHero);

export default router;
