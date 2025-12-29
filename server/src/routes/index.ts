import { Router } from "express";

/* ---------- CORE SECTIONS ---------- */
import heroRoutes from "./hero.routes";
import domainRoutes from "./domain.routes";
import aboutRoutes from "./about.routes";
import trainerAboutRoutes from "./trainerAbout.routes";
import careerImpactRoutes from "./careerImpact.routes";
import certificateRoutes from "./certificate.routes";
import courseRoutes from "./course.routes";

/* ---------- CONTENT ---------- */
import testimonialRoutes from "./testimonial.routes";
import videoRoutes from "./videoTestimonial.routes";
import techStackRoutes from "./techStack.routes";
import projectRoutes from "./project.routes";
import moduleRoutes from "./module.routes";

/* ---------- STUDENT / LEARNING ---------- */
import studyMaterialRoutes from "./studyMaterial.routes";
import studentSuccessRoutes from "./studentSuccess.routes";

/* ---------- ENROLLMENT (NEW) ---------- */
import enrollCardRoutes from "./enrollCard.routes";
import enrollmentRequestRoutes from "./enrollmentRequest.routes";

/*------------chatbot------------- */
import faqChatRoutes from "./faqChat.routes";
const router = Router();

/* ===============================
   PUBLIC / ADMIN ROUTES
================================ */

router.use("/hero", heroRoutes);
router.use("/domain", domainRoutes);
router.use("/about", aboutRoutes);
router.use("/trainer-about", trainerAboutRoutes);
router.use("/career-impact", careerImpactRoutes);
router.use("/certificate", certificateRoutes);
router.use("/courses", courseRoutes);

router.use("/testimonials", testimonialRoutes);
router.use("/videos", videoRoutes);
router.use("/tech-stack", techStackRoutes);
router.use("/projects", projectRoutes);
router.use("/modules", moduleRoutes);router.use("/materials", studyMaterialRoutes);
router.use("/student-success", studentSuccessRoutes);

/* ===============================
   ENROLLMENT ROUTES
================================ */

router.use("/enroll-cards", enrollCardRoutes);
router.use("/enrollments", enrollmentRequestRoutes);
router.use("/faq-chat", faqChatRoutes);

export default router;
