"use client";

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FileText } from 'lucide-react';

const PdfCover = dynamic(() => import('@/components/PdfCover'), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gray-50 animate-pulse flex items-center justify-center text-gray-300"><FileText size={48} /></div>
});

export default function ClientReportCard({ report }: { report: any }) {
  return (
    <Link 
      href={`/publications/${report.id}`}
      className="block w-full transition-transform duration-500 hover:-translate-y-2 focus:outline-none group"
      aria-label={`View ${report.title}`}
    >
      <div className="relative w-full aspect-[210/297] bg-white border border-gray-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-500 flex items-center justify-center overflow-hidden">
        <PdfCover pdfUrl={report.fileUrl || report.pdfUrl} title={report.title} />
      </div>
    </Link>
  );
}
