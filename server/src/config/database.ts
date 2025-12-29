import { Sequelize } from "sequelize-typescript";
import { User } from "../models/User.model";
import { Domain } from "../models/Domain.model";
import { Course } from "../models/Course.model";
import { Hero } from "../models/Hero.model";
import { About } from "../models/About.model";
import { TrainerAbout } from "../models/TrainerAbout.model";
import { CareerImpact } from "../models/CareerImpact.model";
import { Certificate } from "../models/Certificate.model";
import { Testimonial } from "../models/Testimonial.model";
import { StudyMaterial } from "../models/StudyMaterial.model";
import { StudentSuccess } from "../models/StudentSuccess.model";
import {Module} from "../models/Module.model"
import { ModuleTopic } from "../models/ModuleTopic.model";
import { Project } from "../models/Project.model";
import { ProjectTech } from "../models/ProjectTech.model";
import { VideoTestimonial } from "../models/VideoTestimonial.model";
import { TechStack } from "../models/TechStack.model";
import { EnrollmentRequest } from "../models/EnrollmentRequest.model";
import { EnrollCard } from "../models/EnrollCard.model";
import { FaqChat } from "../models/FaqChat.model";

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
    About,
    TrainerAbout,
    CareerImpact,
    Certificate,
    Testimonial ,
    StudyMaterial,
    StudentSuccess,
    ModuleTopic,
    Module ,
    Project,
    EnrollCard,
    EnrollmentRequest,
  ProjectTech, 
  VideoTestimonial,
  TechStack,
  FaqChat,

  ],
  logging: false,
});
