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
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || !files.length) {
      return res.status(400).json({ message: "Hero images are required" });
    }

    const imageUrls = files.map(
      (file) => `/uploads/heroes/${file.filename}`
    );

    const hero = await Hero.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      title: req.body.title,
      subtitle: req.body.subtitle,
      description: req.body.description,
      ctaText: req.body.ctaText,
      ctaLink: req.body.ctaLink,
      images: imageUrls,

      // 🔥 RUNNING TEXT
      runningTexts: req.body.runningTexts
        ? JSON.parse(req.body.runningTexts)
        : [],

      isActive: req.body.isActive ?? true,
    });

    res.status(201).json(hero);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to create hero",
      error: error.message,
    });
  }
};


/* ---------- UPDATE ---------- */
export const updateHero = async (req: Request, res: Response) => {
  try {
    const hero = await Hero.findByPk(req.params.id);
    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    const files = req.files as Express.Multer.File[] | undefined;

    const updatedImages =
      files && files.length
        ? files.map((file) => `/uploads/heroes/${file.filename}`)
        : hero.images;

    await hero.update({
      domainId: req.body.domainId ?? hero.domainId,
      courseId: req.body.courseId ?? hero.courseId,
      title: req.body.title ?? hero.title,
      subtitle: req.body.subtitle ?? hero.subtitle,
      description: req.body.description ?? hero.description,
      ctaText: req.body.ctaText ?? hero.ctaText,
      ctaLink: req.body.ctaLink ?? hero.ctaLink,
      images: updatedImages,

      // 🔥 RUNNING TEXT
      runningTexts: req.body.runningTexts
        ? JSON.parse(req.body.runningTexts)
        : hero.runningTexts,

      isActive: req.body.isActive ?? hero.isActive,
    });

    res.json(hero);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to update hero",
      error: error.message,
    });
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
