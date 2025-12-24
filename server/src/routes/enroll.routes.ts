import { Router } from "express";
import { getEnrollSection } from "../controllers/enroll.controller";

const router = Router();
router.get("/", getEnrollSection);
export default router;
