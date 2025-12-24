import { Request, Response } from "express";
import { About } from "../models/About.model";

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
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch about data" });
  }
};

/* ---------- CREATE ---------- */
export const createAbout = async (req: Request, res: Response) => {
  try {
    const about = await About.create(req.body);
    res.status(201).json(about);
  } catch (error) {
    res.status(400).json({ message: "Failed to create about section" });
  }
};

/* ---------- UPDATE ---------- */
export const updateAbout = async (req: Request, res: Response) => {
  try {
    const about = await About.findByPk(req.params.id);
    if (!about) return res.status(404).json({ message: "About not found" });

    await about.update(req.body);
    res.json(about);
  } catch (error) {
    res.status(400).json({ message: "Failed to update about section" });
  }
};

/* ---------- DELETE ---------- */
export const deleteAbout = async (req: Request, res: Response) => {
  try {
    const about = await About.findByPk(req.params.id);
    if (!about) return res.status(404).json({ message: "About not found" });

    await about.destroy();
    res.json({ message: "About deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete about section" });
  }
};
