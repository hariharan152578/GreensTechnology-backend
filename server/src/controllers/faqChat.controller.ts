import { Request, Response } from "express";
import { FaqChat } from "../models/FaqChat.model";

/* ----------------------------------
   GET FAQ by step (Frontend)
----------------------------------- */
export const getFaqByStep = async (req: Request, res: Response) => {
  try {
    const step = Number(req.query.step || 0);

    const faqs = await FaqChat.findAll({
      where: { step, isActive: true },
      order: [["id", "ASC"]],
    });

    res.json(faqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
};

/* ----------------------------------
   CREATE FAQ (Admin)
----------------------------------- */
export const createFaq = async (req: Request, res: Response) => {
  try {
    const { step, question, answer } = req.body;

    const faq = await FaqChat.create({
      step,
      question,
      answer,
    });

    res.status(201).json(faq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create FAQ" });
  }
};

/* ----------------------------------
   UPDATE FAQ (Admin)
----------------------------------- */
export const updateFaq = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await FaqChat.update(req.body, {
      where: { id },
    });

    res.json({ message: "FAQ updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update FAQ" });
  }
};

/* ----------------------------------
   DELETE FAQ (Soft Delete)
----------------------------------- */
export const deleteFaq = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await FaqChat.update(
      { isActive: false },
      { where: { id } }
    );

    res.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete FAQ" });
  }
};
