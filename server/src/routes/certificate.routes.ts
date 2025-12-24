import { Router } from "express";
import {
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "../controllers/certificate.controller";

const router = Router();

/* ---------- PUBLIC ---------- */
router.get("/", getCertificate);

/* ---------- ADMIN ---------- */
router.post("/", createCertificate);
router.put("/:id", updateCertificate);
router.delete("/:id", deleteCertificate);

export default router;
