import { Request, Response } from "express";
import { Domain } from "../models/Domain.model";

/* ---------- GET ALL DOMAINS (Frontend) ---------- */
export const getDomains = async (req: Request, res: Response) => {
  try {
    const domains = await Domain.findAll({
      where: { isActive: true },
      order: [["id", "ASC"]],
    });

    res.json(domains);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch domains" });
  }
};

/* ---------- GET SINGLE DOMAIN ---------- */
export const getDomainById = async (req: Request, res: Response) => {
  try {
    const domain = await Domain.findByPk(req.params.id);

    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }

    res.json(domain);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch domain" });
  }
};

/* ---------- CREATE DOMAIN ---------- */
export const createDomain = async (req: Request, res: Response) => {
  try {
    const domain = await Domain.create(req.body);
    res.status(201).json(domain);
  } catch (error) {
    res.status(400).json({ message: "Failed to create domain" });
  }
};

/* ---------- UPDATE DOMAIN ---------- */
export const updateDomain = async (req: Request, res: Response) => {
  try {
    const domain = await Domain.findByPk(req.params.id);
    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }

    await domain.update(req.body);
    res.json(domain);
  } catch (error) {
    res.status(400).json({ message: "Failed to update domain" });
  }
};

/* ---------- DELETE DOMAIN ---------- */
export const deleteDomain = async (req: Request, res: Response) => {
  try {
    const domain = await Domain.findByPk(req.params.id);
    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }

    await domain.destroy();
    res.json({ message: "Domain deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete domain" });
  }
};
