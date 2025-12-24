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

    // 🔁 fallback → landing courses
    if (!courses.length && domainId > 0) {
      courses = await Course.findAll({
        where: { domainId: 0, isActive: true },
        order: [["id", "ASC"]],
      });
    }

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

/* ---------- CREATE COURSE ---------- */

export const createCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      message: "Failed to create course",
      error: error.message,
    });
  }
};

/* ---------- UPDATE COURSE ---------- */
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.update(req.body);
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: "Failed to update course" });
  }
};

/* ---------- DELETE COURSE ---------- */
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.destroy();
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete course" });
  }
};
