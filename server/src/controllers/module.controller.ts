import { Request, Response } from "express";
import { Module } from "../models/Module.model";
import { ModuleTopic } from "../models/ModuleTopic.model";

/* ---------- PUBLIC: Get modules with topics ---------- */
export const getModules = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let modules = await Module.findAll({
      where: { 
        domainId, 
        courseId, 
        isActive: true 
      },
      include: [{
        model: ModuleTopic,
        where: { isActive: true },
        required: false,
        order: [['order', 'ASC']]
      }],
      order: [['order', 'ASC']],
    });

    // Fallback to domain level
    if (!modules.length && courseId > 0) {
      modules = await Module.findAll({
        where: { 
          domainId, 
          courseId: 0, 
          isActive: true 
        },
        include: [{
          model: ModuleTopic,
          where: { isActive: true },
          required: false,
          order: [['order', 'ASC']]
        }],
        order: [['order', 'ASC']],
      });
    }

    res.json(modules);
  } catch (error: any) {
    console.error("MODULE FETCH ERROR:", error);
    res.status(500).json({ 
      message: "Failed to fetch modules", 
      error: error.message 
    });
  }
};

/* ---------- ADMIN: Get ALL modules (including inactive) ---------- */
export const getAllModulesForAdmin = async (req: Request, res: Response) => {
  try {
    const modules = await Module.findAll({
      include: [{
        model: ModuleTopic,
        required: false,
        order: [['order', 'ASC']]
      }],
      order: [
     
        ['id', 'ASC']
      ],
    });
    
    res.json(modules);
  } catch (error: any) {
    console.error("Error fetching all modules:", error);
    res.status(500).json({ 
      message: "Failed to fetch all modules", 
      error: error.message 
    });
  }
};

/* ---------- GET MODULE BY ID ---------- */
export const getModuleById = async (req: Request, res: Response) => {
  try {
    const module = await Module.findByPk(req.params.id, {
      include: [{
        model: ModuleTopic,
        required: false,
        order: [['order', 'ASC']]
      }]
    });
    
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    
    res.json(module);
  } catch (error: any) {
    console.error("Error fetching module by ID:", error);
    res.status(500).json({ 
      message: "Failed to fetch module", 
      error: error.message 
    });
  }
};

/* ---------- CREATE MODULE ---------- */
export const createModule = async (req: Request, res: Response) => {
  try {
    const { domainId, courseId, title, description, order, isActive } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: "Module title is required" });
    }

    const module = await Module.create({
      domainId: Number(domainId || 0),
      courseId: Number(courseId || 0),
      title: title.trim(),
      description: description ? description.trim() : null,
      order: Number(order || 0),
      isActive: isActive === undefined ? true : isActive,
    });

    res.status(201).json({
      message: "Module created successfully",
      module
    });
  } catch (error: any) {
    console.error("MODULE CREATE ERROR:", error);
    res.status(400).json({ 
      message: "Module creation failed", 
      error: error.message 
    });
  }
};

/* ---------- UPDATE MODULE ---------- */
export const updateModule = async (req: Request, res: Response) => {
  try {
    const module = await Module.findByPk(req.params.id);
    
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    await module.update({
      domainId: req.body.domainId !== undefined ? Number(req.body.domainId) : module.domainId,
      courseId: req.body.courseId !== undefined ? Number(req.body.courseId) : module.courseId,
      title: req.body.title !== undefined ? req.body.title.trim() : module.title,
      description: req.body.description !== undefined ? req.body.description.trim() : module.description,
      order: req.body.order !== undefined ? Number(req.body.order) : module.order,
      isActive: req.body.isActive !== undefined ? req.body.isActive : module.isActive,
    });

    res.json({
      message: "Module updated successfully",
      module
    });
  } catch (error: any) {
    console.error("MODULE UPDATE ERROR:", error);
    res.status(400).json({ 
      message: "Module update failed", 
      error: error.message 
    });
  }
};

