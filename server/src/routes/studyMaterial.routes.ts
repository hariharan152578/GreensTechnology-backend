import { Router } from "express";
import {
  getAllStudyMaterials,
  getStudyMaterials,
  createStudyMaterial,
  deleteStudyMaterial,
} from "../controllers/studyMaterial.controller";
import { Studyupload } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", getStudyMaterials);
router.get("/all", getAllStudyMaterials);
router.post("/", Studyupload.single("file"), createStudyMaterial);
router.delete("/:id", deleteStudyMaterial);

export default router;
