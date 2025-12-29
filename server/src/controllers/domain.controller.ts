// controllers/domain.controller.ts
import { Request, Response } from "express";
import { Domain } from "../models/Domain.model";
import path from "path";
import fs from "fs";

/* ---------- PUBLIC: Get all active domains ---------- */
export const getDomains = async (_req: Request, res: Response) => {
  try {
    const domains = await Domain.findAll({
      where: { isActive: true },
      order: [["id", "ASC"]],
    });
    res.json(domains);
  } catch (error: any) {
    console.error("Error fetching domains:", error);
    res.status(500).json({ message: "Failed to fetch domains" });
  }
};

/* ---------- ADMIN: Get ALL domains (including inactive) ---------- */
export const getAllDomainsForAdmin = async (_req: Request, res: Response) => {
  try {
    const domains = await Domain.findAll({
      order: [["id", "ASC"]],
    });
    console.log(`Found ${domains.length} domains for admin`);
    res.json(domains);
  } catch (error: any) {
    console.error("Error fetching all domains:", error);
    res.status(500).json({ message: "Failed to fetch all domains" });
  }
};

/* ---------- GET SINGLE DOMAIN ---------- */
export const getDomainById = async (req: Request, res: Response) => {
  try {
    const domain = await Domain.findByPk(req.params.id);
    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }
    res.json(domain);
  } catch (error: any) {
    console.error("Error fetching domain by ID:", error);
    res.status(500).json({ message: "Failed to fetch domain" });
  }
};

/* ---------- CREATE DOMAIN (WITH IMAGES) ---------- */
export const createDomain = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;
    const mainImage = files?.["mainImage"]?.[0];
    const smallImage = files?.["smallImage"]?.[0];

    if (!mainImage || !smallImage) {
      return res.status(400).json({ message: "Both main and small images are required" });
    }

    const domain = await Domain.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      domain: req.body.domain,
      title: req.body.title,
      subtitle: req.body.subtitle,
      price: req.body.price,
      description: req.body.description,
      mainImageUrl: `/uploads/domains/${mainImage.filename}`,
      smallImageUrl: `/uploads/domains/${smallImage.filename}`,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    });

    res.status(201).json({
      message: "Domain created successfully",
      domain
    });
  } catch (error: any) {
    console.error("Error creating domain:", error);
    res.status(400).json({ 
      message: "Failed to create domain",
      error: error.message 
    });
  }
};

/* ---------- UPDATE DOMAIN ---------- */
export const updateDomain = async (req: Request, res: Response) => {
  try {
    const domain = await Domain.findByPk(req.params.id);
    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }

    const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;
    const mainImage = files?.["mainImage"]?.[0];
    const smallImage = files?.["smallImage"]?.[0];

    // Handle image updates
    let updatedMainImageUrl = domain.mainImageUrl;
    let updatedSmallImageUrl = domain.smallImageUrl;
    
    // If new main image uploaded, delete old one
    if (mainImage) {
      // Delete old main image
      const oldMainFilename = domain.mainImageUrl.split('/').pop();
      if (oldMainFilename) {
        const oldMainPath = path.join('uploads/domains', oldMainFilename);
        if (fs.existsSync(oldMainPath)) {
          fs.unlinkSync(oldMainPath);
        }
      }
      updatedMainImageUrl = `/uploads/domains/${mainImage.filename}`;
    }
    
    // If new small image uploaded, delete old one
    if (smallImage) {
      // Delete old small image
      const oldSmallFilename = domain.smallImageUrl.split('/').pop();
      if (oldSmallFilename) {
        const oldSmallPath = path.join('uploads/domains', oldSmallFilename);
        if (fs.existsSync(oldSmallPath)) {
          fs.unlinkSync(oldSmallPath);
        }
      }
      updatedSmallImageUrl = `/uploads/domains/${smallImage.filename}`;
    }

    await domain.update({
      domainId: req.body.domainId !== undefined ? Number(req.body.domainId) : domain.domainId,
      courseId: req.body.courseId !== undefined ? Number(req.body.courseId) : domain.courseId,
      domain: req.body.domain || domain.domain,
      title: req.body.title || domain.title,
      subtitle: req.body.subtitle || domain.subtitle,
      price: req.body.price || domain.price,
      description: req.body.description || domain.description,
      mainImageUrl: updatedMainImageUrl,
      smallImageUrl: updatedSmallImageUrl,
      isActive: req.body.isActive !== undefined 
        ? (req.body.isActive === 'true' || req.body.isActive === true) 
        : domain.isActive,
    });

    const updatedDomain = await Domain.findByPk(req.params.id);
    
    res.json({
      message: "Domain updated successfully",
      domain: updatedDomain
    });
  } catch (error: any) {
    console.error("Error updating domain:", error);
    res.status(400).json({ 
      message: "Failed to update domain",
      error: error.message 
    });
  }
};

/* ---------- DELETE DOMAIN PERMANENTLY ---------- */
export const deleteDomain = async (req: Request, res: Response) => {
  try {
    const domain = await Domain.findByPk(req.params.id);
    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }

    // Delete associated images
    const mainFilename = domain.mainImageUrl.split('/').pop();
    const smallFilename = domain.smallImageUrl.split('/').pop();
    
    if (mainFilename) {
      const mainPath = path.join('uploads/domains', mainFilename);
      if (fs.existsSync(mainPath)) {
        fs.unlinkSync(mainPath);
      }
    }
    
    if (smallFilename) {
      const smallPath = path.join('uploads/domains', smallFilename);
      if (fs.existsSync(smallPath)) {
        fs.unlinkSync(smallPath);
      }
    }

    await domain.destroy();
    
    res.json({ 
      message: "Domain deleted permanently",
      success: true
    });
  } catch (error: any) {
    console.error("Error deleting domain:", error);
    res.status(400).json({ 
      message: "Failed to delete domain",
      error: error.message
    });
  }
};