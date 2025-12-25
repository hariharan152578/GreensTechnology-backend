import { Router } from "express";
import {
  getAllHeroes,
  getHeroData,
  createHero,
  updateHero,
  deleteHero,
} from "../controllers/hero.controller";
import { uploadHeroImages } from "../middlewares/upload.middleware";

const router = Router();

/**
 * PUBLIC (Frontend)
 * GET /api/hero?domainId=0&courseId=0
 */
router.get("/", getHeroData);

/**
 * ADMIN (CRUD)
 */
router.get("/all", getAllHeroes);
router.post(
  "/",
  uploadHeroImages.fields([
    { name: "images", maxCount: 10 }
  ]),
  createHero
);

router.put(
  "/:id",
  uploadHeroImages.fields([
    { name: "images", maxCount: 10 }
  ]),
  updateHero
);
router.delete("/:id", deleteHero);

export default router;
