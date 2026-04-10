// src/app/publications/PublicationsClient.tsx
"use client";

import { useState, useMemo } from 'react';
import { Search, Filter, FileText, Download, ExternalLink, X, LayoutGrid, List, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import PublicationCover from '@/components/PublicationCover';

const DEPARTMENTS = ['All', 'Equity Research', 'M&A', 'Quantitative Research', 'Economic Research'];

function formatDate(str: string) {
    return new Date(str).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// Define the shape of the data coming from our database
type ReportData = {
    id: string;
    title: string;
    department: string;
    departmentEnum: string;
    authorNames: string;
    fileUrl: string;
    coverUrl?: string | null;
    excerpt?: string | null;
    tags?: string | null;
    date: string;
};

export default function PublicationsClient({ 
    initialReports, 
    departmentColors 
}: { 
    initialReports: ReportData[], 
    departmentColors: Record<string, string> 
}) {
    const [query, setQuery] = useState('');
    const [activeDept, setActiveDept] = useState('All');
    const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery');

    const results = useMemo(() => {
        return initialReports.filter((p) => {
            const matchesDept = activeDept === 'All' || p.department === activeDept;
            const q = query.toLowerCase();
            const matchesQuery =
                !q ||
                p.title.toLowerCase().includes(q) ||
                p.authorNames.toLowerCase().includes(q);
            return matchesDept && matchesQuery;
        });
    }, [query, activeDept, initialReports]);

    // Automatically feature the 3 newest reports if no search/filter is applied
    const featuredReports = initialReports.slice(0, 3);
    const standardReports = results.filter(r => !featuredReports.some(f => f.id === r.id));

    return (
        <div className="flex flex-col min-h-screen bg-surrey-light">
            {/* Header */}
            <section className="bg-surrey-blue pt-20 pb-16 px-6 relative overflow-hidden">
                <div className="max-w-3xl mx-auto text-center text-white relative z-10">
                    <span className="inline-block px-4 py-1.5 mb-6 rounded-full text-xs font-bold tracking-widest uppercase bg-surrey-gold/20 text-surrey-gold border border-surrey-gold/30 shadow-sm">
                        Research Library
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Publications</h1>
                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                        Browse our archive of equity notes, macro outlooks, quant research, and M&A deal analyses.
                    </p>
                </div>
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ac9741 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            </section>

            {/* Main Content Area */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 flex-grow">
                <div className="max-w-7xl mx-auto">

                    {/* ── SLEEK, FLOATING TOOLBAR ── */}
                    <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center mb-8">

                        {/* Filter Pills */}
                        <div className="flex flex-wrap gap-2 items-center">
                            {DEPARTMENTS.map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setActiveDept(d)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm
                    ${activeDept === d
                                            ? 'bg-surrey-blue text-white ring-2 ring-surrey-blue ring-offset-2'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-surrey-blue'
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>

                        {/* Search & View Toggles */}
                        <div className="flex items-center gap-3 w-full lg:w-auto">

                            <div className="relative flex-grow lg:w-72">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search by title or author..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full pl-12 pr-10 py-2.5 text-sm border border-gray-200 rounded-full
                             bg-white focus:outline-none focus:ring-2 focus:ring-surrey-gold
                             focus:border-transparent transition-all duration-200 text-surrey-blue placeholder-gray-400 shadow-sm"
                                />
                                {query && (
                                    <button
                                        onClick={() => setQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-surrey-blue bg-gray-100 rounded-full p-1 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>

                            <div className="flex bg-white border border-gray-200 rounded-full p-1 shadow-sm shrink-0">
                                <button
                                    onClick={() => setViewMode('gallery')}
                                    className={`p-1.5 rounded-full transition-all duration-200 ${viewMode === 'gallery' ? 'bg-gray-100 text-surrey-blue' : 'text-gray-400 hover:text-surrey-blue'}`}
                                    aria-label="Gallery View"
                                >
                                    <LayoutGrid size={16} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-full transition-all duration-200 ${viewMode === 'list' ? 'bg-gray-100 text-surrey-blue' : 'text-gray-400 hover:text-surrey-blue'}`}
                                    aria-label="List View"
                                >
                                    <List size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-500 text-sm mb-6 font-medium">
                        Showing <span className="text-surrey-blue font-bold">{results.length}</span> of {initialReports.length} reports
                    </p>

                    {/* Results Area */}
                    {!query && activeDept === 'All' && featuredReports.length > 0 && viewMode === 'gallery' && (
                        <div className="mb-16">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-surrey-gold mb-8 flex items-center gap-3">
                                <span className="w-8 h-0.5 bg-surrey-gold" /> Featured Reports
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14 max-w-6xl mx-auto">
                                {featuredReports.map((p) => (
                                    <ReportCard key={p.id} report={p} />
                                ))}
                            </div>
                            <div className="border-t border-gray-200 mt-20 mb-10" />
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-3">
                                <span className="w-8 h-0.5 bg-gray-300" /> All Reports
                            </h2>
                        </div>
                    )}

                    {results.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-300">
                            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-surrey-blue font-bold text-lg mb-2">No publications found.</p>
                            <button
                                onClick={() => { setQuery(''); setActiveDept('All'); }}
                                className="mt-4 bg-surrey-blue text-white px-6 py-2 rounded-md font-semibold hover:bg-[#2a3c50] transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        viewMode === 'gallery' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 max-w-6xl mx-auto py-4">
                                {(!query && activeDept === 'All' ? standardReports : results).map((p) => <ReportCard key={p.id} report={p} />)}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="border-b-2 border-gray-100 bg-gray-50/50">
                                            <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest w-32">Date</th>
                                            <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest w-48">Department</th>
                                            <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Report Title</th>
                                            <th className="py-4 px-6 w-16 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {results.map((p) => (
                                            <ReportTableRow 
                                                key={p.id} 
                                                report={p} 
                                                colors={departmentColors} 
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}
                </div>
            </section>
        </div>
    );
}

// ── COMPONENT 1: MINIMALIST A4 GALLERY VIEW CARD ──

function ReportCard({ report: p }: { report: ReportData }) {
    return (
        <Link
            href={`/publications/${p.id}`}
            className="block w-full transition-transform duration-300 hover:-translate-y-2 focus:outline-none group"
            aria-label={`View ${p.title}`}
        >
            <div className="relative w-full aspect-[210/297] bg-white border border-gray-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-300 flex items-center justify-center overflow-hidden">
                <PublicationCover pdfUrl={p.fileUrl} coverUrl={p.coverUrl} title={p.title} />
            </div>
        </Link>
    );
}

// ── COMPONENT 2: SLEEK TABLE ROW ──

function ReportTableRow({ 
    report: p, 
    colors 
}: { 
    report: ReportData, 
    colors: Record<string, string> 
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Get the color from the database metadata, fallback to brand blue if missing
    const tagColor = colors[p.departmentEnum] || '#354a61';

    return (
        <>
            <tr
                onClick={() => setIsExpanded(!isExpanded)}
                className={`cursor-pointer transition-colors duration-200 group ${isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50/70'}`}
            >
                <td className="py-5 px-6 text-sm text-gray-500 font-medium whitespace-nowrap align-middle">
                    {formatDate(p.date)}
                </td>

                <td className="py-5 px-6 whitespace-nowrap align-middle">
                    <span
                        className="inline-block px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider"
                        style={{ backgroundColor: `${tagColor}15`, color: tagColor }}
                    >
                        {p.department}
                    </span>
                </td>

                <td className="py-5 px-6 align-middle">
                    <span className="block text-base font-semibold text-surrey-blue group-hover:text-surrey-gold transition-colors">
                        {p.title}
                    </span>
                </td>

                <td className="py-5 px-6 text-right text-gray-400 align-middle">
                    {isExpanded ? <ChevronUp size={20} className="inline-block" /> : <ChevronDown size={20} className="inline-block" />}
                </td>
            </tr>

            {isExpanded && (
                <tr>
                    <td colSpan={4} className="p-0 border-b-2 border-gray-100">
                        <div className="p-8 px-6 md:px-12 bg-[#fafbf8] flex flex-col md:flex-row gap-8 items-start shadow-inner">

                            <Link href={`/publications/${p.id}`} className="w-32 md:w-48 shrink-0 aspect-[210/297] relative bg-white border border-gray-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center overflow-hidden">
                                <PublicationCover pdfUrl={p.fileUrl} coverUrl={p.coverUrl} title={p.title} />
                            </Link>

                            <div className="flex-1 flex flex-col h-full">
                                <Link href={`/publications/${p.id}`} className="hover:underline text-surrey-blue">
                                    <h4 className="text-xl font-bold mb-2">{p.title}</h4>
                                </Link>
                                <p className="text-sm font-medium text-gray-500 mb-5">
                                    Authored by <span className="text-surrey-blue font-bold">{p.authorNames}</span>
                                </p>

                                <p className="text-body-text text-sm leading-relaxed mb-4 max-w-3xl">
                                    {p.excerpt || "All research is produced independently by students of the University of Surrey. Click below to view the full report."}
                                </p>

                                {p.tags && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {p.tags.split(',').map((tag, index) => (
                                            <span 
                                                key={index}
                                                className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded border border-gray-200"
                                            >
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex flex-wrap items-center gap-3 mt-auto">
                                    <a
                                        href={p.fileUrl}
                                        download
                                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-white bg-surrey-blue hover:bg-[#2a3c50] transition-colors shadow-sm"
                                    >
                                        <Download size={16} /> Download PDF
                                    </a>
                                    <a
                                        href={p.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-surrey-blue border border-surrey-blue/30 hover:bg-surrey-blue/5 transition-colors"
                                    >
                                        <ExternalLink size={16} /> View in Browser
                                    </a>
                                </div>
                            </div>

                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}