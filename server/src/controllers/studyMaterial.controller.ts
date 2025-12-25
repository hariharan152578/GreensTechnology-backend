import { Request, Response } from "express";
import { StudyMaterial } from "../models/StudyMaterial.model";
import { Op, Sequelize } from "sequelize";

/* ---------- GET MATERIALS ---------- */
export const getStudyMaterials = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId ?? 0);
    const courseId = Number(req.query.courseId ?? 0);

    let where: any = { isActive: true };

    if (domainId > 0) where.domainId = domainId;
    if (courseId > 0) where.courseId = courseId;

    // 🔥 RANDOM when domainId=0 & courseId=0
    const order =
      domainId === 0 && courseId === 0
        ? Sequelize.literal("RAND()")
        : [["id", "ASC"]];

    const data = await StudyMaterial.findAll({
      where,
      order: [order as any],
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch materials" });
  }
};

/* ---------- CREATE ---------- */
export const createStudyMaterial = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const material = await StudyMaterial.create({
      ...req.body,
      filePath: `/uploads/StudyMaterials/${req.file.filename}`,
    });

    res.status(201).json(material);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to upload material",
      error: error.message,
    });
  }
};

/* ---------- DELETE ---------- */
export const deleteStudyMaterial = async (req: Request, res: Response) => {
  try {
    const material = await StudyMaterial.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Not found" });
    }

    await material.destroy();
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(400).json({ message: "Failed to delete" });
  }
};


/* ---------- GET ALL (ADMIN) ---------- */
export const getAllStudyMaterials = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId ?? 0);
    const courseId = Number(req.query.courseId ?? 0);

    const where: any = {};

    // Optional filtering for admin
    if (domainId > 0) where.domainId = domainId;
    if (courseId > 0) where.courseId = courseId;

    const materials = await StudyMaterial.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.json(materials); // ✅ returns ARRAY
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch study materials (admin)",
    });
  }
};

