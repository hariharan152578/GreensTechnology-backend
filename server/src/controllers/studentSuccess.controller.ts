import { Request, Response } from "express";
import { StudentSuccess } from "../models/StudentSuccess.model";
import fs from "fs";

/* ===========================
   GET (Frontend)
=========================== */
export const getStudentSuccess = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId ?? 0);
    const courseId = Number(req.query.courseId ?? 0);

    const where: any = { isActive: true };

    if (domainId > 0) where.domainId = domainId;
    if (courseId > 0) where.courseId = courseId;

    const data = await StudentSuccess.findAll({
      where,
      order: [["id", "DESC"]],
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch student success" });
  }
};

/* ===========================
   CREATE (Admin)
=========================== */
export const createStudentSuccess = async (req: Request, res: Response) => {
  try {
    const imagePath = req.file
      ? `/uploads/student-success/${req.file.filename}`
      : null;

    const student = await StudentSuccess.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      name: req.body.name,
      course: req.body.course,
      rating: Number(req.body.rating),
      review: req.body.review,
      placement: req.body.placement,
      duration: req.body.duration,
      image: imagePath,
    });

    res.status(201).json(student);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to create student success",
      error: error.message,
    });
  }
};

/* ===========================
   DELETE (Admin)
=========================== */
export const deleteStudentSuccess = async (req: Request, res: Response) => {
  try {
    const record = await StudentSuccess.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Delete image from disk
    if (record.image) {
      const diskPath = record.image.replace("/uploads/", "uploads/");
      if (fs.existsSync(diskPath)) {
        fs.unlinkSync(diskPath);
      }
    }

    await record.destroy();
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(400).json({ message: "Failed to delete student success" });
  }
};
