import { Request, Response } from 'express';
import  Notice  from '../model/Notice';

/**
 * @description Get all active notices (Used by the Marquee/Navbar)
 * @route GET /api/notices
 */
export const getActiveNotices = async (req: Request, res: Response): Promise<void> => {
  try {
    const notices = await Notice.findAll({
      where: { isActive: true },
      attributes: ['content'],
      order: [['createdAt', 'DESC']]
    });

    // Map to array of strings for the frontend marquee
    const noticeStrings = notices.map(n => n.content);
    res.status(200).json(noticeStrings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching active notices", error });
  }
};

/**
 * @description Get every notice (Active & Inactive) for Admin panel
 * @route GET /api/notices/admin
 */
export const getAllNotices = async (req: Request, res: Response): Promise<void> => {
  try {
    const notices = await Notice.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all notices", error });
  }
};

/**
 * @description Create a new notice
 * @route POST /api/notices
 */
export const createNotice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, isActive } = req.body;
    
    if (!content) {
      res.status(400).json({ message: "Content is required" });
      return;
    }

    const newNotice = await Notice.create({ content, isActive });
    res.status(201).json(newNotice);
  } catch (error) {
    res.status(500).json({ message: "Error creating notice", error });
  }
};

/**
 * @description Update an existing notice
 * @route PUT /api/notices/:id
 */
export const updateNotice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content, isActive } = req.body;

    const notice = await Notice.findByPk(id);

    if (!notice) {
      res.status(404).json({ message: "Notice not found" });
      return;
    }

    await notice.update({ content, isActive });
    res.status(200).json(notice);
  } catch (error) {
    res.status(500).json({ message: "Error updating notice", error });
  }
};

/**
 * @description Delete a notice
 * @route DELETE /api/notices/:id
 */
export const deleteNotice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const notice = await Notice.findByPk(id);

    if (!notice) {
      res.status(404).json({ message: "Notice not found" });
      return;
    }

    await notice.destroy();
    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notice", error });
  }
};