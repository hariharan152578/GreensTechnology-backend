import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/enroll",
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

export const uploadEnrollImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
