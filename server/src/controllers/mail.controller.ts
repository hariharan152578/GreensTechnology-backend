import { Request, Response } from "express";
import { Contact } from "../models/mail.model";
import transporter from "../config/mail";
import { env } from "../config/env";
import fs from "fs";

export const handleMailActions = async (req: Request, res: Response) => {
  const {
    mode,
    email,
    fullName,
    phone,
    domainId,
    courseId,
    targetType,
    subject,
    message,
  } = req.body ?? {};

  const file = req.file;

  try {
    if (!mode) {
      return res.status(400).json({ message: "Mode is required" });
    }

    /* ---------- CLIENT : FOOTER SUBSCRIBE ---------- */
    if (mode === "CLIENT_GENERAL") {
      console.log(
        `[MAIL][CLIENT][GENERAL] → Sending subscription mail to: ${email}`
      );

      await Contact.create({ email, contactType: "GENERAL" });

      await transporter.sendMail({
        from: env.smtpFrom,
        to: email,
        subject: "Subscription Confirmed",
        html: `<h3>Thanks for subscribing!</h3>`,
      });

      return res.json({ success: true });
    }

    /* ---------- CLIENT : COURSE ENQUIRY ---------- */
    if (mode === "CLIENT_COURSE") {
      console.log(
        `[MAIL][CLIENT][COURSE] → Sending enquiry mail to: ${email} (Domain: ${domainId}, Course: ${courseId})`
      );

      await Contact.create({
        email,
        fullName,
        phone,
        domainId,
        courseId,
        contactType: "COURSE",
      });

      await transporter.sendMail({
        from: env.smtpFrom,
        to: email,
        subject: "Course Enquiry Received",
        html: `<p>Hello ${fullName}, we received your enquiry.</p>`,
      });

      return res.json({ success: true });
    }

    /* ---------- ADMIN : BULK MAIL ---------- */
    if (mode === "ADMIN_BULK") {
      let where: any = {};
      let audienceLabel = "";

      if (targetType === "GENERAL") {
        where = { contactType: "GENERAL" };
        audienceLabel = "GENERAL subscribers";
      }

      if (targetType === "DOMAIN_SPECIFIC") {
        where = { contactType: "COURSE", domainId };
        audienceLabel = `DOMAIN users (Domain ID: ${domainId})`;
      }

      if (targetType === "COURSE_SPECIFIC") {
        where = { contactType: "COURSE", domainId, courseId };
        audienceLabel = `COURSE users (Domain ID: ${domainId}, Course ID: ${courseId})`;
      }

      const users = await Contact.findAll({ where });
      const bcc = users.map(u => u.email);

      if (!bcc.length) {
        console.warn(
          `[MAIL][ADMIN][${targetType}] → No recipients found`
        );
        return res.status(404).json({ message: "No recipients found" });
      }

      console.log(
        `[MAIL][ADMIN][${targetType}] → Sending bulk mail to ${bcc.length} users | ${audienceLabel}`
      );

      await transporter.sendMail({
        from: env.smtpFrom,
        bcc,
        subject,
        html: `<div>${message}</div>`,
        attachments: file
          ? [{ filename: file.originalname, path: file.path }]
          : [],
      });

      if (file) fs.unlinkSync(file.path);

      return res.json({
        success: true,
        sent: bcc.length,
        audience: audienceLabel,
      });
    }

    return res.status(400).json({ message: "Invalid mode" });

  } catch (err: any) {
    console.error("[MAIL][ERROR]", err.message);
    if (file) fs.unlinkSync(file.path);
    return res.status(500).json({ error: err.message });
  }
};


