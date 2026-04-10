import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, FileText, Users, TrendingUp, LineChart, 
  Briefcase, Calculator, Globe, Target, Clock, Activity, Shield
} from 'lucide-react';

import { DEPT_COLORS } from '@/lib/constants';
import ClientReportCard from '@/components/ClientReportCard';
import prisma from "@/lib/prisma";
import { DepartmentType } from '@prisma/client';

// ── STATIC DEPARTMENT FALLBACK DATA ──
const DEPARTMENT_INFO: Record<string, any> = {
  'equity-research': {
    name: 'Equity Research',
    icon: TrendingUp,
    description: 'Delivering deep-dive fundamental analysis, financial modeling, and actionable investment recommendations on publicly traded companies across global markets.',
    focus: 'Fundamental Analysis & Valuation',
    overview: 'The Equity Research desk focuses on identifying mispriced assets in the public markets. Our analysts conduct rigorous bottom-up fundamental analysis, building detailed financial models and conducting channel checks to formulate high-conviction investment theses. We cover a broad range of sectors, providing our readers with comprehensive insights into company valuations, competitive dynamics, and catalysts for value realization.',
    projects: [
      { title: 'Global Tech Sector Initiation', type: 'Sector Initiation', status: 'Drafting' },
      { title: 'European Banking Resilience', type: 'Deep Dive', status: 'In Review' },
      { title: 'Consumer Staples Outlook', type: 'Coverage Initiation', status: 'Researching' }
    ]
  },
  'm-and-a': {
    name: 'M&A',
    icon: Briefcase,
    description: 'Analyzing strategic rationale, synergy realization, and financial structuring of major mergers, acquisitions, and corporate restructuring events.',
    focus: 'Deal Mechanics & Strategy',
    overview: 'The Mergers & Acquisitions desk provides comprehensive coverage of corporate transactions, focusing on strategic logic, valuation multiples, and the financial mechanics underpinning major deals. Our team dissects term sheets, analyzes regulatory hurdles, and evaluates the post-merger integration challenges to determine the true value creation potential of transformative corporate events.',
    projects: [
      { title: 'Big Tech Anti-Trust Scrutiny', type: 'Deal Analysis', status: 'Publishing Soon' },
      { title: 'Energy Sector Consolidation', type: 'Sector Report', status: 'Drafting' }
    ]
  },
  'quantitative-research': {
    name: 'Quantitative Research',
    icon: Calculator,
    description: 'Developing data-driven trading strategies, factor models, and algorithmic frameworks to identify market inefficiencies and optimize portfolio allocation.',
    focus: 'Algorithmic & Factor Modeling',
    overview: 'The Quantitative Research desk applies mathematical and statistical methods to financial markets. We develop sophisticated models to uncover market inefficiencies, backtest algorithmic trading strategies, and engineer risk management frameworks. Our research explores areas ranging from high-frequency statistical arbitrage to long-term factor-based portfolio construction methodologies.',
    projects: [
      { title: 'Machine Learning in Alpha Generation', type: 'Strategy Review', status: 'Drafting' },
      { title: 'Volatility Regime Modeling', type: 'Methodology Paper', status: 'Researching' }
    ]
  },
  'economic-research': {
    name: 'Economic Research',
    icon: Globe,
    description: 'Forecasting macroeconomic trends, central bank policy shifts, and geopolitical developments to provide a top-down view of global asset classes.',
    focus: 'Macro Trends & Policy',
    overview: 'The Economic Research desk offers a top-down perspective on global financial markets. We analyze macroeconomic indicators, interpret central bank rhetoric, and assess the impact of geopolitical events on international trade and capital flows. Our insights help contextualize market movements and provide the macroeconomic foundation required for strategic asset allocation decisions.',
    projects: [
      { title: 'Central Bank Rate Divergence', type: 'Policy Analysis', status: 'In Review' },
      { title: 'Emerging Markets Debt Dynamics', type: 'Thematic Note', status: 'Drafting' }
    ]
  }
};

