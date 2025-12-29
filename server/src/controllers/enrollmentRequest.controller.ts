// import { Request, Response } from "express";
// import { EnrollmentRequest } from "../models/EnrollmentRequest.model";
// import { Domain } from "../models/Domain.model";
// import { Course } from "../models/Course.model";

// export const createEnrollmentRequest = async (req: Request, res: Response) => {
//   try {
//     // 1. Destructure with aliases if necessary to ensure no confusion
//     const { 
//       domainId: rawDomainId, 
//       courseId: rawCourseId, 
//       name: userName, 
//       email: userEmail, 
//       phone: userPhone 
//     } = req.body;

//     // 2. Validate existence of related records
//     const domainRecord = await Domain.findByPk(rawDomainId);
//     const courseRecord = await Course.findByPk(rawCourseId);

//     if (!domainRecord || !courseRecord) {
//       return res.status(400).json({ message: "Invalid Domain or Course selection" });
//     }

//     // 3. Handle File safely
//     const uploadedFilePath = req.file
//       ? `/uploads/enrollment-proofs/${req.file.filename}`
//       : "";

//     // 4. Create record with EXPLICIT mapping
//     const enrollment = await EnrollmentRequest.create({
//       domainId: Number(rawDomainId),
//       domain: domainRecord.domain,   // Stores the string name
//       courseId: Number(rawCourseId),
//       course: courseRecord.title,    // Stores the string title
//       name: userName,                // Maps to 'user_full_name' in DB
//       email: userEmail,              // Maps to 'user_email' in DB
//       phone: userPhone,
//       proofImage: uploadedFilePath,
//       status: "pending"
//     });

//     res.status(201).json({
//       message: "Enrollment submitted successfully",
//       enrollmentId: enrollment.id,
//     });

//   } catch (error) {
//     console.error("CRITICAL ENROLLMENT ERROR:", error);
//     res.status(500).json({ message: "Server encountered an error processing enrollment" });
//   }
// };
// /* ---------- GET ALL (ADMIN) ---------- */
// export const getAllEnrollmentRequests = async (_req: Request, res: Response) => {
//   const data = await EnrollmentRequest.findAll({
//     order: [["createdAt", "DESC"]],
//   });
//   res.json(data);
// };

// /* ---------- UPDATE STATUS ---------- */
// export const updateEnrollmentRequest = async (req: Request, res: Response) => {
//   const enrollment = await EnrollmentRequest.findByPk(req.params.id);
//   if (!enrollment) {
//     return res.status(404).json({ message: "Enrollment not found" });
//   }

//   await enrollment.update(req.body);
//   res.json(enrollment);
// };

// /* ---------- DELETE ---------- */
// export const deleteEnrollmentRequest = async (req: Request, res: Response) => {
//   const enrollment = await EnrollmentRequest.findByPk(req.params.id);
//   if (!enrollment) {
//     return res.status(404).json({ message: "Enrollment not found" });
//   }

//   await enrollment.destroy();
//   res.json({ message: "Enrollment deleted" });
// };

import { Request, Response } from "express";
import { EnrollmentRequest } from "../models/EnrollmentRequest.model";
import { Domain } from "../models/Domain.model";
import { Course } from "../models/Course.model";
import fs from 'fs';
import path from 'path';

/* ---------- CREATE (Frontend) ---------- */
export const createEnrollmentRequest = async (req: Request, res: Response) => {
  try {
    const { 
      domainId: rawDomainId, 
      courseId: rawCourseId, 
      name: userName, 
      email: userEmail, 
      phone: userPhone 
    } = req.body;

    const domainRecord = await Domain.findByPk(rawDomainId);
    const courseRecord = await Course.findByPk(rawCourseId);

    if (!domainRecord || !courseRecord) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid Domain or Course selection" 
      });
    }

    const uploadedFilePath = req.file
      ? `/uploads/enrollment-proofs/${req.file.filename}`
      : "";

    const enrollment = await EnrollmentRequest.create({
      domainId: Number(rawDomainId),
      domain: domainRecord.domain,
      courseId: Number(rawCourseId),
      course: courseRecord.title,
      name: userName,
      email: userEmail,
      phone: userPhone,
      proofImage: uploadedFilePath,
      status: "pending"
    });

    res.status(201).json({
      success: true,
      message: "Enrollment request submitted successfully",
      data: enrollment
    });

  } catch (error: any) {
    console.error("Error creating enrollment request:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Error submitting enrollment request", 
      error: error.message 
    });
  }
};

