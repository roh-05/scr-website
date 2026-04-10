import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { DEPT_COLORS } from '@/lib/constants';
import prisma from "@/lib/prisma";
import { DepartmentType } from '@prisma/client';

// ── DEPARTMENT DIRECTORY DATA ──
const DESKS = [
  {
    id: 'equity-research',
    type: DepartmentType.EQUITY_RESEARCH,
    name: 'Equity Research',
    icon: LucideIcons.TrendingUp,
    description: 'Delivering deep-dive fundamental analysis, financial modeling, and actionable investment recommendations on publicly traded companies across global markets.',
    focus: 'Fundamental Analysis & Valuation',
  },
  {
    id: 'm-and-a',
    type: DepartmentType.MERGERS_ACQUISITIONS,
    name: 'M&A',
    icon: LucideIcons.Briefcase,
    description: 'Analyzing strategic rationale, synergy realization, and financial structuring of major mergers, acquisitions, and corporate restructuring events.',
    focus: 'Deal Mechanics & Strategy',
  },
  {
    id: 'quantitative-research',
    type: DepartmentType.QUANTITATIVE_FINANCE,
    name: 'Quantitative Research',
    icon: LucideIcons.Calculator,
    description: 'Developing data-driven trading strategies, factor models, and algorithmic frameworks to identify market inefficiencies and optimize portfolio allocation.',
    focus: 'Algorithmic & Factor Modeling',
  },
  {
    id: 'economic-research',
    type: DepartmentType.ECONOMIC_RESEARCH,
    name: 'Economic Research',
    icon: LucideIcons.Globe,
    description: 'Forecasting macroeconomic trends, central bank policy shifts, and geopolitical developments to provide a top-down view of global asset classes.',
    focus: 'Macro Trends & Policy',
  }
];

import { getSiteSettings } from "@/actions/settings";

export default async function DepartmentsIndexPage() {
  // 1. Fetch live settings for the header
  const settingsResult = await getSiteSettings();
  const settings = (settingsResult.success ? settingsResult.data : null) as any;

  // 2. Fetch real report counts from PostgreSQL grouping by department where published
  const publishCounts = await prisma.report.groupBy({
    by: ['department'],
    where: { status: 'PUBLISHED' },
    _count: { id: true }
  });

  // Convert the array into a quick lookup dictionary: { 'EQUITY_RESEARCH': 5, ... }
  const countsMap = publishCounts.reduce((acc, current) => {
    acc[current.department] = current._count.id;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-surrey-light flex flex-col">
      
      {/* ── HEADER ── */}
      <section className="bg-surrey-blue pt-20 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full text-xs font-bold tracking-widest uppercase bg-surrey-gold/20 text-surrey-gold border border-surrey-gold/30 shadow-sm">
            Our Organization
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            {settings?.deptIndexTitle || "Research Desks"}
          </h1>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            {settings?.deptIndexIntro || "Explore our specialized research divisions. Each desk produces institutional-grade analysis tailored to their specific market mandate."}
          </p>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ac9741 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      </section>

      {/* ── DESK DIRECTORY GRID ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {DESKS.map((desk) => {
              const meta = settings?.deptMetadata?.find((m: any) => m.department === desk.type);
              
              let Icon = desk.icon;
              let iconName = meta?.iconName;
              if (iconName) {
                iconName = iconName.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
                if ((LucideIcons as Record<string, any>)[iconName]) {
                  Icon = (LucideIcons as Record<string, any>)[iconName];
                }
              }
              
              const deskName = meta?.name || desk.name;
              const deskDesc = meta?.description || desk.description;
              const deskFocus = meta?.focus || desk.focus;
              const deptStyle = DEPT_COLORS[deskName] || DEPT_COLORS[desk.name] || { bg: '#bfc5ca', text: '#fff' };
              
              // Map the live database count using the department type
              const reportCount = countsMap[desk.type] || 0;

              return (
                <Link 
                  key={desk.id}
                  href={`/departments/${desk.id}`}
                  className="group flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Top Color Accent */}
                  <div className="h-2 w-full shrink-0" style={{ backgroundColor: deptStyle.bg }}></div>
                  
                  <div className="p-8 md:p-10 flex flex-col h-full">
                    
                    {/* Header: Icon & Title */}
                    <div className="flex items-center gap-5 mb-6">
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
                        style={{ backgroundColor: `${deptStyle.bg}15`, color: deptStyle.bg }}
                      >
                        <Icon size={28} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-surrey-blue group-hover:text-surrey-gold transition-colors">
                          {deskName}
                        </h2>
                        <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                          {deskFocus}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-body-text leading-relaxed mb-10 flex-grow">
                      {deskDesc}
                    </p>

                    {/* Footer: Stats & CTA */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                      <div className="flex items-center text-gray-500 text-sm font-medium">
                        <FileText size={16} className="mr-2" />
                        <span className="text-surrey-blue font-bold mr-1">{reportCount}</span> published reports
                      </div>
                      <div className="flex items-center text-surrey-blue font-semibold text-sm group-hover:text-surrey-gold transition-colors">
                        View Archive <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      
    </div>
  );
}