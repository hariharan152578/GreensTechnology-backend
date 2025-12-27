import { Request, Response } from "express";
import { EnrollCard } from "../models/EnrollCard.model";

/* =====================================================
   CREATE (MULTIPLE IMAGES)
===================================================== */
export const createEnrollCards = async (req: Request, res: Response) => {
  try {
    const enrollSectionId = Number(req.body.enrollSectionId);
    const title = req.body.title;

    if (!enrollSectionId || !title) {
      return res.status(400).json({
        message: "enrollSectionId and title are required",
      });
    }

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Images required" });
    }

    const cards = await Promise.all(
      files.map((file, index) =>
        EnrollCard.create({
          enrollSectionId,
          title,
          order: index,
          imageUrl: `/uploads/enroll/${file.filename}`,
          isActive: true,
        })
      )
    );

    res.status(201).json(cards);
  } catch (error) {
    console.error("Enroll card create error:", error);
    res.status(500).json({
      message: "Failed to create enroll cards",
      error: String(error),
    });
  }
};

/* =====================================================
   READ (BY SECTION)
===================================================== */
export const getEnrollCards = async (req: Request, res: Response) => {
  try {
    const enrollSectionId = Number(req.query.enrollSectionId);

    if (!enrollSectionId) {
      return res.status(400).json({
        message: "enrollSectionId query param required",
      });
    }

    const cards = await EnrollCard.findAll({
      where: {
        enrollSectionId,
        isActive: true,
      },
      order: [["order", "ASC"]],
    });

    res.json(cards);
  } catch (error) {
    console.error("Enroll card fetch error:", error);
    res.status(500).json({
      message: "Failed to fetch enroll cards",
    });
  }
};

/* =====================================================
   UPDATE (TEXT + OPTIONAL IMAGE)
===================================================== */
export const updateEnrollCard = async (req: Request, res: Response) => {
  try {
    const card = await EnrollCard.findByPk(req.params.id);

    if (!card) {
      return res.status(404).json({ message: "Enroll card not found" });
    }

    const { title, order, isActive } = req.body;

    let imageUrl = card.imageUrl;

    if (req.file) {
      imageUrl = `/uploads/enroll/${req.file.filename}`;
    }

    await card.update({
      title: title ?? card.title,
      order: order ?? card.order,
      isActive: isActive ?? card.isActive,
      imageUrl,
    });

    res.json(card);
  } catch (error) {
    console.error("Enroll card update error:", error);
    res.status(500).json({
      message: "Failed to update enroll card",
    });
  }
};

/* =====================================================
   SOFT DELETE
===================================================== */
export const deleteEnrollCard = async (req: Request, res: Response) => {
  try {
    const card = await EnrollCard.findByPk(req.params.id);

    if (!card) {
      return res.status(404).json({ message: "Enroll card not found" });
    }

    await card.update({ isActive: false });

    res.json({ message: "Enroll card soft-deleted" });
  } catch (error) {
    console.error("Enroll card delete error:", error);
    res.status(500).json({
      message: "Failed to delete enroll card",
    });
  }
};

/* =====================================================
   HARD DELETE
===================================================== */
export const hardDeleteEnrollCard = async (req: Request, res: Response) => {
  try {
    const card = await EnrollCard.findByPk(req.params.id);

    if (!card) {
      return res.status(404).json({ message: "Enroll card not found" });
    }

    await card.destroy();

    res.json({ message: "Enroll card permanently deleted" });
  } catch (error) {
    console.error("Enroll card hard delete error:", error);
    res.status(500).json({
      message: "Failed to hard delete enroll card",
    });
  }
};
