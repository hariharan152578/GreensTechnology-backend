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

    // fallback → domain level
    if (!certificate && domainId > 0 && courseId > 0) {
      certificate = await Certificate.findOne({
        where: { domainId, courseId: 0, isActive: true },
      });
    }

    // fallback → landing
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

/* ---------- CREATE ---------- */
export const createCertificate = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    const certificate = await Certificate.create({
      ...req.body,
      steps: JSON.parse(req.body.steps),
      certificateImage: file
        ? `/uploads/certificates/${file.filename}`
        : null,
    });

    res.status(201).json(certificate);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to create certificate" });
  }
};


/* ---------- UPDATE ---------- */
export const updateCertificate = async (req: Request, res: Response) => {
  try {
    const certificate = await Certificate.findByPk(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    const file = req.file;

    await certificate.update({
      ...req.body,
      ...(req.body.steps && { steps: JSON.parse(req.body.steps) }),
      ...(file && {
        certificateImage: `/uploads/certificates/${file.filename}`,
      }),
    });

    res.json(certificate);
  } catch (error) {
    console.error(error);
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


export const getAllCertificates = async (req: Request, res: Response) => {
  try {
    const certificates = await Certificate.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(certificates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch certificates" });
  }
};


