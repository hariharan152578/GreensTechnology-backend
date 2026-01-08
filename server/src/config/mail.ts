import nodemailer, { Transporter } from "nodemailer";
import { env } from "./env";

const transporter: Transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpSecure,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
});

export default transporter;
