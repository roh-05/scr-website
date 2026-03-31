// src/actions/team.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DepartmentType, MemberStatus } from "@prisma/client";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";
import { ActionResponse } from "@/lib/types";

// Define the Zod schema for TeamMember
const teamMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  role: z.string().min(1, "Role is required").max(100),
  department: z.nativeEnum(DepartmentType),
  email: z.string().email("Invalid email address"),
  linkedinUrl: z.union([z.string().url("Invalid URL").optional(), z.literal("").transform(() => undefined)]),
  imageUrl: z.union([z.string().url("Invalid URL").optional(), z.literal("").transform(() => undefined)]),
  status: z.nativeEnum(MemberStatus).optional(),
  isLeadership: z.boolean().optional(),
});

const teamMemberUpdateSchema = teamMemberSchema.partial();

// --- 1. FETCH ALL TEAM MEMBERS ---
export async function getTeamMembers(): Promise<ActionResponse<unknown[]>> {
  try {
    const team = await prisma.teamMember.findMany({
      // Orders the list so Executive/Leadership is at the top, then alphabetically by last name
      orderBy: [
        { isLeadership: "desc" },
        { lastName: "asc" }
      ],
    });
    return { success: true, data: team };
  } catch (error) {
    console.error("[TEAM FETCH ERROR]:", error);
    return { success: false, error: "Failed to load the team directory database." };
  }
}

// --- 2. ADD A NEW TEAM MEMBER ---
export async function addTeamMember(data: any): Promise<ActionResponse<unknown>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized: You must be logged in to perform this action." };
    }

    // Validate incoming data
    const parseResult = teamMemberSchema.safeParse(data);
    if (!parseResult.success) {
      return { success: false, error: parseResult.error.issues[0]?.message || "Invalid data format." };
    }

    const validData = parseResult.data;

    // Check if email already exists to prevent database crash
    const existingMember = await prisma.teamMember.findUnique({
      where: { email: validData.email }
    });

    if (existingMember) {
      return { success: false, error: "A team member with this email already exists." };
    }

    const newMember = await prisma.teamMember.create({
      data: {
        firstName: validData.firstName,
        lastName: validData.lastName,
        role: validData.role,
        department: validData.department,
        email: validData.email,
        linkedinUrl: validData.linkedinUrl || null,
        imageUrl: validData.imageUrl || null,
        status: validData.status || MemberStatus.ACTIVE,
        isLeadership: validData.isLeadership || false,
      },
    });

    // Refresh the team page and the public About page (which displays leadership)
    revalidatePath("/admin/team");
    revalidatePath("/about");
    
    return { success: true, data: newMember };
  } catch (error) {
    console.error("[TEAM CREATE ERROR]:", error);
    return { success: false, error: "Failed to save the new profile to the database." };
  }
}

// --- 3. UPDATE A TEAM MEMBER (e.g., transition to Alumni) ---
export async function updateTeamMember(id: string, data: any): Promise<ActionResponse<unknown>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized: You must be logged in to perform this action." };
    }

    // Validate incoming update data
    const parseResult = teamMemberUpdateSchema.safeParse(data);
    if (!parseResult.success) {
      return { success: false, error: parseResult.error.issues[0]?.message || "Invalid update format." };
    }

    const validData = parseResult.data;

    const updatedMember = await prisma.teamMember.update({
      where: { id },
      data: validData,
    });

    revalidatePath("/admin/team");
    revalidatePath("/about");
    revalidatePath("/alumni"); // Refresh the alumni page in case they were moved there
    
    return { success: true, data: updatedMember };
  } catch (error) {
    console.error("[TEAM UPDATE ERROR]:", error);
    return { success: false, error: "Failed to update the profile details." };
  }
}

// --- 4. DELETE A TEAM MEMBER ---
export async function deleteTeamMember(id: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized: You must be logged in to perform this action." };
    }

    await prisma.teamMember.delete({
      where: { id },
    });

    revalidatePath("/admin/team");
    revalidatePath("/about");
    
    return { success: true };
  } catch (error) {
    console.error("[TEAM DELETE ERROR]:", error);
    return { success: false, error: "Failed to remove the profile." };
  }
}