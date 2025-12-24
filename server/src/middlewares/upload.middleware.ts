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
   🔵 ENROLL UPLOAD (KEEP OLD NAME: upload)
===================================================== */
const enrollDir = "uploads/enroll";
ensureDir(enrollDir);

const enrollStorage = multer.diskStorage({
  destination: enrollDir,
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

export const upload = multer({
  storage: enrollStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
});

/* =====================================================
   🟢 TESTIMONIAL IMAGE UPLOAD
===================================================== */
const testimonialDir = "uploads/testimonials";
ensureDir(testimonialDir);

const testimonialStorage = multer.diskStorage({
  destination: testimonialDir,
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${name}${ext}`);
  },
});

export const uploadTestimonialImage = multer({
  storage: testimonialStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const isValid =
      allowed.test(file.mimetype) &&
      allowed.test(path.extname(file.originalname).toLowerCase());

    if (!isValid) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});
