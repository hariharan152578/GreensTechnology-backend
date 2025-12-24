import { Request, Response } from "express";
import { EnrollCard } from "../models/EnrollCard.model";

export const createEnrollCards = async (req: Request, res: Response) => {
  const { enrollSectionId, title } = req.body;

  const files = req.files as Express.Multer.File[];

  if (!files?.length) {
    return res.status(400).json({ message: "Images required" });
  }

  const cards = await Promise.all(
    files.map((file, index) =>
      EnrollCard.create({
        enrollSectionId,
        title,
        order: index,
        imageUrl: `/uploads/enroll/${file.filename}`,
      })
    )
  );

  res.status(201).json(cards);
};
