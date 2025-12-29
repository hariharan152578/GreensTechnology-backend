// routes/studyMaterial.routes.ts
import { Router } from "express";
import {
  getStudyMaterials,
  createStudyMaterial,
  updateStudyMaterial,
  deleteStudyMaterial,
  getAllStudyMaterialsForAdmin,
  getStudyMaterialById
} from "../controllers/studyMaterial.controller";
import { uploadStudyMaterial } from "../middlewares/upload.middleware";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

/* ---------- PUBLIC ROUTES ---------- */
router.get("/", getStudyMaterials); // GET /api/study-materials - public active materials

/* ---------- ADMIN ROUTES ---------- */
router.get("/admin/all", authenticateAdmin, getAllStudyMaterialsForAdmin); // GET /api/study-materials/admin/all
router.get("/:id", authenticateAdmin, getStudyMaterialById); // GET /api/study-materials/:id
router.post("/", authenticateAdmin, uploadStudyMaterial.single("file"), createStudyMaterial);
router.put("/:id", authenticateAdmin, uploadStudyMaterial.single("file"), updateStudyMaterial); // Add this if you want update
router.delete("/:id", authenticateAdmin, deleteStudyMaterial);

export default router;