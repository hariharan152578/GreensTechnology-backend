import { Request, Response } from "express";
import { Course } from "../models/Course.model";

/* ---------- GET COURSES (Frontend) ---------- */
export const getCourses = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);

    let courses = await Course.findAll({
      where: { domainId, isActive: true },
      order: [["id", "ASC"]],
    });

    // fallback → landing
    if (!courses.length && domainId > 0) {
      courses = await Course.findAll({
        where: { domainId: 0, isActive: true },
        order: [["id", "ASC"]],
      });
    }

    res.json(courses);
  } catch {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

/* ---------- CREATE COURSE (WITH IMAGE) ---------- */
export const createCourse = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Course image is required" });
    }

    const course = await Course.create({
      domainId: Number(req.body.domainId),
      title: req.body.title,
      description: req.body.description,
      image: `/uploads/courses/${file.filename}`,
      price: req.body.price,
      duration: req.body.duration,
      isActive: req.body.isActive ?? true,
    });

    res.status(201).json(course);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to create course",
      error: error.message,
    });
  }
};

/* ---------- UPDATE COURSE (OPTIONAL IMAGE) ---------- */
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const file = req.file;

    await course.update({
      domainId: req.body.domainId ?? course.domainId,
      title: req.body.title ?? course.title,
      description: req.body.description ?? course.description,
      image: file
        ? `/uploads/courses/${file.filename}`
        : course.image,
      price: req.body.price ?? course.price,
      duration: req.body.duration ?? course.duration,
      isActive: req.body.isActive ?? course.isActive,
    });

    res.json(course);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to update course",
      error: error.message,
    });
  }
};

/* ---------- DELETE COURSE ---------- */
export const deleteCourse = async (req: Request, res: Response) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  await course.destroy();
  res.json({ message: "Course deleted successfully" });
};
