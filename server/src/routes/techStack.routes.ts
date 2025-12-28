// src/routes/techStack.routes.ts
import { Router } from "express";
import {
  getTechStack,
  createTechStack,
  updateTechStack,
  deleteTechStack,
} from "../controllers/techStack.controller";
import { uploadTechStackImage } from "../middlewares/upload.middleware";

const router = Router();

/* FRONTEND */
router.get("/", getTechStack);

/* ADMIN */
router.post(
  "/",
  uploadTechStackImage.single("image"), // 🔥 MUST BE "image"
  createTechStack
);

router.put(
  "/:id",
  uploadTechStackImage.single("image"),
  updateTechStack
);

router.delete("/:id", deleteTechStack);

export default router;
