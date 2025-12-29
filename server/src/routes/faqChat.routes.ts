import { Router } from "express";
import {
  getFaqByStep,
  createFaq,
  updateFaq,
  deleteFaq,
} from "../controllers/faqChat.controller";

const router = Router();

/* ---------- FRONTEND ---------- */
/**
 * GET /api/faq-chat?step=0
 */
router.get("/", getFaqByStep);

/* ---------- ADMIN ---------- */
router.post("/", createFaq);
router.put("/:id", updateFaq);
router.delete("/:id", deleteFaq);

export default router;
