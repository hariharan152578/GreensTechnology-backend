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
import { uploadDomainImages } from "../middlewares/upload.middleware";
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
  uploadDomainImages.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "smallImage", maxCount: 1 },
  ]),
  createDomain
);

router.put(
  "/:id",
  authenticateAdmin,
  uploadDomainImages.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "smallImage", maxCount: 1 },
  ]),
  updateDomain
);

router.delete("/:id", authenticateAdmin, deleteDomain);

export default router;