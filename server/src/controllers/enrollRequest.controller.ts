import { Request, Response } from "express";
import { EnrollRequest } from "../models/EnrollRequest.model";

export const createEnrollRequest = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, course, domainId, courseId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Proof image required" });
    }

    const request = await EnrollRequest.create({
      name,
      email,
      phone,
      course,
      domainId: Number(domainId),
      courseId: Number(courseId),
      proofImage: `/uploads/enroll/${req.file.filename}`,
    });

    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Enrollment failed" });
  }
};

export const getEnrollRequests = async (_req: Request, res: Response) => {
  const requests = await EnrollRequest.findAll({
    order: [["createdAt", "DESC"]],
  });
  res.json(requests);
};
