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

/* ---------- GET ALL (Admin) ---------- */
export const getEnrollCardsAdmin = async (req: Request, res: Response) => {
  try {
    const cards = await EnrollCard.findAll({
      order: [
        ["domainId", "ASC"],
        ["courseId", "ASC"],
        ["order", "ASC"],
      ],
    });
    res.json(cards);
  } catch (error) {
    console.error("Error fetching enroll cards for admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- CREATE ---------- */
export const createEnrollCard = async (req: Request, res: Response) => {
  try {
    const image = req.file
      ? `/uploads/enroll-cards/${req.file.filename}`
      : "";

    // Validate required fields
    if (!req.body.title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Parse numeric fields
    const domainId = Number(req.body.domainId || 0);
    const courseId = Number(req.body.courseId || 0);
    const order = Number(req.body.order || 0);
    const isActive = req.body.isActive === "true" || req.body.isActive === true;

    const card = await EnrollCard.create({
      domainId,
      courseId,
      title: req.body.title,
      image,
      order,
      isActive,
    });

    res.status(201).json(card);
  } catch (error) {
    console.error("Error creating enroll card:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- UPDATE ---------- */
export const updateEnrollCard = async (req: Request, res: Response) => {
  try {
    const card = await EnrollCard.findByPk(req.params.id);
    if (!card) return res.status(404).json({ message: "Not found" });

    // Update image if new file is uploaded
    if (req.file) {
      card. imageUrl = `/uploads/enroll-cards/${req.file.filename}`;
    }

    // Parse numeric fields
    const updateData: any = {};
    if (req.body.domainId !== undefined) updateData.domainId = Number(req.body.domainId);
    if (req.body.courseId !== undefined) updateData.courseId = Number(req.body.courseId);
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.order !== undefined) updateData.order = Number(req.body.order);
    if (req.body.isActive !== undefined) {
      updateData.isActive = req.body.isActive === "true" || req.body.isActive === true;
    }

    // Handle image removal if requested
    if (req.body.removeImage === "true") {
      updateData.image = "";
    }

    await card.update(updateData);
    res.json(card);
  } catch (error) {
    console.error("Error updating enroll card:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- UPDATE ORDER ---------- */
export const updateEnrollCardOrder = async (req: Request, res: Response) => {
  try {
    const { cards } = req.body;

    if (!Array.isArray(cards)) {
      return res.status(400).json({ message: "Invalid request format" });
    }

    // Validate each card has required fields
    for (const cardData of cards) {
      if (!cardData.id || cardData.order === undefined) {
        return res.status(400).json({ 
          message: "Each card must have id and order properties" 
        });
      }
    }

    // Update each card's order
    const updatePromises = cards.map((cardData) =>
      EnrollCard.update(
        { order: cardData.order },
        { where: { id: cardData.id } }
      )
    );

    await Promise.all(updatePromises);
    
    res.json({ 
      success: true, 
      message: "Order updated successfully" 
    });
  } catch (error) {
    console.error("Error updating card order:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error updating order" 
    });
  }
};

/* ---------- DELETE (SOFT) ---------- */
export const deleteEnrollCard = async (req: Request, res: Response) => {
  try {
    const card = await EnrollCard.findByPk(req.params.id);
    if (!card) return res.status(404).json({ message: "Not found" });

    card.isActive = false;
    await card.save();

    res.json({ 
      success: true,
      message: "Enroll card deleted" 
    });
  } catch (error) {
    console.error("Error deleting enroll card:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

/* ---------- HARD DELETE (Optional) ---------- */
export const hardDeleteEnrollCard = async (req: Request, res: Response) => {
  try {
    const card = await EnrollCard.findByPk(req.params.id);
    if (!card) return res.status(404).json({ message: "Not found" });

    await card.destroy();
    
    res.json({ 
      success: true,
      message: "Enroll card permanently deleted" 
    });
  } catch (error) {
    console.error("Error hard deleting enroll card:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};