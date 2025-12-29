import { Request, Response } from "express";
import { CareerImpact } from "../models/CareerImpact.model";

/* ---------- GET (Frontend) ---------- */
export const getCareerImpact = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let data = await CareerImpact.findOne({
      where: { domainId, courseId, isActive: true },
    });

    // fallback → domain-level
    if (!data && domainId > 0 && courseId > 0) {
      data = await CareerImpact.findOne({
        where: { domainId, courseId: 0, isActive: true },
      });
    }

    // fallback → landing
    if (!data) {
      data = await CareerImpact.findOne({
        where: { domainId: 0, courseId: 0, isActive: true },
      });
    }

    if (!data) {
      return res.status(404).json({ message: "Career Impact not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch career impact" });
  }
};

/* ---------- CREATE ---------- */
export const createCareerImpact = async (req: Request, res: Response) => {
  try {
    const data = await CareerImpact.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: "Failed to create career impact" });
  }
};

/* ---------- UPDATE ---------- */
export const updateCareerImpact = async (req: Request, res: Response) => {
  try {
    const data = await CareerImpact.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Career Impact not found" });
    }

    await data.update(req.body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: "Failed to update career impact" });
  }
};

/* ---------- DELETE ---------- */
export const deleteCareerImpact = async (req: Request, res: Response) => {
  try {
    const data = await CareerImpact.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Career Impact not found" });
    }

    await data.destroy();
    res.json({ message: "Career Impact deleted" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete career impact" });
  }
};
