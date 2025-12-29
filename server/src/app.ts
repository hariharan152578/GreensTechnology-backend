  import express from "express";
  import cors from "cors";
  import apiRoutes from "./routes/index";
  import path from "path";

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
}));
  app.use(express.json());

  /* 🔥 SERVE UPLOADS CORRECTLY */
  app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "uploads"))
  );

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
