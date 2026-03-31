// src/actions/enquiries.ts
"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase-server";
import { ActionResponse } from "@/lib/types";

export async function getEnquiries(): Promise<ActionResponse<unknown>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized: You must be logged in to view enquiries." };
    }

    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: submissions };
  } catch (error) {
    console.error("[FETCH ENQUIRIES ERROR]:", error);
    return { success: false, error: "Failed to fetch enquiries." };
  }
}

export async function toggleEnquiryReadStatus(id: string, currentStatus: boolean): Promise<ActionResponse<unknown>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized: You must be logged in to modify enquiries." };
    }

    const updatedSubmission = await prisma.contactSubmission.update({
      where: { id },
      data: { isRead: !currentStatus },
    });

    return { success: true, data: updatedSubmission };
  } catch (error) {
    console.error("[UPDATE ENQUIRY ERROR]:", error);
    return { success: false, error: "Failed to update enquiry status." };
  }
}
