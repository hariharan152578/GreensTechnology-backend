// controllers/testimonial.controller.ts
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Testimonial } from "../models/Testimonial.model";

/* ---------- PUBLIC: Get all active testimonials ---------- */
export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);

    let testimonials = await Testimonial.findAll({
      where: { domainId, isActive: true },
      order: [["id", "ASC"]],
    });

    // fallback → domain level
    if (!testimonials.length && domainId > 0) {
      testimonials = await Testimonial.findAll({
        where: { domainId: 0, isActive: true },
        order: [["id", "ASC"]],
      });
    }

    res.json(testimonials);
  } catch (error: any) {
    console.error("TESTIMONIAL FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
};

/* ---------- ADMIN: Get ALL testimonials (including inactive) ---------- */
export const getAllTestimonialsForAdmin = async (_req: Request, res: Response) => {
  try {
    const testimonials = await Testimonial.findAll({
      order: [["id", "ASC"]],
    });
    console.log(`Found ${testimonials.length} testimonials for admin`);
    res.json(testimonials);
  } catch (error: any) {
    console.error("Error fetching all testimonials:", error);
    res.status(500).json({ message: "Failed to fetch all testimonials" });
  }
};

/* ---------- GET TESTIMONIAL BY ID ---------- */
export const getTestimonialById = async (req: Request, res: Response) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.json(testimonial);
  } catch (error: any) {
    console.error("Error fetching testimonial by ID:", error);
    res.status(500).json({ message: "Failed to fetch testimonial" });
  }
};

/* ---------- CREATE TESTIMONIAL ---------- */
export const createTestimonial = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Student photo required" });
    }

    const testimonial = await Testimonial.create({
      domainId: Number(req.body.domainId || 0),
      name: req.body.name,
      batch: req.body.batch,
      quote: req.body.quote,
      videoUrl: req.body.videoUrl || '',
      image: `/uploads/testimonials/${req.file.filename}`,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    });

    res.status(201).json({
      message: "Testimonial created successfully",
      testimonial
    });
  } catch (error: any) {
    console.error("TESTIMONIAL CREATE ERROR:", error);
    res.status(400).json({ 
      message: "Testimonial creation failed",
      error: error.message 
    });
  }
};

/* ---------- UPDATE TESTIMONIAL ---------- */
export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    // Handle image update
    let updatedImage = testimonial.image;
    
    if (req.file) {
      // Delete old image
      const oldFilename = testimonial.image.split('/').pop();
      if (oldFilename) {
        const oldPath = path.join('uploads/testimonials', oldFilename);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updatedImage = `/uploads/testimonials/${req.file.filename}`;
    }

    await testimonial.update({
      domainId: req.body.domainId !== undefined ? Number(req.body.domainId) : testimonial.domainId,
      name: req.body.name || testimonial.name,
      batch: req.body.batch || testimonial.batch,
      quote: req.body.quote || testimonial.quote,
      videoUrl: req.body.videoUrl !== undefined ? req.body.videoUrl : testimonial.videoUrl,
      image: updatedImage,
      isActive: req.body.isActive !== undefined 
        ? (req.body.isActive === 'true' || req.body.isActive === true) 
        : testimonial.isActive,
    });

    const updatedTestimonial = await Testimonial.findByPk(req.params.id);
    
    res.json({
      message: "Testimonial updated successfully",
      testimonial: updatedTestimonial
    });
  } catch (error: any) {
    console.error("TESTIMONIAL UPDATE ERROR:", error);
    res.status(400).json({ 
      message: "Testimonial update failed",
      error: error.message 
    });
  }
};

/* ---------- DELETE TESTIMONIAL PERMANENTLY ---------- */
export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    // Delete image from disk
    const filename = testimonial.image.split('/').pop();
    if (filename) {
      const filePath = path.join('uploads/testimonials', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await testimonial.destroy();
    
    res.json({ 
      message: "Testimonial deleted permanently",
      success: true
    });
  } catch (error: any) {
    console.error("TESTIMONIAL DELETE ERROR:", error);
    res.status(400).json({ 
      message: "Testimonial deletion failed",
      error: error.message
    });
  }
};