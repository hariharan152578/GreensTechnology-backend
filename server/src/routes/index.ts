import { Router } from "express";
import heroRoutes from "./hero.routes";
import domainRoutes from "./domain.routes";
import enrollRoutes from "./enroll.routes";
import enrollRequestRoutes from "./enrollRequest.routes";

const router = Router();

router.use("/hero", heroRoutes);
router.use("/domain", domainRoutes);
router.use("/enrollments", enrollRoutes);
router.use("/enrollments", enrollRequestRoutes); // ✅ THIS WAS MISSING

export default router;
