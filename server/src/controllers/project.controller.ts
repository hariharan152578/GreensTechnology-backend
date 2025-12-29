// controllers/project.controller.ts
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Project } from "../models/Project.model";
import { ProjectTech } from "../models/ProjectTech.model";

/* ---------- PUBLIC: Get all active projects ---------- */
export const getProjects = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let projects = await Project.findAll({
      where: { domainId, courseId, isActive: true },
      include: [
        { model: ProjectTech, where: { isActive: true }, required: false },
      ],
      order: [["order", "ASC"]],
    });

    // fallback → domain level
    if (!projects.length && courseId > 0) {
      projects = await Project.findAll({
        where: { domainId, courseId: 0, isActive: true },
        include: [
          { model: ProjectTech, where: { isActive: true }, required: false },
        ],
        order: [["order", "ASC"]],
      });
    }

    res.json(projects);
  } catch (error: any) {
    console.error("PROJECT FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

/* ---------- ADMIN: Get ALL projects (including inactive) ---------- */
export const getAllProjectsForAdmin = async (_req: Request, res: Response) => {
  try {
    const projects = await Project.findAll({
      include: [
        { model: ProjectTech, required: false },
      ],
      order: [["order", "ASC"]],
    });
    console.log(`Found ${projects.length} projects for admin`);
    res.json(projects);
  } catch (error: any) {
    console.error("Error fetching all projects:", error);
    res.status(500).json({ message: "Failed to fetch all projects" });
  }
};

/* ---------- GET PROJECT BY ID ---------- */
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [{ model: ProjectTech, required: false }],
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error: any) {
    console.error("Error fetching project by ID:", error);
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

/* ---------- CREATE PROJECT ---------- */
export const createProject = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Project thumbnail required" });
    }

    const project = await Project.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      title: req.body.title,
      description: req.body.description,
      order: Number(req.body.order || 0),
      imageUrl: `/uploads/projects/${req.file.filename}`,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    });

    res.status(201).json({
      message: "Project created successfully",
      project
    });
  } catch (error: any) {
    console.error("PROJECT CREATE ERROR:", error);
    res.status(400).json({ 
      message: "Project creation failed",
      error: error.message 
    });
  }
};

/* ---------- UPDATE PROJECT ---------- */
export const updateProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Handle image update
    let updatedImageUrl = project.imageUrl;
    
    if (req.file) {
      // Delete old image
      const oldFilename = project.imageUrl.split('/').pop();
      if (oldFilename) {
        const oldPath = path.join('uploads/projects', oldFilename);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updatedImageUrl = `/uploads/projects/${req.file.filename}`;
    }

    await project.update({
      domainId: req.body.domainId !== undefined ? Number(req.body.domainId) : project.domainId,
      courseId: req.body.courseId !== undefined ? Number(req.body.courseId) : project.courseId,
      title: req.body.title || project.title,
      description: req.body.description || project.description,
      order: req.body.order !== undefined ? Number(req.body.order) : project.order,
      imageUrl: updatedImageUrl,
      isActive: req.body.isActive !== undefined 
        ? (req.body.isActive === 'true' || req.body.isActive === true) 
        : project.isActive,
    });

    const updatedProject = await Project.findByPk(req.params.id, {
      include: [{ model: ProjectTech, required: false }],
    });
    
    res.json({
      message: "Project updated successfully",
      project: updatedProject
    });
  } catch (error: any) {
    console.error("PROJECT UPDATE ERROR:", error);
    res.status(400).json({ 
      message: "Project update failed",
      error: error.message 
    });
  }
};

/* ---------- DELETE PROJECT PERMANENTLY ---------- */
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete thumbnail from disk
    const filename = project.imageUrl.split('/').pop();
    if (filename) {
      const filePath = path.join('uploads/projects', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await project.destroy();
    
    res.json({ 
      message: "Project deleted permanently",
      success: true
    });
  } catch (error: any) {
    console.error("PROJECT DELETE ERROR:", error);
    res.status(400).json({ 
      message: "Project deletion failed",
      error: error.message
    });
  }
};

/* ---------- ADD PROJECT TECH ---------- */
export const addProjectTech = async (req: Request, res: Response) => {
  try {
    const tech = await ProjectTech.create({
      projectId: Number(req.body.projectId),
      name: req.body.name,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    });

    res.status(201).json(tech);
  } catch (error: any) {
    console.error("PROJECT TECH ERROR:", error);
    res.status(400).json({ 
      message: "Failed to add project tech",
      error: error.message 
    });
  }
};