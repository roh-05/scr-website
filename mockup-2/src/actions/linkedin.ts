"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { ActionResponse } from "@/lib/types";
import { z } from "zod";

const embedUrlSchema = z.string().url().refine(
  (url) => url.includes("linkedin.com/embed"),
  { message: "Could not find a valid LinkedIn embed URL. Make sure you copied the full embed code." }
);

function extractEmbedUrl(input: string): string {
  const trimmed = input.trim();
  // If it looks like an iframe tag, pull out the src attribute
  const match = trimmed.match(/src="([^"]+)"/);
  if (match) return match[1];
  // Otherwise assume it's already a URL
  return trimmed;
}

export async function getLinkedInPosts(): Promise<ActionResponse<unknown[]>> {
  try {
    const posts = await prisma.linkedInPost.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: posts };
  } catch (error) {
    console.error("[LINKEDIN FETCH ERROR]:", error);
    return { success: false, error: "Failed to load LinkedIn posts." };
  }
}

export async function createLinkedInPost(embedUrl: string): Promise<ActionResponse<unknown>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized." };

    const parsed = embedUrlSchema.safeParse(extractEmbedUrl(embedUrl));
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid URL." };
    }

    const lastPost = await prisma.linkedInPost.findFirst({ orderBy: { order: "desc" } });
    const nextOrder = (lastPost?.order ?? -1) + 1;

    const post = await prisma.linkedInPost.create({
      data: { embedUrl: parsed.data, order: nextOrder },
    });

    revalidatePath("/");
    revalidatePath("/admin/linkedin");
    return { success: true, data: post };
  } catch (error) {
    console.error("[LINKEDIN CREATE ERROR]:", error);
    return { success: false, error: "Failed to save post." };
  }
}

export async function deleteLinkedInPost(id: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized." };

    await prisma.linkedInPost.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/admin/linkedin");
    return { success: true };
  } catch (error) {
    console.error("[LINKEDIN DELETE ERROR]:", error);
    return { success: false, error: "Failed to delete post." };
  }
}
