import { Request, Response } from "express";
import { StudentSuccess } from "../models/StudentSuccess.model";

/* ---------- GET ---------- */
export const getStudentSuccess = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId ?? 0);
    const courseId = Number(req.query.courseId ?? 0);

    let where: any = { isActive: true };

    if (domainId > 0) where.domainId = domainId;
    if (courseId > 0) where.courseId = courseId;

    let data = await StudentSuccess.findAll({
      where,
      order: domainId === 0 && courseId === 0
        ? [["id", "DESC"]]
        : [["id", "ASC"]],
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch student success stories" });
  }
};

/* ---------- CREATE ---------- */
export const createStudentSuccess = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const record = await StudentSuccess.create({
      ...req.body,
      image: `/uploads/studentsucess/${req.file.filename}`,
    });

    res.status(201).json(record);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};


/* ---------- UPDATE ---------- */
export const updateStudentSuccess = async (req: Request, res: Response) => {
  try {
    const record = await StudentSuccess.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: "Not found" });

    const data: any = { ...req.body };
    if (req.file) data.image = `/uploads/studentsucess/${req.file.filename}`;

    await record.update(data);
    res.json(record);
  } catch {
    res.status(400).json({ message: "Update failed" });
  }
};

/* ---------- DELETE ---------- */
export const deleteStudentSuccess = async (req: Request, res: Response) => {
  try {
    const record = await StudentSuccess.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: "Not found" });

    await record.destroy();
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(400).json({ message: "Delete failed" });
  }
};


export const getAllStudentSuccess = async (_req: Request, res: Response) => {
  try {
    const data = await StudentSuccess.findAll({
      order: [["id", "DESC"]],
    });
    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch all student success" });
  }
};
