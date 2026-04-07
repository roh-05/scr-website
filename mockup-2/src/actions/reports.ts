// src/actions/reports.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DepartmentType, ReportStatus } from "@prisma/client";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";
import { ActionResponse } from "@/lib/types";

const reportSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  department: z.nativeEnum(DepartmentType),
  authorNames: z.string().min(1, "Author names are required"),
  fileUrl: z.string().url("Invalid file URL"),
  coverUrl: z.string().url("Invalid cover URL").optional(),
  fileSizeBytes: z.number().int().positive().optional(),
  status: z.nativeEnum(ReportStatus).optional(),
  excerpt: z.string().optional(),
  tags: z.string().optional(),
});

// --- 1. FETCH ALL REPORTS ---
export async function getReports(): Promise<ActionResponse<unknown[]>> {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" }, // Newest first
    });
    return { success: true, data: reports };
  } catch (error) {
    console.error("[REPORT FETCH ERROR]:", error);
    return { success: false, error: "Failed to load reports from database." };
  }
}

export async function getReportById(id: string): Promise<ActionResponse<unknown>> {
  try {
    const report = await prisma.report.findUnique({
      where: { id },
    });
    if (!report) return { success: false, error: "Report not found." };
    return { success: true, data: report };
  } catch (error) {
    console.error("[REPORT FETCH ERROR]:", error);
    return { success: false, error: "Failed to load reports from database." };
  }
}

// --- 2. CREATE A NEW REPORT ---
// Note: You will upload the PDF to Supabase Storage first via src/actions/storage.ts, 
// then pass the resulting fileUrl into this function.
export async function createReport(data: any): Promise<ActionResponse<unknown>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized: You must be logged in to perform this action." };
    }

    const parseResult = reportSchema.safeParse(data);
    if (!parseResult.success) {
      return { success: false, error: parseResult.error.issues[0]?.message || "Invalid payload." };
    }

    const validData = parseResult.data;

    const newReport = await prisma.report.create({
      data: {
        title: validData.title,
        department: validData.department,
        authorNames: validData.authorNames,
        fileUrl: validData.fileUrl,
        coverUrl: validData.coverUrl,
        fileSizeBytes: validData.fileSizeBytes,
        status: validData.status || ReportStatus.DRAFT,
        // If it's published immediately, set the publishedAt date
        publishedAt: validData.status === ReportStatus.PUBLISHED ? new Date() : null,
        excerpt: validData.excerpt,
        tags: validData.tags,
      },
    });

    // Automatically refresh the reports page so the new item appears
    revalidatePath("/admin/reports"); 
    return { success: true, data: newReport };
  } catch (error) {
    console.error("[REPORT CREATE ERROR]:", error);
    return { success: false, error: "Failed to save the new report." };
  }
}

// --- 3. UPDATE A REPORT (e.g., Changing Draft to Published) ---
export async function updateReportStatus(id: string, newStatus: ReportStatus): Promise<ActionResponse<unknown>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized: You must be logged in to perform this action." };
    }

    const parseResult = z.nativeEnum(ReportStatus).safeParse(newStatus);
    if (!parseResult.success) {
       return { success: false, error: "Invalid status" };
    }

    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        status: parseResult.data,
        publishedAt: parseResult.data === ReportStatus.PUBLISHED ? new Date() : null,
      },
    });

    revalidatePath("/admin/reports");
    return { success: true, data: updatedReport };
  } catch (error) {
    console.error("[REPORT UPDATE ERROR]:", error);
    return { success: false, error: "Failed to update report status." };
  }
}

// --- 4. DELETE A REPORT ---
export async function deleteReport(id: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized: You must be logged in to perform this action." };
    }

    await prisma.report.delete({
      where: { id },
    });

    revalidatePath("/admin/reports");
    return { success: true };
  } catch (error) {
    console.error("[REPORT DELETE ERROR]:", error);
    return { success: false, error: "Failed to dynamically delete report." };
  }
}

// --- 5. REPORT CACHE MANAGEMENT ---
export async function updateReportCoverUrl(id: string, coverUrl: string | null): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized: You must be logged in to perform this action." };
    }

    await prisma.report.update({
      where: { id },
      data: { coverUrl },
    });

    revalidatePath("/admin/reports");
    revalidatePath("/publications");
    return { success: true };
  } catch (error) {
    console.error("[REPORT UPDATE ERROR]:", error);
    return { success: false, error: "Failed to update cover url." };
  }
}

export async function clearAllCoverImagesStorage(): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized: You must be logged in to perform this action." };
    }

    // List all files in the "covers" folder of the "reports" bucket
    const { data: files, error: listError } = await supabase.storage.from('reports').list('covers');
    if (listError) return { success: false, error: "Failed to list cover images." };

    if (files && files.length > 0) {
      // Supabase list can return an empty entry or directories, but usually just files.
      // Filter out standard placeholder `.emptyFolderPlaceholder` if any
      const filesToRemove = files
        .filter(x => x.name !== '.emptyFolderPlaceholder')
        .map(x => `covers/${x.name}`);
        
      if (filesToRemove.length > 0) {
          const { error: removeError } = await supabase.storage.from('reports').remove(filesToRemove);
          if (removeError) {
              console.error("[STORAGE REMOVE ERROR]", removeError);
              return { success: false, error: "Failed to delete cover images from storage." };
          }
      }
    }

    // Now remove coverUrl from all reports in db locally
    await prisma.report.updateMany({
      data: { coverUrl: null },
    });
    
    revalidatePath("/admin/reports");
    revalidatePath("/publications");

    return { success: true };
  } catch (error) {
    console.error("[REPORT CACHE CLEAR ERROR]:", error);
    return { success: false, error: "Failed to clear cover images." };
  }
}