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
    const hero = await Hero.create(req.body);
    res.status(201).json(hero);
  } catch (error) {
    res.status(400).json({ message: "Failed to create hero" });
  }
};

/* ---------- UPDATE ---------- */
export const updateHero = async (req: Request, res: Response) => {
  try {
    const hero = await Hero.findByPk(req.params.id);
    if (!hero) return res.status(404).json({ message: "Hero not found" });

    await hero.update(req.body);
    res.json(hero);
  } catch (error) {
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
