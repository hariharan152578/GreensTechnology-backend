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
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Video is required" });
    }

    const domain = await Domain.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      domain: req.body.domain,
      title: req.body.title,
      subtitle: req.body.subtitle,
      price: req.body.price,
      description: req.body.description,
      videoUrl: `/uploads/domains/videos/${file.filename}`,
      isActive: req.body.isActive === "true" || req.body.isActive === true,
    });

    res.status(201).json({ message: "Domain created", domain });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* ---------- UPDATE DOMAIN ---------- */
export const updateDomain = async (req: Request, res: Response) => {
  try {
    const domain = await Domain.findByPk(req.params.id);
    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }

const file = req.file;

let updatedVideoUrl = domain.videoUrl;
if (file) {
  const oldPath = path.join(process.cwd(), domain.videoUrl);
  if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

  updatedVideoUrl = `/uploads/domains/videos/${file.filename}`;
}

 

    await domain.update({
      domainId: req.body.domainId !== undefined ? Number(req.body.domainId) : domain.domainId,
      courseId: req.body.courseId !== undefined ? Number(req.body.courseId) : domain.courseId,
      domain: req.body.domain || domain.domain,
      title: req.body.title || domain.title,
      subtitle: req.body.subtitle || domain.subtitle,
      price: req.body.price || domain.price,
      description: req.body.description || domain.description,
      videoUrl: updatedVideoUrl,
      isActive: req.body.isActive !== undefined 
        ? (req.body.isActive === 'true' || req.body.isActive === true) 
        : domain.isActive,
    });

    res.json({
      message: "Domain updated successfully",
      domain: await domain.reload()
    });
  } catch (error: any) {
    console.error("Update Error:", error);
    res.status(400).json({ message: "Failed to update", error: error.message });
  }
};

/* ---------- DELETE DOMAIN PERMANENTLY ---------- */
export const deleteDomain = async (req: Request, res: Response) => {
  try {
    const domain = await Domain.findByPk(req.params.id);
    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }

    // Delete associated video file
    const videoFilename = domain.videoUrl?.split("/").pop();

    if (videoFilename) {
      const videoPath = path.join("uploads/domains/videos", videoFilename);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }

    await domain.destroy();

    res.json({
      message: "Domain deleted permanently",
      success: true,
    });
  } catch (error: any) {
    console.error("Error deleting domain:", error);
    res.status(400).json({
      message: "Failed to delete domain",
      error: error.message,
    });
  }
};
