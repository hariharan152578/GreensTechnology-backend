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
    const files = req.files as {
      mainImages?: Express.Multer.File[];
      smallImages?: Express.Multer.File[];
    };

    if (!files?.mainImages?.length) {
      return res.status(400).json({
        message: "Main images are required",
      });
    }

    const mainImages = files.mainImages.map(
      (file) => `/uploads/about/${file.filename}`
    );

    const smallImages = files.smallImages
      ? files.smallImages.map(
          (file) => `/uploads/about/${file.filename}`
        )
      : [];

    const about = await About.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      label: req.body.label,
      heading: req.body.heading,
      description1: req.body.description1,
      description2: req.body.description2,
      mainImages,
      smallImages,
      isActive: req.body.isActive ?? true,
    });

    res.status(201).json(about);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to create about section",
      error: error.message,
    });
  }
};

/* ---------- UPDATE ---------- */
export const updateAbout = async (req: Request, res: Response) => {
  try {
    const about = await About.findByPk(req.params.id);
    if (!about) {
      return res.status(404).json({ message: "About not found" });
    }

    const files = req.files as {
      mainImages?: Express.Multer.File[];
      smallImages?: Express.Multer.File[];
    };

    const updatedMainImages =
      files?.mainImages?.length
        ? files.mainImages.map(
            (file) => `/uploads/about/${file.filename}`
          )
        : about.mainImages;

    const updatedSmallImages =
      files?.smallImages?.length
        ? files.smallImages.map(
            (file) => `/uploads/about/${file.filename}`
          )
        : about.smallImages;

    await about.update({
      domainId: req.body.domainId ?? about.domainId,
      courseId: req.body.courseId ?? about.courseId,
      label: req.body.label ?? about.label,
      heading: req.body.heading ?? about.heading,
      description1: req.body.description1 ?? about.description1,
      description2: req.body.description2 ?? about.description2,
      mainImages: updatedMainImages,
      smallImages: updatedSmallImages,
      isActive: req.body.isActive ?? about.isActive,
    });

    res.json(about);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to update about section",
      error: error.message,
    });
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
