import { Request, Response } from "express";
import { EnrollCard } from "../models/EnrollCard.model";

/* ---------- GET (Frontend) ---------- */
export const getEnrollCards = async (req: Request, res: Response) => {
  const domainId = Number(req.query.domainId || 0);
  const courseId = Number(req.query.courseId || 0);

  let cards = await EnrollCard.findAll({
    where: { domainId, courseId, isActive: true },
    order: [["order", "ASC"]],
  });

  if (!cards.length && domainId > 0) {
    cards = await EnrollCard.findAll({
      where: { domainId, courseId: 0, isActive: true },
    });
  }

  if (!cards.length) {
    cards = await EnrollCard.findAll({
      where: { domainId: 0, courseId: 0, isActive: true },
    });
  }

  res.json(cards);
};

/* ---------- CREATE ---------- */
export const createEnrollCard = async (req: Request, res: Response) => {
  const image = req.file
    ? `/uploads/enroll-cards/${req.file.filename}`
    : "";

  const card = await EnrollCard.create({
    ...req.body,
    image,
  });

  res.json(card);
};

/* ---------- UPDATE ---------- */
export const updateEnrollCard = async (req: Request, res: Response) => {
  const card = await EnrollCard.findByPk(req.params.id);
  if (!card) return res.status(404).json({ message: "Not found" });

  if (req.file) {
    card.image = `/uploads/enroll-cards/${req.file.filename}`;
  }

  await card.update(req.body);
  res.json(card);
};

/* ---------- DELETE (SOFT) ---------- */
export const deleteEnrollCard = async (req: Request, res: Response) => {
  const card = await EnrollCard.findByPk(req.params.id);
  if (!card) return res.status(404).json({ message: "Not found" });

  card.isActive = false;
  await card.save();

  res.json({ message: "Enroll card deleted" });
};
