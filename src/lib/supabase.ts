import { createBrowserClient } from '@supabase/ssr';
import { pdfjs } from 'react-pdf';

// Set worker path for PDF processing only on the client
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

// These environment variables are standard when you connect a Next.js app to Supabase.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const getClient = () => createBrowserClient(supabaseUrl, supabaseKey);

/**
 * Extracts the first page of a PDF file as an image Blob.
 */
export async function extractCoverImage(file: File): Promise<Blob | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 2.0 }); // High quality
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) return null;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas, // Some versions require this
    }).promise;

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  } catch (error) {
    console.error("Cover extraction error:", error);
    return null;
  }
}

/**
 * Uploads a file and its generated cover to Supabase Storage.
 */
export async function uploadReportWithCover(file: File): Promise<{ fileUrl: string; coverUrl: string | null } | null> {
  const supabase = getClient();
  try {
    const fileExt = file.name.split('.').pop();
    const baseName = Math.random().toString(36).substring(2, 15) + '_' + Date.now();
    const pdfPath = `public/${baseName}.${fileExt}`;
    const coverPath = `covers/${baseName}.png`;

    // 1. Upload PDF
    const { error: pdfError } = await supabase.storage.from('reports').upload(pdfPath, file);
    if (pdfError) throw pdfError;
    const { data: pdfData } = supabase.storage.from('reports').getPublicUrl(pdfPath);

    // 2. Extract and Upload Cover
    let coverUrl: string | null = null;
    const coverBlob = await extractCoverImage(file);
    if (coverBlob) {
      const { error: coverError } = await supabase.storage.from('reports').upload(coverPath, coverBlob);
      if (!coverError) {
        const { data: coverData } = supabase.storage.from('reports').getPublicUrl(coverPath);
        coverUrl = coverData.publicUrl;
      } else {
        console.warn("Cover image upload failed, continuing without it:", coverError);
      }
    }

    return { fileUrl: pdfData.publicUrl, coverUrl };
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}

/**
 * Uploads a file to the 'reports' bucket in Supabase and returns the public URL.
 */
export async function uploadReportToStorage(file: File): Promise<string | null> {
  const res = await uploadReportWithCover(file);
  return res?.fileUrl || null;
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