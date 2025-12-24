import { Request, Response } from "express";
import { Testimonial } from "../models/Testimonial.model";

/* ---------- GET ---------- */
export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId ?? 0);

    let data = await Testimonial.findAll({
      where: { domainId, isActive: true },
      order: [["id", "ASC"]],
    });

    if (!data.length && domainId > 0) {
      data = await Testimonial.findAll({
        where: { domainId: 0, isActive: true },
        order: [["id", "ASC"]],
      });
    }

    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
};

/* ---------- CREATE ---------- */
export const createTestimonial = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const testimonial = await Testimonial.create({
      ...req.body,
      image: `/uploads/testimonials/${req.file.filename}`,
    });

    res.status(201).json(testimonial);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to create testimonial",
      error: error.message,
    });
  }
};

/* ---------- UPDATE ---------- */
export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Not found" });
    }

    const updatedData: any = { ...req.body };

    if (req.file) {
      updatedData.image = `/uploads/testimonials/${req.file.filename}`;
    }

    await testimonial.update(updatedData);
    res.json(testimonial);
  } catch {
    res.status(400).json({ message: "Failed to update testimonial" });
  }
};

/* ---------- DELETE ---------- */
export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Not found" });
    }

    await testimonial.destroy();
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(400).json({ message: "Failed to delete testimonial" });
  }
};
