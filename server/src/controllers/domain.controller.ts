import { Request, Response } from "express";
import { Domain } from "../models/Domain.model";

/* ---------- GET ALL DOMAINS ---------- */
export const getDomains = async (_req: Request, res: Response) => {
  try {
    const domains = await Domain.findAll({
      where: { isActive: true },
      order: [["id", "ASC"]],
    });
    res.json(domains);
  } catch {
    res.status(500).json({ message: "Failed to fetch domains" });
  }
};

/* ---------- GET SINGLE DOMAIN ---------- */
export const getDomainById = async (req: Request, res: Response) => {
  const domain = await Domain.findByPk(req.params.id);
  if (!domain) {
    return res.status(404).json({ message: "Domain not found" });
  }
  res.json(domain);
};

/* ---------- CREATE DOMAIN (WITH IMAGES) ---------- */
export const createDomain = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;
    const mainImage = files?.["mainImage"]?.[0];
    const smallImage = files?.["smallImage"]?.[0];

    if (!mainImage || !smallImage) {
      return res.status(400).json({ message: "Images are required" });
    }

    const domain = await Domain.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      domain: req.body.domain,
      title: req.body.title,
      subtitle: req.body.subtitle,
      price: req.body.price,
      description: req.body.description,
      mainImageUrl: `/uploads/domains/${mainImage.filename}`,
      smallImageUrl: `/uploads/domains/${smallImage.filename}`,
      isActive: req.body.isActive ?? true,
    });

    res.status(201).json(domain);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


/* ---------- UPDATE DOMAIN (WITH OPTIONAL IMAGE UPDATE) ---------- */
export const updateDomain = async (req: Request, res: Response) => {
  try {
    const domain = await Domain.findByPk(req.params.id);
    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }

    const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;
    const mainImage = files?.["mainImage"]?.[0];
    const smallImage = files?.["smallImage"]?.[0];

    await domain.update({
      domainId: req.body.domainId ?? domain.domainId,
      courseId: req.body.courseId ?? domain.courseId,
      domain: req.body.domain ?? domain.domain,
      title: req.body.title ?? domain.title,
      subtitle: req.body.subtitle ?? domain.subtitle,
      price: req.body.price ?? domain.price,
      description: req.body.description ?? domain.description,
      mainImageUrl: mainImage
        ? `/uploads/domains/${mainImage.filename}`
        : domain.mainImageUrl,
      smallImageUrl: smallImage
        ? `/uploads/domains/${smallImage.filename}`
        : domain.smallImageUrl,
      isActive: req.body.isActive ?? domain.isActive,
    });

    res.json(domain);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


/* ---------- DELETE DOMAIN ---------- */
export const deleteDomain = async (req: Request, res: Response) => {
  const domain = await Domain.findByPk(req.params.id);
  if (!domain) {
    return res.status(404).json({ message: "Domain not found" });
  }

  await domain.destroy();
  res.json({ message: "Domain deleted successfully" });
};
