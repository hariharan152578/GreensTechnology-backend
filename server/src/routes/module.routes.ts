// src/routes/module.routes.ts
import { Router } from "express";
import {
  getModules,
  createModule,
  updateModule,
  deleteModule,
  addModuleTopic,
} from "../controllers/module.controller";

const router = Router();

/* FRONTEND */
router.get("/", getModules);

/* ADMIN */
router.post("/", createModule);
router.put("/:id", updateModule);
router.delete("/:id", deleteModule);
router.post("/topic", addModuleTopic);

export default router;
