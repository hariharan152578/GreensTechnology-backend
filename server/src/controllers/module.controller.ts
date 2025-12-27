// src/controllers/module.controller.ts
import { Request, Response } from "express";
import { Module } from "../models/Module.model";
import { ModuleTopic } from "../models/ModuleTopic.model";

/* ---------- FRONTEND ---------- */
export const getModules = async (req: Request, res: Response) => {
  const domainId = Number(req.query.domainId || 0);
  const courseId = Number(req.query.courseId || 0);

  let modules = await Module.findAll({
    where: { domainId, courseId, isActive: true },
    include: [{ model: ModuleTopic, where: { isActive: true }, required: false }],
    order: [["order", "ASC"]],
  });

  // fallback → domain level
  if (!modules.length && courseId > 0) {
    modules = await Module.findAll({
      where: { domainId, courseId: 0, isActive: true },
      include: [{ model: ModuleTopic, where: { isActive: true }, required: false }],
      order: [["order", "ASC"]],
    });
  }

  res.json(modules);
};

/* ---------- ADMIN ---------- */
export const createModule = async (req: Request, res: Response) => {
  const module = await Module.create(req.body);
  res.status(201).json(module);
};

export const updateModule = async (req: Request, res: Response) => {
  const module = await Module.findByPk(req.params.id);
  if (!module) return res.status(404).json({ message: "Module not found" });

  await module.update(req.body);
  res.json(module);
};

export const deleteModule = async (req: Request, res: Response) => {
  const module = await Module.findByPk(req.params.id);
  if (!module) return res.status(404).json({ message: "Module not found" });

  await module.destroy();
  res.json({ message: "Module deleted" });
};

/* ---------- TOPICS ---------- */
export const addModuleTopic = async (req: Request, res: Response) => {
  const topic = await ModuleTopic.create(req.body);
  res.status(201).json(topic);
};
