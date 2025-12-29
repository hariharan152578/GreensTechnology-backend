// import { Router } from "express";
// import {
//   getFaqByStep,
//   createFaq,
//   updateFaq,
//   deleteFaq,
// } from "../controllers/faqChat.controller";

// const router = Router();

// /* ---------- FRONTEND ---------- */
// /**
//  * GET /api/faq-chat?step=0
//  */
// router.get("/", getFaqByStep);

// /* ---------- ADMIN ---------- */
// router.post("/", createFaq);
// router.put("/:id", updateFaq);
// router.delete("/:id", deleteFaq);

// export default router;


import { Router } from "express";
import {
  getFAQs,
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  incrementLikes,
  updateFAQOrder,
  getCategories,
} from "../controllers/faqChat.controller";

const router = Router();

// Public endpoints (frontend)
router.get("/", getFAQs); // Get FAQs with domain/course filtering
router.get("/categories", getCategories); // Get available categories
router.get("/:id", getFAQById); // Get specific FAQ by ID
router.put("/:id/like", incrementLikes); // Increment like count

// Admin endpoints
router.get("/admin/all", getAllFAQs); // Get all FAQs (admin)
router.post("/", createFAQ); // Create new FAQ
router.put("/:id", updateFAQ); // Update FAQ
router.delete("/:id", deleteFAQ); // Soft delete FAQ
router.put("/update-order", updateFAQOrder); // Update FAQ order

export default router;