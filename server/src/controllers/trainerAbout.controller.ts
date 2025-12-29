import { Request, Response } from "express";
import { TrainerAbout } from "../models/TrainerAbout.model";
import fs from "fs";
import path from "path";

export const getTrainerAbout = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let data = await TrainerAbout.findOne({
      where: { domainId, courseId, isActive: true },
      order: [["id", "ASC"]] // Only id ordering
    });

    // Fallback to domain level
    if (!data && domainId > 0 && courseId > 0) {
      data = await TrainerAbout.findOne({
        where: { domainId, courseId: 0, isActive: true },
        order: [["id", "ASC"]]
      });
    }

    // Fallback to landing page
    if (!data) {
      data = await TrainerAbout.findOne({
        where: { domainId: 0, courseId: 0, isActive: true },
        order: [["id", "ASC"]]
      });
    }

    if (!data) {
      return res.status(404).json({ message: "Trainer About section not found" });
    }

    res.json(data);
  } catch (error: any) {
    console.error("TRAINER ABOUT FETCH ERROR:", error);
    res.status(500).json({ 
      message: "Failed to fetch trainer about section",
      error: error.message 
    });
  }
};

/* ---------- ADMIN: Get ALL trainer about sections ---------- */
export const getAllTrainerAboutsForAdmin = async (_req: Request, res: Response) => {
  try {
    const trainerAbouts = await TrainerAbout.findAll({
      order: [["id", "ASC"]] // Only id ordering
    });
    console.log(`Found ${trainerAbouts.length} trainer about sections for admin`);
    res.json(trainerAbouts);
  } catch (error: any) {
    console.error("Error fetching all trainer abouts:", error);
    res.status(500).json({ 
      message: "Failed to fetch all trainer about sections",
      error: error.message 
    });
  }
};

/* ---------- GET TRAINER ABOUT BY ID ---------- */
export const getTrainerAboutById = async (req: Request, res: Response) => {
  try {
    const trainerAbout = await TrainerAbout.findByPk(req.params.id);
    if (!trainerAbout) {
      return res.status(404).json({ message: "Trainer About section not found" });
    }
    res.json(trainerAbout);
  } catch (error: any) {
    console.error("Error fetching trainer about by ID:", error);
    res.status(500).json({ 
      message: "Failed to fetch trainer about section",
      error: error.message 
    });
  }
};

