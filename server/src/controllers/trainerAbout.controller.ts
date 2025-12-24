import { Request, Response } from "express";
import { TrainerAbout } from "../models/TrainerAbout.model";

/* ---------- GET (Frontend) ---------- */
export const getTrainerAbout = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let data = await TrainerAbout.findOne({
      where: { domainId, courseId, isActive: true },
    });

    // fallback → domain level
    if (!data && domainId > 0 && courseId > 0) {
      data = await TrainerAbout.findOne({
        where: { domainId, courseId: 0, isActive: true },
      });
    }

    // fallback → landing
    if (!data) {
      data = await TrainerAbout.findOne({
        where: { domainId: 0, courseId: 0, isActive: true },
      });
    }

    if (!data) {
      return res.status(404).json({ message: "Trainer About not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trainer about" });
  }
};

/* ---------- CREATE ---------- */
export const createTrainerAbout = async (req: Request, res: Response) => {
  try {
    const data = await TrainerAbout.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: "Failed to create trainer about" });
  }
};

/* ---------- UPDATE ---------- */
export const updateTrainerAbout = async (req: Request, res: Response) => {
  try {
    const data = await TrainerAbout.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: "Trainer About not found" });

    await data.update(req.body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: "Failed to update trainer about" });
  }
};

/* ---------- DELETE ---------- */
export const deleteTrainerAbout = async (req: Request, res: Response) => {
  try {
    const data = await TrainerAbout.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: "Trainer About not found" });

    await data.destroy();
    res.json({ message: "Trainer About deleted" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete trainer about" });
  }
};