/* ---------- DELETE MODULE ---------- */
export const deleteModule = async (req: Request, res: Response) => {
  try {
    const module = await Module.findByPk(req.params.id);
    
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    await module.destroy();
    
    res.json({ 
      message: "Module deleted successfully",
      success: true
    });
  } catch (error: any) {
    console.error("MODULE DELETE ERROR:", error);
    res.status(400).json({ 
      message: "Module deletion failed", 
      error: error.message 
    });
  }
};

/* ---------- TOPIC MANAGEMENT ---------- */

/* ---------- GET ALL TOPICS FOR ADMIN ---------- */
export const getAllTopicsForAdmin = async (req: Request, res: Response) => {
  try {
    const topics = await ModuleTopic.findAll({
      include: [{
        model: Module,
        attributes: ['id', 'title', 'domainId', 'courseId']
      }],
      order: [
        ['moduleId', 'ASC'],
        ['order', 'ASC'],
        ['id', 'ASC']
      ],
    });
    
    res.json(topics);
  } catch (error: any) {
    console.error("Error fetching all topics:", error);
    res.status(500).json({ 
      message: "Failed to fetch all topics", 
      error: error.message 
    });
  }
};

/* ---------- ADD MODULE TOPIC ---------- */
export const addModuleTopic = async (req: Request, res: Response) => {
  try {
    const { moduleId, title, description, order, isActive } = req.body;
    
    if (!moduleId) {
      return res.status(400).json({ message: "Module ID is required" });
    }
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: "Topic title is required" });
    }

    // Verify module exists
    const module = await Module.findByPk(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const topic = await ModuleTopic.create({
      moduleId: Number(moduleId),
      title: title.trim(),
      description: description ? description.trim() : null,
      order: Number(order || 0),
      isActive: isActive === undefined ? true : isActive,
    });

    res.status(201).json({
      message: "Topic added successfully",
      topic
    });
  } catch (error: any) {
    console.error("TOPIC CREATE ERROR:", error);
    res.status(400).json({ 
      message: "Topic creation failed", 
      error: error.message 
    });
  }
};

/* ---------- UPDATE MODULE TOPIC ---------- */
export const updateModuleTopic = async (req: Request, res: Response) => {
  try {
    const topic = await ModuleTopic.findByPk(req.params.id);
    
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    await topic.update({
      title: req.body.title !== undefined ? req.body.title.trim() : topic.title,
      description: req.body.description !== undefined ? req.body.description.trim() : topic.description,
      order: req.body.order !== undefined ? Number(req.body.order) : topic.order,
      isActive: req.body.isActive !== undefined ? req.body.isActive : topic.isActive,
    });

    res.json({
      message: "Topic updated successfully",
      topic
    });
  } catch (error: any) {
    console.error("TOPIC UPDATE ERROR:", error);
    res.status(400).json({ 
      message: "Topic update failed", 
      error: error.message 
    });
  }
};

/* ---------- DELETE MODULE TOPIC ---------- */
export const deleteModuleTopic = async (req: Request, res: Response) => {
  try {
    const topic = await ModuleTopic.findByPk(req.params.id);
    
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    await topic.destroy();
    
    res.json({ 
      message: "Topic deleted successfully",
      success: true
    });
  } catch (error: any) {
    console.error("TOPIC DELETE ERROR:", error);
    res.status(400).json({ 
      message: "Topic deletion failed", 
      error: error.message 
    });
  }
};

/* ---------- BULK UPDATE ORDERS ---------- */
export const updateModuleOrders = async (req: Request, res: Response) => {
  try {
    const { modules, topics } = req.body;
    
    if (modules && Array.isArray(modules)) {
      const modulePromises = modules.map(({ id, order }: { id: number; order: number }) =>
        Module.update({ order }, { where: { id } })
      );
      await Promise.all(modulePromises);
    }
    
    if (topics && Array.isArray(topics)) {
      const topicPromises = topics.map(({ id, order }: { id: number; order: number }) =>
        ModuleTopic.update({ order }, { where: { id } })
      );
      await Promise.all(topicPromises);
    }
    
    res.json({ 
      message: "Orders updated successfully",
      success: true
    });
  } catch (error: any) {
    console.error("ORDER UPDATE ERROR:", error);
    res.status(400).json({ 
      message: "Failed to update orders", 
      error: error.message 
    });
  }
};