/* ---------- CREATE TRAINER ABOUT ---------- */
export const createTrainerAbout = async (req: Request, res: Response) => {
  try {
    const files = req.files as {
      mainImages?: Express.Multer.File[];
      smallImages?: Express.Multer.File[];
    };

    const mainImages = files?.mainImages?.map((f) => `/uploads/trainer-about/${f.filename}`) || [];
    const smallImages = files?.smallImages?.map((f) => `/uploads/trainer-about/${f.filename}`) || [];

    const trainerAbout = await TrainerAbout.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      label: req.body.label,
      heading: req.body.heading,
      description1: req.body.description1,
      description2: req.body.description2 || null,
      mainImages,
      smallImages,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
      // REMOVED: sortOrder: Number(req.body.sortOrder || 0),
    });

    res.status(201).json({
      message: "Trainer About section created successfully",
      trainerAbout
    });
  } catch (error: any) {
    console.error("TRAINER ABOUT CREATE ERROR:", error);
    
    // Clean up uploaded files if creation fails
    const files = req.files as {
      mainImages?: Express.Multer.File[];
      smallImages?: Express.Multer.File[];
    };
    
    if (files?.mainImages) {
      files.mainImages.forEach(file => {
        const filePath = path.join("uploads", "trainer-about", file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    if (files?.smallImages) {
      files.smallImages.forEach(file => {
        const filePath = path.join("uploads", "trainer-about", file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    res.status(400).json({ 
      message: "Trainer About section creation failed",
      error: error.message 
    });
  }
};

/* ---------- UPDATE TRAINER ABOUT ---------- */
export const updateTrainerAbout = async (req: Request, res: Response) => {
  try {
    const trainerAbout = await TrainerAbout.findByPk(req.params.id);
    if (!trainerAbout) {
      return res.status(404).json({ message: "Trainer About section not found" });
    }

    const files = req.files as {
      mainImages?: Express.Multer.File[];
      smallImages?: Express.Multer.File[];
    };

    let mainImages = trainerAbout.mainImages || [];
    let smallImages = trainerAbout.smallImages || [];
    let oldImagesToDelete: string[] = [];

    // Handle main images update
    if (files?.mainImages && files.mainImages.length > 0) {
      // Mark old images for deletion
      oldImagesToDelete.push(...trainerAbout.mainImages.map(img => 
        img.replace("/uploads/", "uploads/")
      ));
      
      mainImages = files.mainImages.map((f) => `/uploads/trainer-about/${f.filename}`);
    }

    // Handle small images update
    if (files?.smallImages && files.smallImages.length > 0) {
      // Mark old images for deletion
      oldImagesToDelete.push(...trainerAbout.smallImages.map(img => 
        img.replace("/uploads/", "uploads/")
      ));
      
      smallImages = files.smallImages.map((f) => `/uploads/trainer-about/${f.filename}`);
    }

    // Update trainer about record
    await trainerAbout.update({
      domainId: req.body.domainId !== undefined ? Number(req.body.domainId) : trainerAbout.domainId,
      courseId: req.body.courseId !== undefined ? Number(req.body.courseId) : trainerAbout.courseId,
      label: req.body.label || trainerAbout.label,
      heading: req.body.heading || trainerAbout.heading,
      description1: req.body.description1 !== undefined ? req.body.description1 : trainerAbout.description1,
      description2: req.body.description2 !== undefined ? req.body.description2 : trainerAbout.description2,
      mainImages,
      smallImages,
      isActive: req.body.isActive !== undefined 
        ? (req.body.isActive === 'true' || req.body.isActive === true) 
        : trainerAbout.isActive,
      // REMOVED: sortOrder update
    });

    // Delete old images
    oldImagesToDelete.forEach(imagePath => {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    const updatedTrainerAbout = await TrainerAbout.findByPk(req.params.id);
    
    res.json({
      message: "Trainer About section updated successfully",
      trainerAbout: updatedTrainerAbout
    });
  } catch (error: any) {
    console.error("TRAINER ABOUT UPDATE ERROR:", error);
    
    // Clean up uploaded files if update fails
    const files = req.files as {
      mainImages?: Express.Multer.File[];
      smallImages?: Express.Multer.File[];
    };
    
    if (files?.mainImages) {
      files.mainImages.forEach(file => {
        const filePath = path.join("uploads", "trainer-about", file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    if (files?.smallImages) {
      files.smallImages.forEach(file => {
        const filePath = path.join("uploads", "trainer-about", file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    res.status(400).json({ 
      message: "Trainer About section update failed",
      error: error.message 
    });
  }
};

/* ---------- DELETE TRAINER ABOUT PERMANENTLY ---------- */
export const deleteTrainerAbout = async (req: Request, res: Response) => {
  try {
    const trainerAbout = await TrainerAbout.findByPk(req.params.id);
    if (!trainerAbout) {
      return res.status(404).json({ message: "Trainer About section not found" });
    }

    // Delete images from disk
    const allImages = [...trainerAbout.mainImages, ...trainerAbout.smallImages];
    allImages.forEach(image => {
      if (image) {
        const diskPath = image.replace("/uploads/", "uploads/");
        if (fs.existsSync(diskPath)) {
          fs.unlinkSync(diskPath);
        }
      }
    });

    await trainerAbout.destroy();
    
    res.json({ 
      message: "Trainer About section deleted permanently",
      success: true
    });
  } catch (error: any) {
    console.error("TRAINER ABOUT DELETE ERROR:", error);
    res.status(400).json({ 
      message: "Trainer About section deletion failed",
      error: error.message
    });
  }
};

/* ---------- REMOVE THE updateSortOrder FUNCTION COMPLETELY ---------- */
// Delete this entire function