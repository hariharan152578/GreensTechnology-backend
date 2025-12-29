

// import { Request, Response } from "express";
// import { FAQChat } from "../models/FaqChat.model";

// /* ---------- GET (Frontend) ---------- */
// export const getFAQs = async (req: Request, res: Response) => {
//   const domainId = Number(req.query.domainId || 0);
//   const courseId = Number(req.query.courseId || 0);
//   const category = req.query.category as string;

//   let whereClause: any = { domainId, courseId, isActive: true };
  
//   if (category) {
//     whereClause.category = category;
//   }

//   let faqs = await FAQChat.findAll({
//     where: whereClause,
//     order: [["order", "ASC"], ["createdAt", "DESC"]],
//   });

//   // Fallback logic similar to enroll cards
//   if (!faqs.length && domainId > 0) {
//     whereClause.courseId = 0;
//     faqs = await FAQChat.findAll({
//       where: whereClause,
//       order: [["order", "ASC"]],
//     });
//   }

//   if (!faqs.length) {
//     whereClause.domainId = 0;
//     whereClause.courseId = 0;
//     faqs = await FAQChat.findAll({
//       where: whereClause,
//       order: [["order", "ASC"]],
//     });
//   }

//   res.json(faqs);
// };

// /* ---------- GET ALL (Admin) ---------- */
// export const getAllFAQs = async (req: Request, res: Response) => {
//   try {
//     const faqs = await FAQChat.findAll({
//       order: [
//         ["domainId", "ASC"],
//         ["courseId", "ASC"],
//         ["order", "ASC"],
//       ],
//     });
//     res.json(faqs);
//   } catch (error) {
//     console.error("Error fetching FAQs:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /* ---------- GET BY ID ---------- */
// export const getFAQById = async (req: Request, res: Response) => {
//   try {
//     const faq = await FAQChat.findByPk(req.params.id);
//     if (!faq) return res.status(404).json({ message: "FAQ not found" });

//     // Increment view count
//     faq.views += 1;
//     await faq.save();

//     res.json(faq);
//   } catch (error) {
//     console.error("Error fetching FAQ:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /* ---------- CREATE ---------- */
// export const createFAQ = async (req: Request, res: Response) => {
//   try {
//     // Validate required fields
//     if (!req.body.question || !req.body.answer) {
//       return res.status(400).json({ message: "Question and answer are required" });
//     }

//     // Parse numeric fields
//     const faqData = {
//       domainId: Number(req.body.domainId || 0),
//       courseId: Number(req.body.courseId || 0),
//       question: req.body.question,
//       answer: req.body.answer,
//       category: req.body.category || null,
//       order: Number(req.body.order || 0),
//       isActive: req.body.isActive === "true" || req.body.isActive === true,
//       likes: 0,
//       views: 0,
//     };

//     const faq = await FAQChat.create(faqData);
//     res.status(201).json(faq);
//   } catch (error) {
//     console.error("Error creating FAQ:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /* ---------- UPDATE ---------- */
// export const updateFAQ = async (req: Request, res: Response) => {
//   try {
//     const faq = await FAQChat.findByPk(req.params.id);
//     if (!faq) return res.status(404).json({ message: "FAQ not found" });

//     const updateData: any = {};
    
//     if (req.body.domainId !== undefined) updateData.domainId = Number(req.body.domainId);
//     if (req.body.courseId !== undefined) updateData.courseId = Number(req.body.courseId);
//     if (req.body.question !== undefined) updateData.question = req.body.question;
//     if (req.body.answer !== undefined) updateData.answer = req.body.answer;
//     if (req.body.category !== undefined) updateData.category = req.body.category;
//     if (req.body.order !== undefined) updateData.order = Number(req.body.order);
//     if (req.body.isActive !== undefined) {
//       updateData.isActive = req.body.isActive === "true" || req.body.isActive === true;
//     }

