import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { VideoTestimonial } from "../models/VideoTestimonial.model";

/* =====================================================
   🔵 FRONTEND – GET
===================================================== */
export const getVideoTestimonials = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let data = await VideoTestimonial.findAll({
      where: { domainId, courseId, isActive: true },
      order: [["order", "ASC"]],
    });

    // fallback → domain level
    if (!data.length && courseId > 0) {
      data = await VideoTestimonial.findAll({
        where: { domainId, courseId: 0, isActive: true },
        order: [["order", "ASC"]],
      });
    }

    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch video testimonials" });
  }
};

/* =====================================================
   🟢 ADMIN – CREATE
===================================================== */
export const createVideoTestimonial = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Thumbnail image required" });
    }

    const item = await VideoTestimonial.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      name: req.body.name,
      batch: req.body.batch,
      quote: req.body.quote,
      videoUrl: req.body.videoUrl,
      order: Number(req.body.order || 0),
      imageUrl: `/uploads/video-thumbnails/${req.file.filename}`,
      isActive: true,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("VIDEO TESTIMONIAL CREATE ERROR:", error);
    res.status(500).json({ message: "Failed to create video testimonial" });
  }
};

/* =====================================================
   🟡 ADMIN – UPDATE (IMAGE OPTIONAL)
===================================================== */
export const updateVideoTestimonial = async (req: Request, res: Response) => {
  try {
    const item = await VideoTestimonial.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    const data: any = {
      domainId: Number(req.body.domainId ?? item.domainId),
      courseId: Number(req.body.courseId ?? item.courseId),
      name: req.body.name ?? item.name,
      batch: req.body.batch ?? item.batch,
      quote: req.body.quote ?? item.quote,
      videoUrl: req.body.videoUrl ?? item.videoUrl,
      order: Number(req.body.order ?? item.order),
      isActive:
        req.body.isActive !== undefined
          ? Boolean(req.body.isActive)
          : item.isActive,
    };

    // 🔥 replace thumbnail
    if (req.file) {
      if (item.imageUrl) {
        const oldPath = path.join(process.cwd(), item.imageUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      data.imageUrl = `/uploads/video-thumbnails/${req.file.filename}`;
    }

    await item.update(data);
    res.json(item);
  } catch (error) {
    console.error("VIDEO TESTIMONIAL UPDATE ERROR:", error);
    res.status(500).json({ message: "Failed to update video testimonial" });
  }
};

/* =====================================================
   🔴 ADMIN – DELETE
===================================================== */
export const deleteVideoTestimonial = async (req: Request, res: Response) => {
  try {
    const item = await VideoTestimonial.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    if (item.imageUrl) {
      const imgPath = path.join(process.cwd(), item.imageUrl);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await item.destroy();
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("VIDEO TESTIMONIAL DELETE ERROR:", error);
    res.status(500).json({ message: "Failed to delete video testimonial" });
  }
};
