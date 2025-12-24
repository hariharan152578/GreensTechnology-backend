import { Request, Response } from "express";
import { EnrollRequest } from "../models/EnrollRequest.model";

export const createEnrollRequest = async (req: Request, res: Response) => {
  const { name, email, phone, course, domainId, courseId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Proof image required" });
  }

  const request = await EnrollRequest.create({
    name,
    email,
    phone,
    course,
    domainId,
    courseId,
    proofImage: `/uploads/enroll/${req.file.filename}`,
  });

  res.status(201).json(request);
};