//     await faq.update(updateData);
//     res.json(faq);
//   } catch (error) {
//     console.error("Error updating FAQ:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /* ---------- INCREMENT LIKES ---------- */
// export const incrementLikes = async (req: Request, res: Response) => {
//   try {
//     const faq = await FAQChat.findByPk(req.params.id);
//     if (!faq) return res.status(404).json({ message: "FAQ not found" });

//     faq.likes += 1;
//     await faq.save();

//     res.json({ likes: faq.likes });
//   } catch (error) {
//     console.error("Error incrementing likes:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /* ---------- DELETE (SOFT) ---------- */
// export const deleteFAQ = async (req: Request, res: Response) => {
//   try {
//     const faq = await FAQChat.findByPk(req.params.id);
//     if (!faq) return res.status(404).json({ message: "FAQ not found" });

//     await faq.update({ isActive: false });

//     res.json({ 
//       success: true,
//       message: "FAQ deleted successfully" 
//     });
//   } catch (error) {
//     console.error("Error deleting FAQ:", error);
//     res.status(500).json({ 
//       success: false,
//       message: "Server error" 
//     });
//   }
// };

// /* ---------- UPDATE ORDER ---------- */
// export const updateFAQOrder = async (req: Request, res: Response) => {
//   try {
//     const { faqs } = req.body;

//     if (!Array.isArray(faqs)) {
//       return res.status(400).json({ message: "Invalid request format" });
//     }

//     // Validate each FAQ has required fields
//     for (const faqData of faqs) {
//       if (!faqData.id || faqData.order === undefined) {
//         return res.status(400).json({ 
//           message: "Each FAQ must have id and order properties" 
//         });
//       }
//     }

//     // Update each FAQ's order
//     const updatePromises = faqs.map((faqData) =>
//       FAQChat.update(
//         { order: faqData.order },
//         { where: { id: faqData.id } }
//       )
//     );

//     await Promise.all(updatePromises);
    
//     res.json({ 
//       success: true, 
//       message: "Order updated successfully" 
//     });
//   } catch (error) {
//     console.error("Error updating FAQ order:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Error updating order" 
//     });
//   }
// };

// /* ---------- GET CATEGORIES ---------- */
// export const getCategories = async (req: Request, res: Response) => {
//   try {
//     const domainId = Number(req.query.domainId || 0);
//     const courseId = Number(req.query.courseId || 0);

//     const categories = await FAQChat.findAll({
//       attributes: ['category'],
//       where: { 
//         domainId, 
//         courseId,
//         isActive: true,
//         category: { $not: null }
//       },
//       group: ['category'],
//       order: [['category', 'ASC']]
//     });

//     const uniqueCategories = categories
//       .map(cat => cat.category)
//       .filter((cat): cat is string => cat !== null);

//     res.json(uniqueCategories);
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

import { Request, Response } from "express";
import { FAQChat } from "../models/FaqChat.model";
import { Op } from "sequelize"; // Add this import

/* ---------- GET (Frontend) ---------- */
export const getFAQs = async (req: Request, res: Response) => {
  const domainId = Number(req.query.domainId || 0);
  const courseId = Number(req.query.courseId || 0);
  const category = req.query.category as string;

  let whereClause: any = { domainId, courseId, isActive: true };
  
  if (category) {
    whereClause.category = category;
  }

  let faqs = await FAQChat.findAll({
    where: whereClause,
    order: [["order", "ASC"], ["createdAt", "DESC"]],
  });

  // Fallback logic similar to enroll cards
  if (!faqs.length && domainId > 0) {
    whereClause.courseId = 0;
    faqs = await FAQChat.findAll({
      where: whereClause,
      order: [["order", "ASC"]],
    });
  }

  if (!faqs.length) {
    whereClause.domainId = 0;
    whereClause.courseId = 0;
    faqs = await FAQChat.findAll({
      where: whereClause,
      order: [["order", "ASC"]],
    });
  }

  res.json(faqs);
};

