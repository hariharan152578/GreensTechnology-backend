import { Request, Response } from "express";
import { Enroll } from "../models/Enroll.model";
import { EnrollCard } from "../models/EnrollCard.model";

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


export const getEnrollCardsAdmin = async (req: Request, res: Response) => {
  const cards = await EnrollCard.findAll({
    order: [["domainId", "ASC"], ["courseId", "ASC"], ["order", "ASC"]],
  });
  res.json(cards);
};

export const updateEnrollCardOrder = async (req: Request, res: Response) => {
  const { cards } = req.body;
  
  try {
    for (const cardData of cards) {
      await EnrollCard.update(
        { order: cardData.order },
        { where: { id: cardData.id } }
      );
    }
    res.json({ success: true, message: "Order updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating order" });
  }
};