import 'dotenv/config'
import 'reflect-metadata';
import express from "express";
import cors from "cors";
import app from "./app";
import { sequelize } from "../src/config/database";
import noticeRoutes from "./routes/noticeRoutes";

const PORT = process.env.PORT || 5000;

/* -------------------- MIDDLEWARES -------------------- */

// Configure CORS
app.use(cors({
  // Allows the frontend to communicate. 
  // You can also use "*" to allow all, but specific is safer.
  origin: ["http://localhost:5173", "http://localhost:3000"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Required to parse JSON bodies from POST/PUT requests
app.use(express.json()); 

/* -------------------- ROUTES -------------------- */

// Mount your routes
app.use("/api/notices", noticeRoutes);

// Health Check
app.get("/", (req, res) => {
  res.status(200).send("Greens Technology Backend API is Live 🚀");
});

/* -------------------- ERROR HANDLING -------------------- */

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Requested route not found" });
});

/* -------------------- SERVER STARTUP -------------------- */

const connectWithRetry = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Database connected successfully.");

    // Sync models to database
    await sequelize.sync({ alter: false }); 
    console.log("✅ Models synchronized.");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed. Details:", error);
    console.log("⏳ Retrying connection in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();