import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

// API ROUTES
app.use("/api", apiRoutes);

// Health check
app.get("/", (_req, res) => {
  res.send("API is running");
});
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
