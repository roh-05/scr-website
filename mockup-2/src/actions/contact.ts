// src/actions/contact.ts
"use server";

import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { ActionResponse } from "@/lib/types";

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

    return { success: true };
  } catch (error) {
    console.error("[CONTACT FORM SUBMISSION ERROR]:", error);
    return { success: false, error: "An unexpected error occurred. Please try again later." };
  }
}