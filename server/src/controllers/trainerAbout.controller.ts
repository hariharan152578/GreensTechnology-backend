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

    if (!data && domainId > 0 && courseId > 0) {
      data = await TrainerAbout.findOne({
        where: { domainId, courseId: 0, isActive: true },
      });
    }

    if (!data) {
      data = await TrainerAbout.findOne({
        where: { domainId: 0, courseId: 0, isActive: true },
      });
    }

    if (!data) {
      return res.status(404).json({ message: "Trainer About not found" });
    }

    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch trainer about" });
  }
};

/* ---------- CREATE (WITH IMAGES) ---------- */
export const createTrainerAbout = async (req: Request, res: Response) => {
  try {
    const files = req.files as {
      mainImages?: Express.Multer.File[];
      smallImages?: Express.Multer.File[];
    };

    const mainImages =
      files?.mainImages?.map((f) => `/uploads/trainer-about/${f.filename}`) ||
      [];
    const smallImages =
      files?.smallImages?.map((f) => `/uploads/trainer-about/${f.filename}`) ||
      [];

    const data = await TrainerAbout.create({
      domainId: req.body.domainId ?? 0,
      courseId: req.body.courseId ?? 0,
      label: req.body.label,
      heading: req.body.heading,
      description1: req.body.description1,
      description2: req.body.description2,
      mainImages,
      smallImages,
      isActive: req.body.isActive ?? true,
    });

    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* ---------- UPDATE (WITH OPTIONAL IMAGE UPDATE) ---------- */
export const updateTrainerAbout = async (req: Request, res: Response) => {
  try {
    const data = await TrainerAbout.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Trainer About not found" });
    }

    const files = req.files as {
      mainImages?: Express.Multer.File[];
      smallImages?: Express.Multer.File[];
    };

    const mainImages = files?.mainImages
      ? files.mainImages.map(
          (f) => `/uploads/trainer-about/${f.filename}`
        )
      : data.mainImages;

    const smallImages = files?.smallImages
      ? files.smallImages.map(
          (f) => `/uploads/trainer-about/${f.filename}`
        )
      : data.smallImages;

    await data.update({
      domainId: req.body.domainId ?? data.domainId,
      courseId: req.body.courseId ?? data.courseId,
      label: req.body.label ?? data.label,
      heading: req.body.heading ?? data.heading,
      description1: req.body.description1 ?? data.description1,
      description2: req.body.description2 ?? data.description2,
      mainImages,
      smallImages,
      isActive: req.body.isActive ?? data.isActive,
    });

    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* ---------- DELETE ---------- */
export const deleteTrainerAbout = async (req: Request, res: Response) => {
  try {
    const data = await TrainerAbout.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Trainer About not found" });
    }

    await data.destroy();
    res.json({ message: "Trainer About deleted successfully" });
  } catch {
    res.status(400).json({ message: "Failed to delete trainer about" });
  }
};
