import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Download, ExternalLink, Calendar, Users, Tag, FileText } from 'lucide-react';

import { DEPT_COLORS } from '@/lib/constants';
import { getReportById } from '@/actions/reports';
import { DepartmentType } from '@prisma/client';

import ClientPdfCoverWrapper from '@/components/ClientPdfCoverWrapper';

function formatDate(dateString: string | Date | null) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
}

function getReadableDepartment(dept: DepartmentType) {
  switch (dept) {
    case 'EQUITY_RESEARCH': return 'Equity Research';
    case 'MERGERS_ACQUISITIONS': return 'M&A';
    case 'QUANTITATIVE_FINANCE': return 'Quantitative Research';
    case 'ECONOMIC_RESEARCH': return 'Economic Research';
    default: return 'Research';
  }
}

export default async function PublicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getReportById(id);
  const report = result.success ? (result.data as any) : null;

  if (!report) {
    return (
      <div className="min-h-screen bg-surrey-light flex flex-col items-center justify-center px-6">
        <FileText size={64} className="text-gray-300 mb-6" />
        <h1 className="text-3xl font-bold text-surrey-blue mb-4">Publication Not Found</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">We couldn't find the report you're looking for. It may have been moved or deleted.</p>
        <Link 
          href="/publications"
          className="bg-surrey-blue text-white px-8 py-3 rounded-md font-semibold hover:bg-[#2a3c50] transition-colors"
        >
          Return to Library
        </Link>
      </div>
    );
  }

  const deptKey = getReadableDepartment(report.department);
  const deptStyle = DEPT_COLORS[deptKey] || { bg: '#bfc5ca', text: '#fff' };

  // Format comma separated tags to an array
  const tagsArray = report.tags 
    ? report.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
    : [];

  return (
    <div className="min-h-screen bg-surrey-light flex flex-col pt-16">
      
      {/* ── TOP ACCENT BAR ── */}
      <div className="h-2 w-full" style={{ backgroundColor: deptStyle.bg }}></div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        
        {/* Back Navigation */}
        <Link 
          href="/publications" 
          className="inline-flex items-center text-gray-500 hover:text-surrey-blue font-medium transition-colors mb-8 lg:mb-12 group"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Research Library
        </Link>

        {/* ── SLEEK FLEXBOX LAYOUT ── */}
        <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">
          
          {/* LEFT: STRICTLY CONSTRAINED A4 COVER */}
          {/* w-full on mobile, strictly 1/3 or 1/4 on larger screens, NEVER wider than 360px */}
          <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 mx-auto md:mx-0 max-w-[360px]">
            <div className="relative w-full aspect-[210/297] bg-white border border-gray-300 shadow-[0_0_20px_rgba(0,0,0,0.15)] flex items-center justify-center overflow-hidden rounded-sm">
              <ClientPdfCoverWrapper pdfUrl={report.fileUrl} title={report.title} />
            </div>
          </div>

          {/* RIGHT: TYPOGRAPHY & DETAILS */}
          {/* flex-1 allows this to take up all the remaining horizontal space */}
          <div className="flex-1 flex flex-col w-full">
            
            {/* Department Badge */}
            <div className="mb-5">
              <span 
                className="inline-block px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest border"
                style={{ backgroundColor: `${deptStyle.bg}10`, color: deptStyle.bg, borderColor: `${deptStyle.bg}30` }}
              >
                {deptKey}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-5xl font-extrabold text-surrey-blue tracking-tight leading-tight mb-6 lg:mb-8">
              {report.title}
            </h1>

            {/* Meta Data Row */}
            <div className="flex flex-wrap items-center gap-y-4 gap-x-6 pb-6 lg:pb-8 mb-6 lg:mb-8 border-b border-gray-200">
              <div className="flex items-center text-body-text">
                <Users size={18} className="mr-2 text-gray-400" />
                <span className="font-medium text-sm lg:text-base">{report.authorNames}</span>
              </div>
              <div className="hidden sm:block text-gray-300">•</div>
              <div className="flex items-center text-body-text">
                <Calendar size={18} className="mr-2 text-gray-400" />
                <span className="font-medium text-sm lg:text-base">{formatDate(report.publishedAt || report.createdAt)}</span>
              </div>
            </div>

            {/* Abstract / Excerpt */}
            <div className="prose prose-lg text-body-text mb-10 max-w-4xl">
              <h3 className="text-lg font-bold text-surrey-blue mb-3">Executive Summary</h3>
              <p className="leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                {report.excerpt || "No abstract provided for this publication."}
              </p>
            </div>

            {/* Tags */}
            {tagsArray.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {tagsArray.map((t: string) => (
                  <span key={t} className="inline-flex items-center px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-500 text-[11px] font-bold uppercase tracking-wider shadow-sm">
                    <Tag size={12} className="mr-1.5" /> {t}
                  </span>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto">
              <a
                href={report.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-sm font-bold text-white bg-surrey-blue hover:bg-[#2a3c50] transition-colors shadow-md hover:shadow-lg"
              >
                <Download size={18} /> Download PDF
              </a>
              <a
                href={report.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-md border-2 border-gray-200 text-gray-600 hover:border-surrey-blue hover:text-surrey-blue transition-colors bg-white shadow-sm hover:shadow-md font-bold text-sm"
              >
                <ExternalLink size={18} /> View in Browser
              </a>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}