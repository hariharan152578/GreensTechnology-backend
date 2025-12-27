import multer from "multer";
import path from "path";
import fs from "fs";

/* ---------- HELPER ---------- */
const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/* =====================================================
   🔵 ENROLL / GENERIC IMAGE UPLOAD
===================================================== */
const enrollDir = "uploads/enroll";
ensureDir(enrollDir);

const enrollStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, enrollDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

export const upload = multer({
  storage: enrollStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

/* =====================================================
   🟢 TESTIMONIAL IMAGE UPLOAD
===================================================== */
const testimonialDir = "uploads/testimonials";
ensureDir(testimonialDir);

const testimonialStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, testimonialDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const uploadTestimonialImage = multer({
  storage: testimonialStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const isValid =
      allowed.test(file.mimetype) &&
      allowed.test(path.extname(file.originalname).toLowerCase());

    if (!isValid) return cb(new Error("Only image files allowed"));
    cb(null, true);
  },
});
/* =====================================================
   🟣 PROJECT IMAGE UPLOAD
===================================================== */
const projectDir = "uploads/projects";
ensureDir(projectDir);

const projectStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, projectDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const uploadProjectImage = multer({
  storage: projectStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/* ================= VIDEO TESTIMONIAL IMAGE ================= */
const videoDir = "uploads/videos";
ensureDir(videoDir);

const videoStorage = multer.diskStorage({
  destination: videoDir,
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

export const uploadVideoImage = multer({
  storage: videoStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});




/* =====================================================
   🟢 TECH STACK ICON UPLOAD
===================================================== */
const techDir = "uploads/tech-stack";
ensureDir(techDir);

const techStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, techDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const uploadTechIcon = multer({
  storage: techStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /png|jpg|jpeg|webp/;
    const valid =
      allowed.test(file.mimetype) &&
      allowed.test(path.extname(file.originalname).toLowerCase());

    if (!valid) return cb(new Error("Only image files allowed"));
    cb(null, true);
  },
});
