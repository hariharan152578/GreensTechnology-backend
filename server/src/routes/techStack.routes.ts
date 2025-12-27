import { Router } from "express";
import {
  getTechStack,
  createTechStack,
  updateTechStack,
  deleteTechStack,
} from "../controllers/techStack.controller";
import { uploadTechIcon } from "../middlewares/upload.middleware";

const router = Router();

/* FRONTEND */
router.get("/", getTechStack);

/* ADMIN */
router.post("/", uploadTechIcon.single("icon"), createTechStack);
router.put("/:id", updateTechStack);
router.delete("/:id", deleteTechStack);

export default router;
