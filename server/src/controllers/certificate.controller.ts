import { Request, Response } from "express";
import { Certificate } from "../models/Certificate.model";

/* ---------- GET (Frontend) ---------- */
export const getCertificate = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let certificate = await Certificate.findOne({
      where: { domainId, courseId, isActive: true },
    });

    if (!certificate && domainId > 0 && courseId > 0) {
      certificate = await Certificate.findOne({
        where: { domainId, courseId: 0, isActive: true },
      });
    }

    if (!certificate) {
      certificate = await Certificate.findOne({
        where: { domainId: 0, courseId: 0, isActive: true },
      });
    }

    if (!certificate) {
      return res.status(404).json({ message: "Certificate data not found" });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch certificate data" });
  }
};

/* ---------- CREATE (WITH IMAGE) ---------- */
export const createCertificate = async (req: Request, res: Response) => {
  try {
    const {
      domainId,
      courseId,
      sectionTitle,
      steps,
      isActive,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Certificate image required" });
    }

    const certificate = await Certificate.create({
      domainId,
      courseId,
      sectionTitle,
      steps: JSON.parse(steps), // 🔥 IMPORTANT
      certificateImage: `/uploads/certificates/${req.file.filename}`,
      isActive: isActive ?? true,
    });

    res.status(201).json(certificate);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to create certificate" });
  }
};

/* ---------- UPDATE (OPTIONAL IMAGE) ---------- */
export const updateCertificate = async (req: Request, res: Response) => {
  try {
    const certificate = await Certificate.findByPk(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    const updates: any = { ...req.body };

    if (req.body.steps) {
      updates.steps = JSON.parse(req.body.steps);
    }

    if (req.file) {
      updates.certificateImage = `/uploads/certificates/${req.file.filename}`;
    }

    await certificate.update(updates);
    res.json(certificate);
  } catch (error) {
    res.status(400).json({ message: "Failed to update certificate" });
  }
};

/* ---------- DELETE ---------- */
export const deleteCertificate = async (req: Request, res: Response) => {
  try {
    const certificate = await Certificate.findByPk(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    await certificate.destroy();
    res.json({ message: "Certificate deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete certificate" });
  }
};
