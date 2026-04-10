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

  // Homepage
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroImageUrl: z.string().optional(),
  missionTitle: z.string().optional(),
  missionDescription: z.string().optional(),
  ctaHeading: z.string().optional(),
  ctaSubtext: z.string().optional(),

  // About
  aboutHeroTitle: z.string().optional(),
  aboutHeroSubtitle: z.string().optional().nullable(),
  aboutHeroDescription1: z.string().optional(),
  aboutHeroDescription2: z.string().optional(),
  aboutHeroImageUrl: z.string().optional().nullable(),
  researchTitle: z.string().optional(),
  researchIntro: z.string().optional(),
  leadershipIntro: z.string().optional(),
  joinHeading: z.string().optional(),
  joinText: z.string().optional(),
  joinUrl: z.string().url().optional(),

  // Dept Index
  deptIndexTitle: z.string().optional(),
  deptIndexIntro: z.string().optional(),

  // Contact Hero
  contactHeroTitle: z.string().optional(),
  contactHeroDescription: z.string().optional(),

  // Global / Footer
  logoUrl: z.string().optional().nullable(),
  footerCopyright: z.string().optional(),

  // Branding & Colors
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  secondaryBgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  mutedColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  borderColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  headingFont: z.string().optional(),
  bodyFont: z.string().optional(),
});

import { SiteSettings, Faq, ResearchArea, DepartmentMetadata, Project } from "@prisma/client";

export type SiteSettingsWithComplex = SiteSettings & {
  faqs: Faq[];
  researchAreas: ResearchArea[];
  deptMetadata: DepartmentMetadata[];
  projects: Project[];
};

// --- 1. FETCH SETTINGS (With safety fallback) ---
export async function getSiteSettings(): Promise<ActionResponse<SiteSettingsWithComplex>> {
  try {
    // Upsert ensures we always have exactly one row (ID: 1)
    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {}, 
      create: {   
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
        primaryColor: "#3D5A80",
        accentColor: "#B8963E",
        backgroundColor: "#FFFFFF",
        secondaryBgColor: "#F7F8FA",
        mutedColor: "#6B7F94",
        borderColor: "#EBF0F5",
        headingFont: "EB Garamond",
        bodyFont: "Merriweather",
      },
    });

    // @ts-ignore
    const faqs = await prisma.faq.findMany({ orderBy: { order: 'asc' } });
    // @ts-ignore
    const researchAreas = await prisma.researchArea.findMany({ orderBy: { order: 'asc' } });
    // @ts-ignore
    const deptMetadata = await prisma.departmentMetadata.findMany();
    // @ts-ignore
    const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });

    return { 
      success: true, 
      data: { 
        ...settings, 
        faqs, 
        researchAreas, 
        deptMetadata, 
        projects 
      } as SiteSettingsWithComplex 
    };
  } catch (error) {
    console.error("[SETTINGS FETCH ERROR]:", error);
    return { success: false, error: "Failed to load site settings" };
  }
}

// --- 2. UPDATE SETTINGS ---
export async function updateSiteSettings(data: any): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized: You must be logged in to perform this action." };
    }

    // Filter out nested objects from primary settings update
    const { faqs, researchAreas, deptMetadata, projects, ...primarySettings } = data;

    const parseResult = settingsSchema.safeParse(primarySettings);
    if (!parseResult.success) {
      return { success: false, error: parseResult.error.issues[0]?.message || "Invalid settings payload." };
    }

    const validData = parseResult.data;

    const updatedSettings = await prisma.siteSettings.update({
      where: { id: 1 },
      data: validData,
    });

    revalidatePath("/", "layout"); 
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (error) {
    console.error("[SETTINGS UPDATE ERROR]:", error);
    return { success: false, error: "Failed to save settings to the database" };
  }
}

// --- 3. FAQ ACTIONS ---
export async function updateFaqs(faqs: any[]): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Transaction to sync FAQs
    await prisma.$transaction([
      // @ts-ignore
      prisma.faq.deleteMany(),
      // @ts-ignore
      prisma.faq.createMany({ data: faqs.map((f, i) => ({ ...f, order: i })) }),
    ]);

    revalidatePath("/about");
    return { success: true };
  } catch (error) {
    console.error("[FAQ UPDATE ERROR]:", error);
    return { success: false, error: "Failed to sync FAQs" };
  }
}

// --- 4. RESEARCH AREA ACTIONS ---
export async function updateResearchAreas(areas: any[]): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    await prisma.$transaction([
      // @ts-ignore
      prisma.researchArea.deleteMany(),
      // @ts-ignore
      prisma.researchArea.createMany({ data: areas.map((a, i) => ({ ...a, order: i })) }),
    ]);

    revalidatePath("/about");
    return { success: true };
  } catch (error) {
    console.error("[RESEARCH AREA UPDATE ERROR]:", error);
    return { success: false, error: "Failed to sync Research Areas" };
  }
}

// --- 5. DEPARTMENT METADATA ACTIONS ---
export async function updateDepartmentMetadata(metadata: any): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { department, ...rest } = metadata;

    // @ts-ignore
    await prisma.departmentMetadata.upsert({
      where: { department },
      update: rest,
      create: { department, ...rest },
    });

    const getSlug = (deptType: string) => {
      switch(deptType) {
        case 'EQUITY_RESEARCH': return 'equity-research';
        case 'MERGERS_ACQUISITIONS': return 'm-and-a';
        case 'QUANTITATIVE_FINANCE': return 'quantitative-research';
        case 'ECONOMIC_RESEARCH': return 'economic-research';
        default: return deptType.toLowerCase().replace(/_/g, '-');
      }
    };

    revalidatePath("/departments");
    revalidatePath(`/departments/${getSlug(department)}`);
    return { success: true };
  } catch (error) {
    console.error("[DEPT METADATA UPDATE ERROR]:", error);
    return { success: false, error: "Failed to update department metadata" };
  }
}

// --- 6. PROJECT ACTIONS ---
export async function updateProjects(department: any, projects: any[]): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    await prisma.$transaction([
      // @ts-ignore
      prisma.project.deleteMany({ where: { department } }),
      // @ts-ignore
      prisma.project.createMany({ data: projects.map((p, i) => ({ ...p, department, order: i })) }),
    ]);

    revalidatePath(`/departments/${department.toLowerCase().replace(/_/g, '-')}`);
    return { success: true };
  } catch (error) {
    console.error("[PROJECT UPDATE ERROR]:", error);
    return { success: false, error: "Failed to sync projects" };
  }
}