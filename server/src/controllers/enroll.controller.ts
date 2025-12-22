import { Request, Response } from "express";
import { Enroll } from "../models/Enroll.model";
import { EnrollCard } from "../models/EnrollCard.model";

/* ---------- GET (Frontend) ---------- */
export const getEnrollSection = async (req: Request, res: Response) => {
  const domainId = Number(req.query.domainId || 0);
  const courseId = Number(req.query.courseId || 0);

  let section = await Enroll.findOne({
    where: { domainId, courseId, isActive: true },
    include: [{ model: EnrollCard, where: { isActive: true }, required: false }],
  });

  if (!section && domainId > 0 && courseId > 0) {
    section = await Enroll.findOne({
      where: { domainId, courseId: 0, isActive: true },
      include: [{ model: EnrollCard, where: { isActive: true }, required: false }],
    });
  }

  if (!section) {
    section = await Enroll.findOne({
      where: { domainId: 0, courseId: 0, isActive: true },
      include: [{ model: EnrollCard, where: { isActive: true }, required: false }],
    });
  }

  if (!section) return res.status(404).json({ message: "Enroll section not found" });

  res.json(section);
};

/* ---------- ADMIN CRUD ---------- */
export const createEnrollSection = async (req: Request, res: Response) => {
  const section = await Enroll.create(req.body);
  res.status(201).json(section);
};

export const updateEnrollSection = async (req: Request, res: Response) => {
  const section = await Enroll.findByPk(req.params.id);
  if (!section) return res.status(404).json({ message: "Not found" });

  await section.update(req.body);
  res.json(section);
};

export const deleteEnrollSection = async (req: Request, res: Response) => {
  const section = await Enroll.findByPk(req.params.id);
  if (!section) return res.status(404).json({ message: "Not found" });

  await section.destroy();
  res.json({ message: "Enroll section deleted" });
};

/* ---------- CARD CRUD ---------- */
export const addEnrollCard = async (req: Request, res: Response) => {
  const { enrollSectionId, title, order } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Image required" });
  }

  const card = await EnrollCard.create({
    enrollSectionId,
    title,
    order,
    imageUrl: `/uploads/enroll/${req.file.filename}`,
  });

  res.status(201).json(card);
};

export const deleteEnrollCard = async (req: Request, res: Response) => {
  const card = await EnrollCard.findByPk(req.params.id);
  if (!card) return res.status(404).json({ message: "Card not found" });

  await card.destroy();
  res.json({ message: "Card deleted" });
};
