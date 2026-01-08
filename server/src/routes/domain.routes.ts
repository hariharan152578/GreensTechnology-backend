// routes/domain.routes.ts
import { Router } from "express";
import {
  getDomains,
  getDomainById,
  createDomain,
  updateDomain,
  deleteDomain,
  getAllDomainsForAdmin
} from "../controllers/domain.controller";
import { uploadDomainVideo } from "../middlewares/upload.middleware";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

/* ---------- PUBLIC ROUTES ---------- */
router.get("/", getDomains); // GET /api/domain - public active domains
router.get("/:id", getDomainById); // GET /api/domain/:id

/* ---------- ADMIN ROUTES ---------- */
router.get("/admin/all", authenticateAdmin, getAllDomainsForAdmin); // GET /api/domain/admin/all
router.post(
  "/",
  authenticateAdmin,
  uploadDomainVideo.single("video"),
  createDomain
);

router.put(
  "/:id",
  authenticateAdmin,
  uploadDomainVideo.single("video"),
  updateDomain
);

router.delete("/:id", authenticateAdmin, deleteDomain);

export default router;