import { createBrowserClient } from '@supabase/ssr';

// These environment variables are standard when you connect a Next.js app to Supabase.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const getClient = () => createBrowserClient(supabaseUrl, supabaseKey);

/**
 * Uploads a file to the 'reports' bucket in Supabase and returns the public URL.
 */
export async function uploadReportToStorage(file: File): Promise<string | null> {
  const supabase = getClient();
  try {
    // 1. Create a unique filename to prevent overwriting existing files
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    // 2. Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('reports') // Name of your bucket
      .upload(filePath, file);

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return null;
    }

    // 3. Get the public URL to save in our Prisma database
    const { data } = supabase.storage.from('reports').getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error("Unexpected error during upload:", error);
    return null;
  }
}

/**
 * Uploads an image file to the 'profiles' bucket in Supabase and returns the public URL.
 */
export async function uploadImageToStorage(file: File): Promise<string | null> {
  const supabase = getClient();
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `headshot_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profiles') 
      .upload(filePath, file);

    if (uploadError) {
      console.error("Storage image upload error:", uploadError);
      return null;
    }

    const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error("Unexpected error during image upload:", error);
    return null;
  }
}