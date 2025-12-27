// src/controllers/project.controller.ts
import { Request, Response } from "express";
import { Project } from "../models/Project.model";
import { ProjectTech } from "../models/ProjectTech.model";

/* ================= FRONTEND ================= */
export const getProjects = async (req: Request, res: Response) => {
  const domainId = Number(req.query.domainId || 0);
  const courseId = Number(req.query.courseId || 0);

  let projects = await Project.findAll({
    where: { domainId, courseId, isActive: true },
    include: [{ model: ProjectTech, where: { isActive: true }, required: false }],
    order: [["order", "ASC"]],
  });

  if (!projects.length && courseId > 0) {
    projects = await Project.findAll({
      where: { domainId, courseId: 0, isActive: true },
      include: [{ model: ProjectTech, where: { isActive: true }, required: false }],
      order: [["order", "ASC"]],
    });
  }

  res.json(projects);
};

/* ================= ADMIN ================= */
export const createProject = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Project image required" });
    }

    const project = await Project.create({
      domainId: req.body.domainId,
      courseId: req.body.courseId,
      title: req.body.title,
      description: req.body.description,
      order: req.body.order ?? 0,
      imageUrl: `/uploads/projects/${req.file.filename}`,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("PROJECT CREATE ERROR:", error);
    res.status(500).json({ message: "Project creation failed" });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ message: "Not found" });

  await project.update(req.body);
  res.json(project);
};

export const deleteProject = async (req: Request, res: Response) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ message: "Not found" });

  await project.destroy();
  res.json({ message: "Deleted" });
};

/* ================= TECH ================= */
export const addProjectTech = async (req: Request, res: Response) => {
  const tech = await ProjectTech.create(req.body);
  res.status(201).json(tech);
};
