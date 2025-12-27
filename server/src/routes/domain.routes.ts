import { Router } from "express";
import {
  getDomains,
  getDomainById,
  createDomain,
  updateDomain,
  deleteDomain,
} from "../controllers/domain.controller";
import { uploadDomainImages } from "../middlewares/upload.middleware";

const router = Router();

/* ---------- PUBLIC ---------- */
router.get("/", getDomains);
router.get("/:id", getDomainById);

/* ---------- ADMIN ---------- */
router.post(
  "/",
  uploadDomainImages.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "smallImage", maxCount: 1 },
  ]),
  createDomain
);

router.put(
  "/:id",
  uploadDomainImages.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "smallImage", maxCount: 1 },
  ]),
  updateDomain
);

router.delete("/:id", deleteDomain);

export default router;
