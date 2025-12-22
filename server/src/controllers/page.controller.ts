import { SectionContent } from "../models/SectionContent.model";

export const getPageData = async (req: { query: { domainId: any; courseId: any; }; }, res: { json: (arg0: { domainId: number; courseId: number; sections: SectionContent[]; }) => void; }) => {
  const domainId = Number(req.query.domainId || 0);
  const courseId = Number(req.query.courseId || 0);

  const sections = await SectionContent.findAll({
    where: { domainId, courseId },
  });

  res.json({ domainId, courseId, sections });
};
