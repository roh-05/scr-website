"use client";

import { Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';
import { FileText } from 'lucide-react';

// This is required to make react-pdf work in Next.js
// It loads the worker script from a CDN to prevent complex Webpack/Turbopack errors
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfCover({ pdfUrl, title }: { pdfUrl: string, title: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-surrey-light overflow-hidden">
      
      {/* Loading State / Fallback */}
      {(!isLoaded || error) && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
          <FileText size={48} className={!error ? "animate-pulse" : ""} />
        </div>
      )}

      {/* The PDF Renderer */}
      <Document
        file={pdfUrl}
        onLoadSuccess={() => setIsLoaded(true)}
        onLoadError={() => setError(true)}
        className="flex items-center justify-center w-full"
      >
        <Page 
          pageNumber={1} 
          width={400} // Renders at a decent resolution for a thumbnail
          renderTextLayer={false} // Disables text selection to keep it looking like an image
          renderAnnotationLayer={false} // Disables links on the cover
          className="shadow-md transition-transform duration-700 group-hover:scale-105"
        />
      </Document>
    </div>
  );
}