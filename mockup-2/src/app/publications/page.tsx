"use client";

import { useState, useMemo } from 'react';
import { Search, Filter, FileText, Download, ExternalLink, X, Tag, LayoutGrid, List, ChevronDown, ChevronUp } from 'lucide-react';

import dynamic from 'next/dynamic';

// This forces the PDF renderer to only load in the browser, completely bypassing the server error.
const PdfCover = dynamic(() => import('@/components/PdfCover'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center text-gray-300"><FileText size={48} /></div>
});


import { DEPT_COLORS } from '@/lib/constants';
import PUBLICATIONS from '@/data/publications.json';

const DEPARTMENTS = ['All', 'Equity Research', 'M&A', 'Quantitative Research', 'Economic Research'];

function formatDate(str: string) {
    return new Date(str).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// ── MAIN PAGE COMPONENT ──

export default function PublicationsPage() {
    const [query, setQuery] = useState('');
    const [activeDept, setActiveDept] = useState('All');
    const [viewMode, setViewMode] = useState<'gallery' | 'list'>('list');

    const results = useMemo(() => {
        return PUBLICATIONS.filter((p) => {
            const matchesDept = activeDept === 'All' || p.department === activeDept;
            const q = query.toLowerCase();
            const matchesQuery =
                !q ||
                p.title.toLowerCase().includes(q) ||
                p.authors.some((a: string) => a.toLowerCase().includes(q)) ||
                p.tags.some((t: string) => t.toLowerCase().includes(q)) ||
                p.excerpt.toLowerCase().includes(q);
            return matchesDept && matchesQuery;
        });
    }, [query, activeDept]);

    const featuredReports = PUBLICATIONS.filter((p) => p.featured);

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

                            {/* Pill-shaped Search Bar */}
                            <div className="relative flex-grow lg:w-72">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

                                <input
                                    type="text"
                                    placeholder="Search publications..."
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

                            {/* Pill-shaped View Mode Toggles */}
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
                        Showing <span className="text-surrey-blue font-bold">{results.length}</span> of {PUBLICATIONS.length} reports
                    </p>

                    {/* Results Area */}
                    {!query && activeDept === 'All' && featuredReports.length > 0 && viewMode === 'gallery' && (
                        <div className="mb-16">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-surrey-gold mb-6 flex items-center gap-3">
                                <span className="w-8 h-0.5 bg-surrey-gold" /> Featured Reports
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {featuredReports.map((p) => (
                                    <ReportCard key={p.id} report={p} featured />
                                ))}
                            </div>
                            <div className="border-t border-gray-200 mt-16 mb-8" />
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-3">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {results.map((p) => <ReportCard key={p.id} report={p} featured={false} />)}
                            </div>
                        ) : (
                            // ── SLEEK, PROFESSIONAL TABLE ──
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
                                        {results.map((p) => <ReportTableRow key={p.id} report={p} />)}
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

// ── COMPONENT 1: GALLERY VIEW CARD ──────────────────────────────

function ReportCard({ report: p, featured }: { report: any, featured: boolean }) {
    const deptStyle = DEPT_COLORS[p.department] || { bg: '#bfc5ca', text: '#fff' };
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group ${featured ? 'ring-2 ring-surrey-gold ring-offset-2' : ''}`}>
            <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: deptStyle.bg }}></div>
            <div className="relative w-full aspect-[3/4] bg-surrey-light border-b border-gray-100 overflow-hidden">
                <PdfCover pdfUrl={p.pdfUrl} title={p.title} />
            </div>
            <div className="p-5 flex flex-col bg-white relative z-20">
                <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border" style={{ backgroundColor: `${deptStyle.bg}10`, color: deptStyle.bg, borderColor: `${deptStyle.bg}30` }}>
                        {p.department}
                    </span>
                    <span className="text-gray-500 text-xs font-medium">{formatDate(p.date)}</span>
                </div>
                <div className="flex gap-3">
                    {/* Unified solid blue button */}
                    <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold text-white bg-surrey-blue hover:bg-[#2a3c50] transition-colors shadow-sm">
                        <Download size={16} /> Download
                    </a>
                    <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-4 py-2.5 rounded-md border-2 border-gray-200 text-gray-500 hover:border-surrey-blue hover:text-surrey-blue transition-colors bg-white shadow-sm">
                        <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        </div>
    );
}

// ── COMPONENT 2: SLEEK TABLE ROW ───────────────────────────────

function ReportTableRow({ report: p }: { report: any }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const deptStyle = DEPT_COLORS[p.department] || { bg: '#bfc5ca', text: '#fff' };

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
                        style={{ backgroundColor: `${deptStyle.bg}15`, color: deptStyle.bg }}
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

                            <div className="w-32 md:w-48 shrink-0 aspect-[3/4] relative bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                                <PdfCover pdfUrl={p.pdfUrl} title={p.title} />
                            </div>

                            <div className="flex-1 flex flex-col">
                                <h4 className="text-xl font-bold text-surrey-blue mb-2">{p.title}</h4>
                                <p className="text-sm font-medium text-gray-500 mb-5">
                                    Authored by <span className="text-surrey-blue font-bold">{p.authors.join(', ')}</span>
                                </p>

                                <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-3xl">
                                    {p.excerpt}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {p.tags.map((t: string) => (
                                        <span key={t} className="inline-block px-3 py-1 rounded-md bg-white border border-gray-200 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                            <Tag size={10} className="inline-block mr-1 mb-0.5" /> {t}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex flex-wrap items-center gap-3 mt-auto">
                                    {/* Unified solid blue button */}
                                    <a
                                        href={p.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold text-white bg-surrey-blue hover:bg-[#2a3c50] transition-colors shadow-sm"
                                    >
                                        <Download size={16} /> Download PDF
                                    </a>
                                    <a
                                        href={p.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold text-white bg-surrey-blue hover:bg-[#2a3c50] transition-colors shadow-sm"

                                    >
                                        <ExternalLink size={16} /> View Full Screen
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