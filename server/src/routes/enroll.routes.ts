import { Router } from "express";
import { getEnrollCards } from "../controllers/enroll.controller";

const router = Router();
router.get("/", getEnrollCards);
export default router;
