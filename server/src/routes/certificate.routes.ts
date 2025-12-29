import { Router } from "express";
import {
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "../controllers/certificate.controller";

import { uploadCertificateImage } from "../middlewares/upload.middleware";

const router = Router();

/* PUBLIC */
router.get("/", getCertificate);

/* ADMIN */
router.post("/", uploadCertificateImage.single("certificateImage"), createCertificate);
router.put("/:id", uploadCertificateImage.single("certificateImage"), updateCertificate);
router.delete("/:id", deleteCertificate);

export default router;
