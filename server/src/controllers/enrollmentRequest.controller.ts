import { Request, Response } from "express";
import { EnrollmentRequest } from "../models/EnrollmentRequest.model";
import { Domain } from "../models/Domain.model";
import { Course } from "../models/Course.model";

export const createEnrollmentRequest = async (req: Request, res: Response) => {
  try {
    // 1. Destructure with aliases if necessary to ensure no confusion
    const { 
      domainId: rawDomainId, 
      courseId: rawCourseId, 
      name: userName, 
      email: userEmail, 
      phone: userPhone 
    } = req.body;

    // 2. Validate existence of related records
    const domainRecord = await Domain.findByPk(rawDomainId);
    const courseRecord = await Course.findByPk(rawCourseId);

    if (!domainRecord || !courseRecord) {
      return res.status(400).json({ message: "Invalid Domain or Course selection" });
    }

    // 3. Handle File safely
    const uploadedFilePath = req.file
      ? `/uploads/enrollment-proofs/${req.file.filename}`
      : "";

    // 4. Create record with EXPLICIT mapping
    const enrollment = await EnrollmentRequest.create({
      domainId: Number(rawDomainId),
      domain: domainRecord.domain,   // Stores the string name
      courseId: Number(rawCourseId),
      course: courseRecord.title,    // Stores the string title
      name: userName,                // Maps to 'user_full_name' in DB
      email: userEmail,              // Maps to 'user_email' in DB
      phone: userPhone,
      proofImage: uploadedFilePath,
      status: "pending"
    });

    res.status(201).json({
      message: "Enrollment submitted successfully",
      enrollmentId: enrollment.id,
    });

  } catch (error) {
    console.error("CRITICAL ENROLLMENT ERROR:", error);
    res.status(500).json({ message: "Server encountered an error processing enrollment" });
  }
};
/* ---------- GET ALL (ADMIN) ---------- */
export const getAllEnrollmentRequests = async (_req: Request, res: Response) => {
  const data = await EnrollmentRequest.findAll({
    order: [["createdAt", "DESC"]],
  });
  res.json(data);
};

/* ---------- UPDATE STATUS ---------- */
export const updateEnrollmentRequest = async (req: Request, res: Response) => {
  const enrollment = await EnrollmentRequest.findByPk(req.params.id);
  if (!enrollment) {
    return res.status(404).json({ message: "Enrollment not found" });
  }

  await enrollment.update(req.body);
  res.json(enrollment);
};

/* ---------- DELETE ---------- */
export const deleteEnrollmentRequest = async (req: Request, res: Response) => {
  const enrollment = await EnrollmentRequest.findByPk(req.params.id);
  if (!enrollment) {
    return res.status(404).json({ message: "Enrollment not found" });
  }

  await enrollment.destroy();
  res.json({ message: "Enrollment deleted" });
};
