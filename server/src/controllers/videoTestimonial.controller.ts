import { Request, Response } from "express";
import { VideoTestimonial } from "../models/VideoTestimonial.model";

/* ================= FRONTEND ================= */
export const getVideoTestimonials = async (req: Request, res: Response) => {
  const domainId = Number(req.query.domainId || 0);
  const courseId = Number(req.query.courseId || 0);

  let data = await VideoTestimonial.findAll({
    where: { domainId, courseId, isActive: true },
    order: [["order", "ASC"]],
  });

  if (!data.length && courseId > 0) {
    data = await VideoTestimonial.findAll({
      where: { domainId, courseId: 0, isActive: true },
      order: [["order", "ASC"]],
    });
  }

  res.json(data);
};

/* ================= ADMIN ================= */
export const createVideoTestimonial = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: "Image required" });

  const testimonial = await VideoTestimonial.create({
    ...req.body,
    imageUrl: `/uploads/videos/${req.file.filename}`,
  });

  res.status(201).json(testimonial);
};

export const deleteVideoTestimonial = async (req: Request, res: Response) => {
  const item = await VideoTestimonial.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });

  await item.destroy();
  res.json({ message: "Deleted" });
};
