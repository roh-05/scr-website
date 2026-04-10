"use client";

import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';

export default function PdfCover({ pdfUrl, title }: { pdfUrl: string; title?: string }) {
  const [PDF, setPDF] = useState<{ Document: any; Page: any } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Dynamically load react-pdf only on the client
    import('react-pdf').then((mod) => {
      const { pdfjs } = mod;
      // Set worker path
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      setPDF({ Document: mod.Document, Page: mod.Page });
    }).catch((err) => {
      console.error("Failed to load PDF library:", err);
      setError(true);
    });
  }, []);

  if (error || !PDF) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gray-50 text-gray-400">
        <FileText size={32} className={`${!error ? 'animate-pulse' : ''} mb-2 opacity-50`} />
        <span className="text-[10px] uppercase tracking-wider font-bold">
          {error ? "Error Loading Preview" : "Loading Preview..."}
        </span>
      </div>
    );
  }

  const { Document, Page } = PDF;

  return (
    <div className="w-full h-full flex items-center justify-center bg-white overflow-hidden">
      <Document
        file={pdfUrl}
        onLoadError={() => setError(true)}
        className="w-full h-full flex items-center justify-center"
      >
        <Page
          pageNumber={1}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          scale={2}
          // The magic fix: object-contain guarantees the whole page stays in frame!
          className="w-full h-full flex items-center justify-center [&>canvas]:!w-full [&>canvas]:!h-full [&>canvas]:!object-contain"
        />
      </Document>
    </div>
  );
}