import { Request, Response } from "express";
import { Enroll } from "../models/Enroll.model";
import { EnrollCard } from "../models/EnrollCard.model";

export const getEnrollSection = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    const findEnroll = async (dId: number, cId: number) => {
      return Enroll.findOne({
        where: { domainId: dId, courseId: cId, isActive: true },
        include: [
          {
            model: EnrollCard,
            where: { isActive: true },
            required: false,
            order: [["order", "ASC"]],
          },
        ],
      });
    };

    let enroll =
      (await findEnroll(domainId, courseId)) ||
      (await findEnroll(domainId, 0)) ||
      (await findEnroll(0, 0));

    if (!enroll) {
      return res.status(404).json({ message: "Enroll section not found" });
    }

    res.json(enroll);
  } catch (error) {
    console.error("Enroll fetch error:", error);
    res.status(500).json({ message: "Failed to fetch enroll section" });
  }
};
