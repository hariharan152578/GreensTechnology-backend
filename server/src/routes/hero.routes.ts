import { Router } from "express";
import {
  getHeroData,
  createHero,
  updateHero,
  deleteHero,
} from "../controllers/hero.controller";

const router = Router();

/**
 * PUBLIC (Frontend)
 * GET /api/hero?domainId=0&courseId=0
 */
router.get("/", getHeroData);

/**
 * ADMIN (CRUD)
 */
router.post("/", createHero);
router.put("/:id", updateHero);
router.delete("/:id", deleteHero);

export default router;