/* ---------- GET ALL (Admin) ---------- */
export const getAllEnrollmentRequests = async (req: Request, res: Response) => {
  try {
    const { 
      status, 
      domainId, 
      courseId,
      search,
      startDate,
      endDate 
    } = req.query;

    const whereCondition: any = {};

    if (status && status !== 'all') {
      whereCondition.status = status;
    }

    if (domainId && domainId !== 'all') {
      whereCondition.domainId = Number(domainId);
    }

    if (courseId && courseId !== 'all') {
      whereCondition.courseId = Number(courseId);
    }

    if (search) {
      whereCondition[Symbol.iterator] = () => ({
        next() {
          return { done: true };
        }
      });
    }

    let data = await EnrollmentRequest.findAll({
      where: Object.keys(whereCondition).length > 0 ? whereCondition : undefined,
      order: [["createdAt", "DESC"]],
    });

    // Apply search filter
    if (search) {
      const searchTerm = search.toString().toLowerCase();
      data = data.filter(item =>
        item.name?.toLowerCase().includes(searchTerm) ||
        item.email?.toLowerCase().includes(searchTerm) ||
        item.phone?.toLowerCase().includes(searchTerm) ||
        item.course?.toLowerCase().includes(searchTerm) ||
        item.domain?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply date filter
    if (startDate || endDate) {
      data = data.filter(item => {
        const itemDate = new Date(item.createdAt || '');
        if (startDate && endDate) {
          const start = new Date(startDate.toString());
          const end = new Date(endDate.toString());
          end.setHours(23, 59, 59, 999);
          return itemDate >= start && itemDate <= end;
        } else if (startDate) {
          const start = new Date(startDate.toString());
          return itemDate >= start;
        } else if (endDate) {
          const end = new Date(endDate.toString());
          end.setHours(23, 59, 59, 999);
          return itemDate <= end;
        }
        return true;
      });
    }

    res.json({
      success: true,
      data: data,
      count: data.length
    });
  } catch (error: any) {
    console.error("Error fetching enrollment requests:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Error fetching enrollment requests", 
      error: error.message 
    });
  }
};

/* ---------- UPDATE STATUS ---------- */
export const updateEnrollmentRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const enrollment = await EnrollmentRequest.findByPk(id);
    
    if (!enrollment) {
      return res.status(404).json({ 
        success: false,
        message: "Enrollment request not found" 
      });
    }

    const validStatuses = ["pending", "approved", "rejected"];
    if (req.body.status && !validStatuses.includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: pending, approved, or rejected"
      });
    }

    await enrollment.update(req.body);
    
    res.json({
      success: true,
      message: "Enrollment request updated successfully",
      data: enrollment
    });
  } catch (error: any) {
    console.error("Error updating enrollment request:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Error updating enrollment request", 
      error: error.message 
    });
  }
};

/* ---------- DELETE (Hard Delete) ---------- */
export const deleteEnrollmentRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const enrollment = await EnrollmentRequest.findByPk(id);
    
    if (!enrollment) {
      return res.status(404).json({ 
        success: false,
        message: "Enrollment request not found" 
      });
    }

    // Delete the proof image file if it exists
    if (enrollment.proofImage && enrollment.proofImage !== '') {
      const imagePath = path.join(process.cwd(), 'public', enrollment.proofImage);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        console.error("Error deleting proof image:", err);
      }
    }

    // Hard delete from database
    await enrollment.destroy();

    res.json({ 
      success: true,
      message: "Enrollment request deleted successfully"
    });
  } catch (error: any) {
    console.error("Error deleting enrollment request:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Error deleting enrollment request", 
      error: error.message 
    });
  }
};

/* ---------- GET STATS ---------- */
export const getEnrollmentStats = async (_req: Request, res: Response) => {
  try {
    const allRequests = await EnrollmentRequest.findAll();
    
    const stats = {
      total: allRequests.length,
      pending: allRequests.filter(r => r.status === "pending").length,
      approved: allRequests.filter(r => r.status === "approved").length,
      rejected: allRequests.filter(r => r.status === "rejected").length,
      byDomain: {} as Record<number, number>,
      byCourse: {} as Record<number, number>
    };

    // Count by domain
    allRequests.forEach(request => {
      if (request.domainId !== undefined) {
        stats.byDomain[request.domainId] = (stats.byDomain[request.domainId] || 0) + 1;
      }
      if (request.courseId !== undefined) {
        stats.byCourse[request.courseId] = (stats.byCourse[request.courseId] || 0) + 1;
      }
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error("Error fetching enrollment stats:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Error fetching enrollment stats", 
      error: error.message 
    });
  }
};