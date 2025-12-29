import { Request, Response } from "express";
import { EnrollmentRequest } from "../models/EnrollmentRequest.model";

/* ---------- CREATE (Frontend) ---------- */
export const createEnrollmentRequest = async (req: Request, res: Response) => {
  const proofImage = req.file
    ? `/uploads/enrollment-proofs/${req.file.filename}`
    : "";

  const data = await EnrollmentRequest.create({
    ...req.body,
    proofImage,
  });

  res.json({ message: "Enrollment submitted", data });
};

/* ---------- GET ALL (Admin) ---------- */
export const getAllEnrollmentRequests = async (_: Request, res: Response) => {
  const data = await EnrollmentRequest.findAll({
    order: [["createdAt", "DESC"]],
  });
  res.json(data);
};

/* ---------- UPDATE ---------- */
export const updateEnrollmentRequest = async (req: Request, res: Response) => {
  const data = await EnrollmentRequest.findByPk(req.params.id);
  if (!data) return res.status(404).json({ message: "Not found" });

  await data.update(req.body);
  res.json(data);
};

/* ---------- DELETE ---------- */
export const deleteEnrollmentRequest = async (req: Request, res: Response) => {
  const data = await EnrollmentRequest.findByPk(req.params.id);
  if (!data) return res.status(404).json({ message: "Not found" });

  await data.destroy();
  res.json({ message: "Deleted" });
};
