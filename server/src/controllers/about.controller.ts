// controllers/about.controller.ts
import { Request, Response } from "express";
import { About } from "../models/About.model";
import path from "path";
import fs from "fs";

// Helper function to get files
function getFiles(req: Request, fieldName: string): Express.Multer.File[] {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  return files?.[fieldName] || [];
}

/* ---------- GET (Frontend) ---------- */
export const getAboutData = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let about = await About.findOne({
      where: { domainId, courseId, isActive: true },
    });

    // fallback → domain-level
    if (!about && domainId > 0 && courseId > 0) {
      about = await About.findOne({
        where: { domainId, courseId: 0, isActive: true },
      });
    }

    // fallback → landing
    if (!about) {
      about = await About.findOne({
        where: { domainId: 0, courseId: 0, isActive: true },
      });
    }

    if (!about) {
      return res.status(404).json({ message: "About data not found" });
    }

    res.json(about);
  } catch (error: any) {
    console.error("Error in getAboutData:", error);
    res.status(500).json({ message: "Failed to fetch about data" });
  }
};

/* ---------- GET ALL (Admin) ---------- */
export const getAllAbouts = async (req: Request, res: Response) => {
  try {
    const abouts = await About.findAll({
      order: [['createdAt', 'DESC']]
    });
    console.log(`Found ${abouts.length} about sections`);
    res.json(abouts);
  } catch (error: any) {
    console.error("Error fetching all abouts:", error);
    res.status(500).json({ message: "Failed to fetch all about sections" });
  }
};

/* ---------- CREATE ---------- */
export const createAbout = async (req: Request, res: Response) => {
  try {
    const mainFiles = getFiles(req, 'mainImages');
    const smallFiles = getFiles(req, 'smallImages');

    if (mainFiles.length === 0) {
      return res.status(400).json({ message: "Main images are required" });
    }

    const mainImages = mainFiles.map(
      (file) => `/uploads/about/${file.filename}`
    );

    const smallImages = smallFiles.map(
      (file) => `/uploads/about/${file.filename}`
    );

    const about = await About.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      label: req.body.label,
      heading: req.body.heading,
      description1: req.body.description1,
      description2: req.body.description2 || '',
      mainImages,
      smallImages,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    });

    res.status(201).json({
      message: "About section created successfully",
      about
    });
  } catch (error: any) {
    console.error("Create Error:", error);
    res.status(400).json({ 
      message: "Failed to create about section",
      error: error.message 
    });
  }
};

/* ---------- UPDATE ---------- */
export const updateAbout = async (req: Request, res: Response) => {
  try {
    const about = await About.findByPk(req.params.id);
    if (!about) {
      return res.status(404).json({ message: "About section not found" });
    }

    // Get new uploaded files
    const newMainFiles = getFiles(req, 'mainImages');
    const newSmallFiles = getFiles(req, 'smallImages');

    // Parse existing images from request body
    let existingMainImages: string[] = [];
    let existingSmallImages: string[] = [];
    
    try {
      existingMainImages = req.body.existingMainImages 
        ? JSON.parse(req.body.existingMainImages) 
        : [];
      existingSmallImages = req.body.existingSmallImages 
        ? JSON.parse(req.body.existingSmallImages) 
        : [];
    } catch (e) {
      console.warn("Error parsing existing images:", e);
      // If parsing fails, assume no existing images should be kept
      existingMainImages = [];
      existingSmallImages = [];
    }

    // Prepare updated image arrays
    let updatedMainImages = [...existingMainImages];
    let updatedSmallImages = [...existingSmallImages];

    // Add new main images
    if (newMainFiles.length > 0) {
      const newMainImagePaths = newMainFiles.map(
        (file) => `/uploads/about/${file.filename}`
      );
      updatedMainImages = [...updatedMainImages, ...newMainImagePaths];
    }

    // Add new small images
    if (newSmallFiles.length > 0) {
      const newSmallImagePaths = newSmallFiles.map(
        (file) => `/uploads/about/${file.filename}`
      );
      updatedSmallImages = [...updatedSmallImages, ...newSmallImagePaths];
    }

    // Find removed images to delete from server
    const removedMainImages = (about.mainImages || []).filter(img => 
      !existingMainImages.includes(img)
    );
    
    const removedSmallImages = (about.smallImages || []).filter(img => 
      !existingSmallImages.includes(img)
    );

    // Delete removed files from disk
    const deleteImageFiles = (imagePaths: string[]) => {
      imagePaths.forEach(imgPath => {
        const filename = imgPath.split('/').pop();
        if (filename) {
          const filePath = path.join('uploads/about', filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });
    };

    deleteImageFiles([...removedMainImages, ...removedSmallImages]);

    // Update the about section
    await about.update({
      domainId: req.body.domainId ? Number(req.body.domainId) : about.domainId,
      courseId: req.body.courseId ? Number(req.body.courseId) : about.courseId,
      label: req.body.label || about.label,
      heading: req.body.heading || about.heading,
      description1: req.body.description1 || about.description1,
      description2: req.body.description2 || about.description2,
      mainImages: updatedMainImages,
      smallImages: updatedSmallImages,
      isActive: req.body.isActive !== undefined 
        ? (req.body.isActive === 'true' || req.body.isActive === true) 
        : about.isActive,
    });

    const updatedAbout = await About.findByPk(req.params.id);
    
    res.json({
      message: "About section updated successfully",
      about: updatedAbout
    });

  } catch (error: any) {
    console.error("Update Error:", error);
    res.status(400).json({ 
      message: "Failed to update about section",
      error: error.message 
    });
  }
};

/* ---------- DELETE ---------- */
export const deleteAbout = async (req: Request, res: Response) => {
  try {
    const about = await About.findByPk(req.params.id);
    if (!about) {
      return res.status(404).json({ message: "About not found" });
    }

    // Delete associated images
    [...(about.mainImages || []), ...(about.smallImages || [])].forEach(imgPath => {
      const filename = imgPath.split('/').pop();
      if (filename) {
        const filePath = path.join('uploads/about', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    await about.destroy();
    
    res.json({ 
      message: "About section deleted successfully",
      success: true
    });
  } catch (error: any) {
    console.error("Error deleting about:", error);
    res.status(400).json({ 
      message: "Failed to delete about section",
      error: error.message
    });
  }
};