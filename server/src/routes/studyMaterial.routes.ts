import { Router } from "express";
import {
  getStudyMaterials,
  createStudyMaterial,
  deleteStudyMaterial,
} from "../controllers/studyMaterial.controller";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", getStudyMaterials);
router.post("/", upload.single("file"), createStudyMaterial);
router.delete("/:id", deleteStudyMaterial);

export default router;
