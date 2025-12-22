import "dotenv/config";
import "reflect-metadata";
import app from "./app";
import { sequelize } from "./config/database";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync({ alter: true }); // safe during dev
    console.log("🧩 Models synced");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("⏳ DB not ready, retrying in 5s...");
    setTimeout(startServer, 5000);
  }
};

startServer();
