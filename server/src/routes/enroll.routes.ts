import { Router } from "express";
import {
  getEnrollSection,
  createEnrollSection,
  updateEnrollSection,
  deleteEnrollSection,
  addEnrollCard,
  deleteEnrollCard,
} from "../controllers/enroll.controller";
import { uploadEnrollImage } from "../middlewares/upload.middleware";

const router = Router();

/* FRONTEND */
router.get("/", getEnrollSection);

/* ADMIN */
router.post("/", createEnrollSection);
router.put("/:id", updateEnrollSection);
router.delete("/:id", deleteEnrollSection);

/* CARD IMAGE */
router.post("/card", uploadEnrollImage.single("image"), addEnrollCard);
router.delete("/card/:id", deleteEnrollCard);

export default router;