/* ---------- GET ALL (Admin) ---------- */
export const getAllFAQs = async (req: Request, res: Response) => {
  try {
    const faqs = await FAQChat.findAll({
      order: [
        ["domainId", "ASC"],
        ["courseId", "ASC"],
        ["order", "ASC"],
      ],
    });
    res.json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- GET BY ID ---------- */
export const getFAQById = async (req: Request, res: Response) => {
  try {
    const faq = await FAQChat.findByPk(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    // Increment view count
    faq.views += 1;
    await faq.save();

    res.json(faq);
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- CREATE ---------- */
export const createFAQ = async (req: Request, res: Response) => {
  try {
    // Validate required fields
    if (!req.body.question || !req.body.answer) {
      return res.status(400).json({ message: "Question and answer are required" });
    }

    // Parse numeric fields
    const faqData = {
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      question: req.body.question,
      answer: req.body.answer,
      category: req.body.category || null,
      order: Number(req.body.order || 0),
      isActive: req.body.isActive === "true" || req.body.isActive === true,
      likes: 0,
      views: 0,
    };

    const faq = await FAQChat.create(faqData);
    res.status(201).json(faq);
  } catch (error) {
    console.error("Error creating FAQ:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- UPDATE ---------- */
export const updateFAQ = async (req: Request, res: Response) => {
  try {
    const faq = await FAQChat.findByPk(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    const updateData: any = {};
    
    if (req.body.domainId !== undefined) updateData.domainId = Number(req.body.domainId);
    if (req.body.courseId !== undefined) updateData.courseId = Number(req.body.courseId);
    if (req.body.question !== undefined) updateData.question = req.body.question;
    if (req.body.answer !== undefined) updateData.answer = req.body.answer;
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.order !== undefined) updateData.order = Number(req.body.order);
    if (req.body.isActive !== undefined) {
      updateData.isActive = req.body.isActive === "true" || req.body.isActive === true;
    }

    await faq.update(updateData);
    res.json(faq);
  } catch (error) {
    console.error("Error updating FAQ:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- INCREMENT LIKES ---------- */
export const incrementLikes = async (req: Request, res: Response) => {
  try {
    const faq = await FAQChat.findByPk(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    faq.likes += 1;
    await faq.save();

    res.json({ likes: faq.likes });
  } catch (error) {
    console.error("Error incrementing likes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- DELETE (SOFT) ---------- */
export const deleteFAQ = async (req: Request, res: Response) => {
  try {
    const faq = await FAQChat.findByPk(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    await faq.update({ isActive: false });

    res.json({ 
      success: true,
      message: "FAQ deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

/* ---------- UPDATE ORDER ---------- */
export const updateFAQOrder = async (req: Request, res: Response) => {
  try {
    const { faqs } = req.body;

    if (!Array.isArray(faqs)) {
      return res.status(400).json({ message: "Invalid request format" });
    }

    // Validate each FAQ has required fields
    for (const faqData of faqs) {
      if (!faqData.id || faqData.order === undefined) {
        return res.status(400).json({ 
          message: "Each FAQ must have id and order properties" 
        });
      }
    }

    // Update each FAQ's order
    const updatePromises = faqs.map((faqData) =>
      FAQChat.update(
        { order: faqData.order },
        { where: { id: faqData.id } }
      )
    );

    await Promise.all(updatePromises);
    
    res.json({ 
      success: true, 
      message: "Order updated successfully" 
    });
  } catch (error) {
    console.error("Error updating FAQ order:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error updating order" 
    });
  }
};

/* ---------- GET CATEGORIES ---------- */
export const getCategories = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    const categories = await FAQChat.findAll({
      attributes: ['category'],
      where: { 
        domainId, 
        courseId,
        isActive: true,
        category: { [Op.ne]: null } // FIXED: Use Op.ne instead of $not
      },
      group: ['category'],
      order: [['category', 'ASC']]
    });

    const uniqueCategories = categories
      .map(cat => cat.category)
      .filter((cat): cat is string => cat !== null);

    res.json(uniqueCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
};