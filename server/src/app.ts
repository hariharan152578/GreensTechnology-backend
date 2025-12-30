  import express from "express";
  import cors from "cors";
  import apiRoutes from "./routes/index";
  import path from "path";
import fs from "fs"
  const app = express();
const allowedOrigins = [
  'http://localhost:4000', // Your current frontend
  'http://localhost:5173', // Vite default
  'http://localhost:3000', // React default
];
  // app.use(cors());
app.use(cors({
  origin: '*', // Allow all origins (for development only!)
  credentials: false, // Must be false when origin is '*'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders:['Content-Disposition']
}));
  app.use(express.json());

  /* 🔥 SERVE UPLOADS CORRECTLY */
 app.use(
  "/uploads/study-materials",
  express.static(path.join(process.cwd(), "uploads", "materials"))
);

// Keep the general one for other uploads
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    maxAge: 0,
    etag: false, // Optional: prevents the browser from using 'If-None-Match' checks
    lastModified: false // Optional: ensures the browser doesn't try to validate the file date
  })
);
const debugPath = path.join(process.cwd(), "uploads", "materials");
console.log("Checking folder:", debugPath);
console.log("Folder exists?", fs.existsSync(debugPath));
if (fs.existsSync(debugPath)) {
  console.log("Files inside:", fs.readdirSync(debugPath));
}
  // API ROUTES
  app.use("/api", apiRoutes);

  // Health check
  app.get("/", (_req, res) => {
    res.send("API is running");
  });

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  export default app;
