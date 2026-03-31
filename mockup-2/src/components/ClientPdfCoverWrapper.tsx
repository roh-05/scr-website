"use client";

import dynamic from 'next/dynamic';
import { FileText } from 'lucide-react';

// Dynamically import the PdfCover with ssr disabled inside a Client Wrapper
const PdfCover = dynamic(() => import('@/components/PdfCover'), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gray-50 animate-pulse flex items-center justify-center text-gray-300"><FileText size={48} /></div>
});

export default function ClientPdfCoverWrapper({ pdfUrl, title }: { pdfUrl: string; title?: string }) {
  return <PdfCover pdfUrl={pdfUrl} title={title} />;
}
