// src/actions/storage.ts
"use server";

import { createClient } from "@/lib/supabase-server";
import { ActionResponse } from "@/lib/types";

/**
 * Server Action to securely upload a file to Supabase Storage.
 * @param formData MUST contain a key named 'file' holding the File object
 * @param bucket The name of the storage bucket
 * @returns Public URL of the uploaded file
 */
export async function uploadFile(
  formData: FormData, 
  bucket: "reports" | "profiles"
): Promise<ActionResponse<string>> {
  try {
    const supabase = await createClient();
    
    // 1. Authorize user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized: You must be logged in to upload files." };
    }

    // 2. Extract file
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No file provided in the request payload." };
    }

    // 3. Optional validation (e.g. check MIME types, block executables)
    // Supabase RLS policies also check this, but early rejection is faster.
    const fileExt = file.name.split('.').pop() || '';
    if (['exe', 'sh', 'bat', 'cmd'].includes(fileExt.toLowerCase())) {
        return { success: false, error: "Executables are not allowed." };
    }

    // 4. Generate random secure filename to prevent overwrites
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    // 5. Upload to Supabase Storage Bucket
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { 
        upsert: false,
        cacheControl: '3600'
      });

    if (error) {
      console.error(`[STORAGE UPLOAD ERROR] Bucket: ${bucket} | Details: ${error.message}`);
      return { success: false, error: "Failed to upload file to the server." };
    }

    // 6. Return standard Public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return { success: true, data: publicUrl };

  } catch (err) {
    console.error("[STORAGE UNEXPECTED ERROR]:", err);
    return { success: false, error: "An unexpected error occurred during the upload process." };
  }
}
