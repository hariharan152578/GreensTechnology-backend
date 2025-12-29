import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Project } from "../models/Project.model";
import { ProjectTech } from "../models/ProjectTech.model";

/* =====================================================
   📌 FRONTEND – GET PROJECTS
===================================================== */
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
  } catch (error) {
    console.error("PROJECT FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

/* =====================================================
   🟢 CREATE PROJECT (WITH THUMBNAIL)
===================================================== */
export const createProject = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Project thumbnail required" });
    }

    const project = await Project.create({
      domainId: Number(req.body.domainId),
      courseId: Number(req.body.courseId),
      title: req.body.title,
      description: req.body.description,
      order: Number(req.body.order || 0),
      imageUrl: `/uploads/projects/${req.file.filename}`,
      isActive: true,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("PROJECT CREATE ERROR:", error);
    res.status(500).json({ message: "Project creation failed" });
  }
};

/* =====================================================
   🟡 UPDATE PROJECT (OPTIONAL IMAGE)
===================================================== */
export const updateProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const data: any = {
      title: req.body.title ?? project.title,
      description: req.body.description ?? project.description,
      order: req.body.order ?? project.order,
      isActive: req.body.isActive ?? project.isActive,
    };

    // 🔥 Replace image if new file uploaded
    if (req.file) {
      // delete old image
      if (project.imageUrl) {
        const oldPath = path.join(process.cwd(), project.imageUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      data.imageUrl = `/uploads/projects/${req.file.filename}`;
    }

    await project.update(data);
    res.json(project);
  } catch (error) {
    console.error("PROJECT UPDATE ERROR:", error);
    res.status(500).json({ message: "Project update failed" });
  }
};

/* =====================================================
   🔴 DELETE PROJECT (WITH IMAGE CLEANUP)
===================================================== */
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🔥 Delete thumbnail from disk
    if (project.imageUrl) {
      const filePath = path.join(process.cwd(), project.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await project.destroy();
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("PROJECT DELETE ERROR:", error);
    res.status(500).json({ message: "Project deletion failed" });
  }
};

/* =====================================================
   🧩 PROJECT TECH (ADD)
===================================================== */
export const addProjectTech = async (req: Request, res: Response) => {
  try {
    const tech = await ProjectTech.create({
      projectId: Number(req.body.projectId),
      name: req.body.name,
      isActive: true,
    });

    res.status(201).json(tech);
  } catch (error) {
    console.error("PROJECT TECH ERROR:", error);
    res.status(400).json({ message: "Failed to add project tech" });
  }
};
