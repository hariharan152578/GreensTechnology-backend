import { Sequelize } from "sequelize-typescript";
import { User } from "../models/User.model";
import { Domain } from "../models/Domain.model";
import { Course } from "../models/Course.model";
import { Hero } from "../models/Hero.model";
import { Enroll } from "../models/Enroll.model";
import { EnrollCard } from "../models/EnrollCard.model";
import { EnrollRequest } from "../models/EnrollRequest.model";

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "app_db",
  models: [
    User,
    Hero,
    Domain,
    Course,
    Enroll,
    EnrollCard,
    EnrollRequest, // ✅ REQUIRED
  ],
  logging: false,
});
