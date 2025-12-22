import { Router } from "express";
import {
  getDomains,
  getDomainById,
  createDomain,
  updateDomain,
  deleteDomain,
} from "../controllers/domain.controller";

const router = Router();

/* ---------- PUBLIC ---------- */
router.get("/", getDomains);
router.get("/:id", getDomainById);

/* ---------- ADMIN ---------- */
router.post("/", createDomain);
router.put("/:id", updateDomain);
router.delete("/:id", deleteDomain);

export default router;
