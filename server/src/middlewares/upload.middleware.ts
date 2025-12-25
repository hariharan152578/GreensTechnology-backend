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
  filename: (_req, file, cb) => {
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


/* =====================================================
   🟣 ABOUT IMAGE UPLOAD
===================================================== */

const aboutDir = "uploads/about";
ensureDir(aboutDir);

const aboutStorage = multer.diskStorage({
  destination: aboutDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${name}${ext}`);
  },
});

export const uploadAboutImages = multer({
  storage: aboutStorage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 5 MB
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
}).fields([
  { name: "mainImages", maxCount: 10 },
  { name: "smallImages", maxCount: 10 },
]);



/* =====================================================
   🔵 HERO IMAGE UPLOAD
===================================================== */

const heroDir = "uploads/hero";
ensureDir(heroDir);

const heroStorage = multer.diskStorage({
  destination: heroDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${name}${ext}`);
  },
});

export const uploadHeroImages = multer({
  storage: heroStorage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 5MB
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




/* =====================================================
   🔵 CERTIFICATE IMAGE UPLOAD
===================================================== */

const certDir = "uploads/certificates";
ensureDir(certDir);

const storage = multer.diskStorage({
  destination: certDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${name}${ext}`);
  },
});

export const uploadCertificateImage = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
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


/* =====================================================
   🟢 STUDENT SUCCESS IMAGE UPLOAD
===================================================== */

const studentDir = "uploads/studentsucess";
ensureDir(studentDir);

const studentStorage = multer.diskStorage({
  destination: studentDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${name}${ext}`);
  },
});

export const uploadStudentSuccessImage = multer({
  storage: studentStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
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


/* =====================================================
   📘 STUDY MATERIAL UPLOAD
===================================================== */

const studyDir = "uploads/StudyMaterials";
ensureDir(studyDir);

const studyStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, studyDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${name}${ext}`);
  },
});

export const Studyupload = multer({
  storage: studyStorage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 🔥 200MB (videos supported)
  },
  fileFilter: (_req, file, cb) => {
    const allowedExtensions =
      /pdf|doc|docx|ppt|pptx|mp4|webm|epub/i;

    const extValid = allowedExtensions.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeValid = allowedExtensions.test(file.mimetype);

    if (!extValid && !mimeValid) {
      cb(new Error("Unsupported file type"));
      return;
    }

    cb(null, true);
  },
});