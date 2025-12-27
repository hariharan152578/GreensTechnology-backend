import { Request, Response } from "express";
import { TechStack } from "../models/TechStack.model";

/* ================= FRONTEND ================= */
export const getTechStack = async (req: Request, res: Response) => {
  const domainId = Number(req.query.domainId || 0);
  const courseId = Number(req.query.courseId || 0);

  let items = await TechStack.findAll({
    where: { domainId, courseId, isActive: true },
    order: [["order", "ASC"]],
  });

  if (!items.length && courseId > 0) {
    items = await TechStack.findAll({
      where: { domainId, courseId: 0, isActive: true },
      order: [["order", "ASC"]],
    });
  }

  res.json(items);
};

/* ================= ADMIN ================= */
export const createTechStack = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: "Icon required" });

  const tech = await TechStack.create({
    ...req.body,
    iconUrl: `/uploads/tech-stack/${req.file.filename}`,
  });

  res.status(201).json(tech);
};

export const updateTechStack = async (req: Request, res: Response) => {
  const tech = await TechStack.findByPk(req.params.id);
  if (!tech) return res.status(404).json({ message: "Not found" });

  await tech.update(req.body);
  res.json(tech);
};

export const deleteTechStack = async (req: Request, res: Response) => {
  const tech = await TechStack.findByPk(req.params.id);
  if (!tech) return res.status(404).json({ message: "Not found" });

  await tech.destroy();
  res.json({ message: "Deleted" });
};
