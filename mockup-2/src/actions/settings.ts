// src/actions/settings.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";
import { ActionResponse } from "@/lib/types";

const settingsSchema = z.object({
  organizationName: z.string().min(1).max(100).optional(),
  universityAffiliation: z.string().min(1).max(100).optional(),
  globalDescription: z.string().min(1).max(500).optional(),
  contactEmail: z.string().email().optional(),
  linkedinUrl: z.union([z.string().url().optional(), z.literal("").transform(() => undefined)]),
  officeAddress: z.string().min(1).max(500).optional(),
  maintenanceMode: z.boolean().optional(),
  equityEmail: z.string().email().optional(),
  mnaEmail: z.string().email().optional(),
  quantEmail: z.string().email().optional(),
  economicsEmail: z.string().email().optional(),
});

// --- 1. FETCH SETTINGS (With safety fallback) ---
export async function getSiteSettings(): Promise<ActionResponse<unknown>> {
  try {
    // Upsert ensures we always have exactly one row (ID: 1)
    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {}, // If it exists, do nothing
      create: {   // If it doesn't exist, create it with these defaults
        organizationName: "Surrey Capital Research",
        universityAffiliation: "University of Surrey",
        globalDescription: "Student-led equity, M&A, quantitative, and economic research.",
        contactEmail: "contact@surreycapital.org",
        linkedinUrl: "https://linkedin.com/company/surrey-capital-research",
        officeAddress: "Surrey Business School\nUniversity of Surrey\nGuildford, GU2 7XH\nUnited Kingdom",
        maintenanceMode: false,
        equityEmail: "equities@surreycapital.org",
        mnaEmail: "mna@surreycapital.org",
        quantEmail: "quant@surreycapital.org",
        economicsEmail: "economics@surreycapital.org",
      },
    });

    return { success: true, data: settings };
  } catch (error) {
    console.error("[SETTINGS FETCH ERROR]:", error);
    return { success: false, error: "Failed to load site settings" };
  }
}

// --- 2. UPDATE SETTINGS ---
export async function updateSiteSettings(data: any): Promise<ActionResponse<unknown>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized: You must be logged in to perform this action." };
    }

    const parseResult = settingsSchema.safeParse(data);
    if (!parseResult.success) {
      return { success: false, error: parseResult.error.issues[0]?.message || "Invalid settings payload." };
    }

    const validData = parseResult.data;

    const updatedSettings = await prisma.siteSettings.update({
      where: { id: 1 },
      data: validData,
    });

    // Revalidate the global layout and settings page so changes show immediately
    revalidatePath("/", "layout"); 
    revalidatePath("/admin/settings");

    return { success: true, data: updatedSettings };
  } catch (error) {
    console.error("[SETTINGS UPDATE ERROR]:", error);
    return { success: false, error: "Failed to save settings to the database" };
  }
}