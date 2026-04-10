"use client";

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FileText } from 'lucide-react';

// Set worker path only on the client
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

export default function PdfCover({ pdfUrl, title }: { pdfUrl: string; title?: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gray-50 text-gray-400">
        <FileText size={32} className="mb-2 opacity-50" />
        <span className="text-[10px] uppercase tracking-wider font-bold">Cover Preview</span>
      </div>
    );
  }

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