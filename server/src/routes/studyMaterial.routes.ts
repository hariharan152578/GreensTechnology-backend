// routes/studyMaterial.routes.ts
import { Router } from "express";

import {
  getStudyMaterials,
  createStudyMaterial,
  updateStudyMaterial,
  deleteStudyMaterial,
  getAllStudyMaterialsForAdmin,
  getStudyMaterialById,
} from "../controllers/studyMaterial.controller";

import { uploadStudyMaterial } from "../middlewares/upload.middleware";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

/* ---------------------------------------------------
   PUBLIC ROUTES
--------------------------------------------------- */
router.get("/", getStudyMaterials);

/* ---------------------------------------------------
   ADMIN ROUTES
--------------------------------------------------- */
router.get("/admin/all", authenticateAdmin, getAllStudyMaterialsForAdmin);

router.get("/:id", authenticateAdmin, getStudyMaterialById);

/* ---------------------------------------------------
   CREATE STUDY MATERIAL (FILE + THUMBNAIL)
--------------------------------------------------- */
router.post(
  "/",
  authenticateAdmin,
  uploadStudyMaterial.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createStudyMaterial
);

/* ---------------------------------------------------
   UPDATE STUDY MATERIAL (FILE + THUMBNAIL)
--------------------------------------------------- */
router.put(
  "/:id",
  authenticateAdmin,
  uploadStudyMaterial.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  updateStudyMaterial
);

/* ---------------------------------------------------
   DELETE STUDY MATERIAL
--------------------------------------------------- */
router.delete("/:id", authenticateAdmin, deleteStudyMaterial);

export default router;
