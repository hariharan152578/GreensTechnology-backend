// src/controllers/techStack.controller.ts
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { TechStack } from "../models/TechStack.model";

/* =====================================================
   🔵 FRONTEND – GET
===================================================== */
export const getTechStack = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let items = await TechStack.findAll({
      where: { domainId, courseId, isActive: true },
      order: [["order", "ASC"]],
    });

    // fallback → domain level
    if (!items.length && courseId > 0) {
      items = await TechStack.findAll({
        where: { domainId, courseId: 0, isActive: true },
        order: [["order", "ASC"]],
      });
    }

    res.json(items);
  } catch {
    res.status(500).json({ message: "Failed to fetch tech stack" });
  }
};

/* =====================================================
   🟢 ADMIN – CREATE
===================================================== */
export const createTechStack = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Tech stack image required" });
    }

    const tech = await TechStack.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      name: req.body.name,
      order: Number(req.body.order || 0),
      iconUrl: `/uploads/tech-stack/${req.file.filename}`,
      isActive: true,
    });

    res.status(201).json(tech);
  } catch (error) {
    console.error("CREATE TECH STACK ERROR:", error);
    res.status(500).json({ message: "Failed to create tech stack" });
  }
};

/* =====================================================
   🟡 ADMIN – UPDATE (IMAGE OPTIONAL)
===================================================== */
export const updateTechStack = async (req: Request, res: Response) => {
  try {
    const tech = await TechStack.findByPk(req.params.id);
    if (!tech) return res.status(404).json({ message: "Not found" });

    const data: any = {
      domainId: Number(req.body.domainId ?? tech.domainId),
      courseId: Number(req.body.courseId ?? tech.courseId),
      name: req.body.name ?? tech.name,
      order: Number(req.body.order ?? tech.order),
      isActive:
        req.body.isActive !== undefined
          ? Boolean(req.body.isActive)
          : tech.isActive,
    };

    // 🔥 replace image if uploaded
    if (req.file) {
      if (tech.iconUrl) {
        const oldPath = path.join(process.cwd(), tech.iconUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      data.iconUrl = `/uploads/tech-stack/${req.file.filename}`;
    }

    await tech.update(data);
    res.json(tech);
  } catch (error) {
    console.error("UPDATE TECH STACK ERROR:", error);
    res.status(500).json({ message: "Failed to update tech stack" });
  }
};

/* =====================================================
   🔴 ADMIN – DELETE
===================================================== */
export const deleteTechStack = async (req: Request, res: Response) => {
  try {
    const tech = await TechStack.findByPk(req.params.id);
    if (!tech) return res.status(404).json({ message: "Not found" });

    if (tech.iconUrl) {
      const imgPath = path.join(process.cwd(), tech.iconUrl);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await tech.destroy();
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE TECH STACK ERROR:", error);
    res.status(500).json({ message: "Failed to delete tech stack" });
  }
};
