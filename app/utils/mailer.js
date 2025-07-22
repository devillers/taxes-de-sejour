//app/utils/mailer.js

import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendMailClient(to, subject, html) {
  return transporter.sendMail({
    from: `"Votre Conciergerie" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
