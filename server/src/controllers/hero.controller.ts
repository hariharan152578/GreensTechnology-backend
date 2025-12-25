import { Request, Response } from "express";
import { Hero } from "../models/Hero.model";

/* ---------- GET (Frontend) ---------- */
export const getHeroData = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let hero = await Hero.findOne({
      where: { domainId, courseId, isActive: true },
    });

    if (!hero && domainId > 0 && courseId > 0) {
      hero = await Hero.findOne({
        where: { domainId, courseId: 0, isActive: true },
      });
    }

    if (!hero) {
      hero = await Hero.findOne({
        where: { domainId: 0, courseId: 0, isActive: true },
      });
    }

    if (!hero) {
      return res.status(404).json({ message: "Hero data not found" });
    }

    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hero data" });
  }
};

/* ---------- CREATE ---------- */
export const createHero = async (req: Request, res: Response) => {
  try {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const images =
      files?.images?.map(
        (file) => `/uploads/hero/${file.filename}`
      ) || [];

    const hero = await Hero.create({
      ...req.body,
      images,
    });

    res.status(201).json(hero);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to create hero" });
  }
};


/* ---------- UPDATE ---------- */
export const updateHero = async (req: Request, res: Response) => {
  try {
    const hero = await Hero.findByPk(req.params.id);
    if (!hero) return res.status(404).json({ message: "Hero not found" });

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const images =
      files?.images?.map(
        (file) => `/uploads/hero/${file.filename}`
      );

    await hero.update({
      ...req.body,
      ...(images && images.length > 0 && { images }),
    });

    res.json(hero);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to update hero" });
  }
};


/* ---------- DELETE ---------- */
export const deleteHero = async (req: Request, res: Response) => {
  try {
    const hero = await Hero.findByPk(req.params.id);
    if (!hero) return res.status(404).json({ message: "Hero not found" });

    await hero.destroy();
    res.json({ message: "Hero deleted" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete hero" });
  }
};



/* ---------- GET ALL (For Admin Panel) ---------- */
export const getAllHeroes = async (req: Request, res: Response) => {
  try {
    // Fetch ALL records, even inactive ones. 
    // Order by newest first (optional but helpful)
    const heroes = await Hero.findAll({
      order: [['createdAt', 'DESC']] 
    });

    res.json(heroes); // This sends an ARRAY [ ... ]
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch heroes list" });
  }
};
