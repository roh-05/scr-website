// src/actions/contact.ts
"use server";

import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { ActionResponse } from "@/lib/types";

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function submitContactForm(formData: FormData): Promise<ActionResponse> {
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  // Basic validation
  if (!name || !email || !message) {
    return { success: false, error: "Please fill out all required fields." };
  }

  // Rate Limiting (Max 3 submissions per minute per IP)
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";
  
  if (!checkRateLimit(ip, 3, 60 * 1000)) {
    return { success: false, error: "Too many requests. Please try again later." };
  }

  try {
    // Create submission in the database
    await prisma.contactSubmission.create({
      data: {
        name: name.toString(),
        email: email.toString(),
        subject: subject?.toString() || "General Inquiry",
        message: message.toString(),
      }
    });
    
    // TODO: In the future, integrate Resend, Sendgrid, or NodeMailer here
    // to actually email this data to contact@surreycapital.org
    
    console.log("New Contact Form Submission saved to Database:", { name, email, subject, message });

    try {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: email.toString(),
        subject: 'Thank you for contacting Surrey Capital Research',
        html: `
          <p>Dear ${name},</p>
          <p>Thank you for your message. We have received your inquiry and will respond within 2-3 business days.</p>
          <p>Best regards,<br>Surrey Capital Research Team</p>
        `,
      });
    } catch (emailError) {
      console.error('[EMAIL SEND ERROR]:', emailError);
      // Don't fail the submission; log and continue
    }

    return { success: true };
  } catch (error) {
    console.error("[CONTACT FORM SUBMISSION ERROR]:", error);
    return { success: false, error: "An unexpected error occurred. Please try again later." };
  }
}