export default async function DepartmentPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;
  const staticDept = DEPARTMENT_INFO[slug];

  if (!staticDept) {
    notFound();
  }

  // Map slug string to Prisma Enum
  const mapSlugToEnum = (s: string): DepartmentType => {
    switch (s) {
      case 'equity-research': return DepartmentType.EQUITY_RESEARCH;
      case 'm-and-a': return DepartmentType.MERGERS_ACQUISITIONS;
      case 'quantitative-research': return DepartmentType.QUANTITATIVE_FINANCE;
      case 'economic-research': return DepartmentType.ECONOMIC_RESEARCH;
      default: return DepartmentType.EQUITY_RESEARCH;
    }
  };

  const dbDepartment = mapSlugToEnum(slug);

  // Fetch everything simultaneously!
  const [teamMembers, publishedReports, metadata, projects] = await Promise.all([
    prisma.teamMember.findMany({
      where: { department: dbDepartment, status: 'ACTIVE' },
      orderBy: [
        { isLeadership: "desc" },
        { lastName: "asc" }
      ],
    }),
    prisma.report.findMany({
      where: { department: dbDepartment, status: 'PUBLISHED' },
      orderBy: { createdAt: "desc" }
    }),
    prisma.departmentMetadata.findUnique({ where: { department: dbDepartment } }),
    prisma.project.findMany({ where: { department: dbDepartment }, orderBy: { order: 'asc' } })
  ]);

  // Use DB metadata if available, fall back to static mockup data
  const deptData = {
    ...staticDept,
    name: (metadata as any)?.name || staticDept.name,
    description: (metadata as any)?.description || staticDept.description,
    focus: (metadata as any)?.focus || staticDept.focus,
    overview: (metadata as any)?.overview || staticDept.overview,
    projects: projects.length > 0 ? projects : staticDept.projects
  };

  const deptStyle = DEPT_COLORS[deptData.name] || DEPT_COLORS[staticDept.name] || { bg: '#bfc5ca', text: '#fff' };
  
  // Dynamic Icon Selection
  let iconName = (metadata as any)?.iconName;
  if (iconName) {
    iconName = iconName.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  }
  const Icons = await import('lucide-react');
  const Icon = (Icons as Record<string, any>)[iconName] || staticDept.icon || Icons.FileText;

  return (
    <div className="min-h-screen bg-surrey-light flex flex-col">
      <section className="bg-surrey-blue pt-20 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
          <Link 
            href="/departments" 
            className="inline-flex items-center text-gray-400 hover:text-white font-medium transition-colors mb-8 group self-start sm:self-center"
          >
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Back to All Desks
          </Link>

          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
            style={{ backgroundColor: deptStyle.bg }}
          >
            <Icon size={32} className="text-white" />
          </div>

          <span className="inline-block px-4 py-1.5 mb-4 rounded-full text-xs font-bold tracking-widest uppercase bg-white/10 text-white border border-white/20">
            Research Desk
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            {deptData.name}
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10">
            {deptData.description}
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-12 py-6 border-t border-white/10 w-full max-w-3xl">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white mb-1">{publishedReports.length}</span>
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Published Reports</span>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white mb-1">{teamMembers.length}</span>
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Active Analysts</span>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-white mb-1 pt-1.5">{deptData.focus}</span>
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Core Focus</span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </section>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <Target size={24} style={{ color: deptStyle.bg }} />
              <h2 className="text-2xl font-bold text-surrey-blue">Desk Mandate</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <p className="text-body-text text-lg leading-relaxed">
                {deptData.overview}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
             <div className="flex items-center gap-3 mb-6">
              <Activity size={24} style={{ color: deptStyle.bg }} />
              <h2 className="text-2xl font-bold text-surrey-blue">Active Pipeline</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {deptData.projects.map((proj: any, idx: number) => (
                  <div key={idx} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h4 className="font-bold text-surrey-blue">{proj.title}</h4>
                      <span className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${proj.status === 'Drafting' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                          proj.status === 'In Review' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                          'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${proj.status === 'Drafting' ? 'bg-blue-600' : proj.status === 'In Review' ? 'bg-amber-600' : 'bg-emerald-600'}`}></span>
                        {proj.status}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 font-medium uppercase tracking-wider">
                      <FileText size={12} className="mr-1.5" /> {proj.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
            <Users size={24} style={{ color: deptStyle.bg }} />
            <h2 className="text-2xl font-bold text-surrey-blue">Desk Analysts</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {teamMembers.length > 0 ? (
              teamMembers.map((analyst) => {
                const initials = (analyst.firstName[0] + analyst.lastName[0]).toUpperCase();
                return (
                  <div key={analyst.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 relative overflow-hidden"
                      style={{ backgroundColor: deptStyle.bg }}
                    >
                      {analyst.imageUrl ? (
                        <Image src={analyst.imageUrl} alt={`${analyst.firstName} ${analyst.lastName}`} fill className="object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-surrey-blue leading-tight mb-1 truncate flex items-center gap-1">
                        {analyst.firstName} {analyst.lastName}
                        {analyst.isLeadership && (
                          <span title="Leadership Team" className="flex items-center">
                            <Shield size={12} className="text-surrey-gold shrink-0" />
                          </span>
                        )}
                      </h4>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">{analyst.role}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-8 text-center text-gray-400">
                No active analysts are currently assigned to this desk.
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
            <div className="flex items-center gap-3">
              <Clock size={24} style={{ color: deptStyle.bg }} />
              <h2 className="text-2xl font-bold text-surrey-blue">Recent Publications</h2>
            </div>
            <Link href="/publications" className="text-sm font-semibold text-gray-500 hover:text-surrey-blue transition-colors">
              View Global Library &rarr;
            </Link>
          </div>

          {publishedReports.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-surrey-blue font-bold text-lg mb-2">No publications yet.</p>
              <p className="text-gray-500">This desk is currently finalizing their upcoming reports.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 max-w-6xl mx-auto py-4">
              {publishedReports.map((p) => <ClientReportCard key={p.id} report={p} />)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}