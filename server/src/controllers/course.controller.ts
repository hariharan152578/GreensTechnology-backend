// controllers/course.controller.ts
import { Request, Response } from "express";
import { Course } from "../models/Course.model";
import path from "path";
import fs from "fs";

/* ---------- PUBLIC: Get all active courses ---------- */
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
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

/* ---------- ADMIN: Get ALL courses (including inactive) ---------- */
export const getAllCoursesForAdmin = async (_req: Request, res: Response) => {
  try {
    const courses = await Course.findAll({
      order: [["id", "ASC"]],
    });
    console.log(`Found ${courses.length} courses for admin`);
    res.json(courses);
  } catch (error: any) {
    console.error("Error fetching all courses:", error);
    res.status(500).json({ message: "Failed to fetch all courses" });
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
      domainId: Number(req.body.domainId || 0),
      title: req.body.title,
      description: req.body.description,
      image: `/uploads/courses/${file.filename}`,
      price: req.body.price,
      duration: req.body.duration,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    });

    res.status(201).json({
      message: "Course created successfully",
      course
    });
  } catch (error: any) {
    console.error("Error creating course:", error);
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

    const file = req.file;

    // Handle image update
    let updatedImageUrl = course.image;
    
    if (file) {
      // Delete old image
      const oldFilename = course.image.split('/').pop();
      if (oldFilename) {
        const oldPath = path.join('uploads/courses', oldFilename);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updatedImageUrl = `/uploads/courses/${file.filename}`;
    }

    await course.update({
      domainId: req.body.domainId !== undefined ? Number(req.body.domainId) : course.domainId,
      title: req.body.title || course.title,
      description: req.body.description || course.description,
      image: updatedImageUrl,
      price: req.body.price || course.price,
      duration: req.body.duration || course.duration,
      isActive: req.body.isActive !== undefined 
        ? (req.body.isActive === 'true' || req.body.isActive === true) 
        : course.isActive,
    });

    const updatedCourse = await Course.findByPk(req.params.id);
    
    res.json({
      message: "Course updated successfully",
      course: updatedCourse
    });
  } catch (error: any) {
    console.error("Error updating course:", error);
    res.status(400).json({
      message: "Failed to update course",
      error: error.message,
    });
  }
};

/* ---------- DELETE COURSE PERMANENTLY ---------- */
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Delete associated image
    const filename = course.image.split('/').pop();
    if (filename) {
      const filePath = path.join('uploads/courses', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await course.destroy();
    
    res.json({ 
      message: "Course deleted permanently",
      success: true
    });
  } catch (error: any) {
    console.error("Error deleting course:", error);
    res.status(400).json({ 
      message: "Failed to delete course",
      error: error.message
    });
  }
};