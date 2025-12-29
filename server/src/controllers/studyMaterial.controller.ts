// controllers/studyMaterial.controller.ts
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { StudyMaterial } from "../models/StudyMaterial.model";
import { Sequelize } from "sequelize";

/* ---------- PUBLIC: Get all active study materials ---------- */
export const getStudyMaterials = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let where: any = { isActive: true };

    if (domainId > 0) where.domainId = domainId;
    if (courseId > 0) where.courseId = courseId;

    // Random ordering for landing page
    const order =
      domainId === 0 && courseId === 0
        ? Sequelize.literal("RAND()")
        : [["id", "ASC"]];

    const materials = await StudyMaterial.findAll({
      where,
      order: order as any,
    });

    res.json(materials);
  } catch (error: any) {
    console.error("STUDY MATERIAL FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch study materials" });
  }
};

/* ---------- ADMIN: Get ALL study materials (including inactive) ---------- */
export const getAllStudyMaterialsForAdmin = async (_req: Request, res: Response) => {
  try {
    const materials = await StudyMaterial.findAll({
      order: [["id", "ASC"]],
    });
    console.log(`Found ${materials.length} study materials for admin`);
    res.json(materials);
  } catch (error: any) {
    console.error("Error fetching all study materials:", error);
    res.status(500).json({ message: "Failed to fetch all study materials" });
  }
};

/* ---------- GET STUDY MATERIAL BY ID ---------- */
export const getStudyMaterialById = async (req: Request, res: Response) => {
  try {
    const material = await StudyMaterial.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Study material not found" });
    }
    res.json(material);
  } catch (error: any) {
    console.error("Error fetching study material by ID:", error);
    res.status(500).json({ message: "Failed to fetch study material" });
  }
};

/* ---------- CREATE STUDY MATERIAL ---------- */
export const createStudyMaterial = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const material = await StudyMaterial.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      fileName: req.body.fileName,
      description: req.body.description || '',
      fileType: req.body.fileType || 'PDF',
      highlight: req.body.highlight,
      filePath: `/uploads/study-materials/${req.file.filename}`,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    });

    res.status(201).json({
      message: "Study material created successfully",
      material
    });
  } catch (error: any) {
    console.error("STUDY MATERIAL CREATE ERROR:", error);
    res.status(400).json({ 
      message: "Study material creation failed",
      error: error.message 
    });
  }
};

/* ---------- UPDATE STUDY MATERIAL ---------- */
// Note: Add this if you want update functionality
export const updateStudyMaterial = async (req: Request, res: Response) => {
  try {
    const material = await StudyMaterial.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Study material not found" });
    }

    let updatedFilePath = material.filePath;
    
    if (req.file) {
      // Delete old file
      const oldFilename = material.filePath.split('/').pop();
      if (oldFilename) {
        const oldPath = path.join('uploads/study-materials', oldFilename);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updatedFilePath = `/uploads/study-materials/${req.file.filename}`;
    }

    await material.update({
      domainId: req.body.domainId !== undefined ? Number(req.body.domainId) : material.domainId,
      courseId: req.body.courseId !== undefined ? Number(req.body.courseId) : material.courseId,
      fileName: req.body.fileName || material.fileName,
      description: req.body.description !== undefined ? req.body.description : material.description,
      fileType: req.body.fileType || material.fileType,
      highlight: req.body.highlight || material.highlight,
      filePath: updatedFilePath,
      isActive: req.body.isActive !== undefined 
        ? (req.body.isActive === 'true' || req.body.isActive === true) 
        : material.isActive,
    });

    const updatedMaterial = await StudyMaterial.findByPk(req.params.id);
    
    res.json({
      message: "Study material updated successfully",
      material: updatedMaterial
    });
  } catch (error: any) {
    console.error("STUDY MATERIAL UPDATE ERROR:", error);
    res.status(400).json({ 
      message: "Study material update failed",
      error: error.message 
    });
  }
};

/* ---------- DELETE STUDY MATERIAL PERMANENTLY ---------- */
export const deleteStudyMaterial = async (req: Request, res: Response) => {
  try {
    const material = await StudyMaterial.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Study material not found" });
    }

    // Delete file from disk
    const filename = material.filePath.split('/').pop();
    if (filename) {
      const filePath = path.join('uploads/study-materials', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await material.destroy();
    
    res.json({ 
      message: "Study material deleted permanently",
      success: true
    });
  } catch (error: any) {
    console.error("STUDY MATERIAL DELETE ERROR:", error);
    res.status(400).json({ 
      message: "Study material deletion failed",
      error: error.message
    });
  }
};