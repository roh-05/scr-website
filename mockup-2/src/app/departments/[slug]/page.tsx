"use client";

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  ArrowLeft, FileText, Users, TrendingUp, LineChart, 
  Briefcase, Calculator, Globe, Target, Clock, Activity 
} from 'lucide-react';

import { DEPT_COLORS } from '@/lib/constants';
import PUBLICATIONS from '@/data/publications.json';

// Dynamically import the PdfCover to prevent server crashes
const PdfCover = dynamic(() => import('@/components/PdfCover'), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gray-50 animate-pulse flex items-center justify-center text-gray-300"><FileText size={48} /></div>
});

// ── RICH DEPARTMENT METADATA (LOREM IPSUM VERSION) ──
const DEPARTMENT_INFO: Record<string, any> = {
  'equity-research': {
    name: 'Equity Research',
    icon: TrendingUp,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    focus: 'Fundamental Analysis & Valuation',
    overview: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    analysts: [
      { name: 'Ibrahim Elahi', role: 'Desk Head & Editor' },
      { name: 'Evangeline Phillips', role: 'Senior Editor' },
      { name: 'Tarun Mani Vannan', role: 'Senior Analyst' },
      { name: 'Sammy Abbasi', role: 'Analyst' },
      { name: 'Najiib Abdullaahi', role: 'Analyst' },
      { name: 'Jonathan Iyere', role: 'Analyst' },
      { name: 'Piotr Ambrozewski', role: 'Analyst' },
      { name: 'Val Motigin', role: 'Analyst' }
    ],
    projects: [
      { title: 'Lorem Ipsum Dolor Sit', type: 'Sector Initiation', status: 'Drafting' },
      { title: 'Consectetur Adipiscing Elit', type: 'Deep Dive', status: 'In Review' },
      { title: 'Sed Do Eiusmod Tempor', type: 'Coverage Initiation', status: 'Researching' }
    ]
  },
  'm-and-a': {
    name: 'M&A',
    icon: Briefcase,
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    focus: 'Deal Mechanics & Strategy',
    overview: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    analysts: [
      { name: 'Luca Bianchi', role: 'Desk Head' },
      { name: 'Sarah Jenkins', role: 'Senior Analyst' },
      { name: 'David Chen', role: 'Analyst' },
      { name: 'Amira Tariq', role: 'Analyst' }
    ],
    projects: [
      { title: 'Magni Dolores Eos Qui', type: 'Deal Analysis', status: 'Publishing Soon' },
      { title: 'Ratione Voluptatem Sequi', type: 'Sector Report', status: 'Drafting' }
    ]
  },
  'quantitative-research': {
    name: 'Quantitative Research',
    icon: Calculator,
    description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.',
    focus: 'Algorithmic & Factor Modeling',
    overview: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    analysts: [
      { name: 'Dr. James Lee', role: 'Faculty Advisor' },
      { name: 'Elena Rostova', role: 'Lead Quant' },
      { name: 'Michael O\'Connor', role: 'Data Scientist' }
    ],
    projects: [
      { title: 'Et Harum Quidem Rerum', type: 'Strategy Review', status: 'Drafting' },
      { title: 'Facilis Est Et Expedita', type: 'Methodology Paper', status: 'Researching' }
    ]
  },
  'economic-research': {
    name: 'Economic Research',
    icon: Globe,
    description: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.',
    focus: 'Macro Trends & Policy',
    overview: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
    analysts: [
      { name: 'Priya Sharma', role: 'Chief Economist' },
      { name: 'Tom Baker', role: 'Macro Strategist' },
      { name: 'Chloe Dubois', role: 'Analyst' }
    ],
    projects: [
      { title: 'Itaque Earum Rerum Hic', type: 'Policy Analysis', status: 'In Review' },
      { title: 'Tenetur A Sapiente Delectus', type: 'Thematic Note', status: 'Drafting' }
    ]
  }
};

export default function DepartmentPage() {
  const params = useParams();
  const router = useRouter();
  
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const deptData = DEPARTMENT_INFO[slug];

  if (!deptData) {
    return (
      <div className="min-h-screen bg-surrey-light flex flex-col items-center justify-center px-6">
        <Users size={64} className="text-gray-300 mb-6" />
        <h1 className="text-3xl font-bold text-surrey-blue mb-4">Department Not Found</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">The desk you are looking for does not exist or has been renamed.</p>
        <button 
          onClick={() => router.push('/departments')}
          className="bg-surrey-blue text-white px-8 py-3 rounded-md font-semibold hover:bg-[#2a3c50] transition-colors"
        >
          View All Desks
        </button>
      </div>
    );
  }

  const departmentReports = useMemo(() => {
    return PUBLICATIONS.filter((p) => p.department === deptData.name);
  }, [deptData.name]);

  const deptStyle = DEPT_COLORS[deptData.name] || { bg: '#bfc5ca', text: '#fff' };
  const Icon = deptData.icon;

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
              <span className="text-3xl font-bold text-white mb-1">{departmentReports.length}</span>
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Published Reports</span>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white mb-1">{deptData.analysts.length}</span>
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
              <p className="text-gray-600 text-lg leading-relaxed">
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
            {deptData.analysts.map((analyst: any, idx: number) => {
              const initials = analyst.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2);
              return (
                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:border-gray-300 transition-colors">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                    style={{ backgroundColor: deptStyle.bg }}
                  >
                    {initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-surrey-blue leading-tight mb-1">{analyst.name}</h4>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{analyst.role}</p>
                  </div>
                </div>
              );
            })}
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

          {departmentReports.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-surrey-blue font-bold text-lg mb-2">No publications yet.</p>
              <p className="text-gray-500">This desk is currently finalizing their upcoming reports.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 max-w-6xl mx-auto py-4">
              {departmentReports.map((p) => <ReportCard key={p.id} report={p} />)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ReportCard({ report: p }: { report: any }) {
  return (
    <Link 
      href={`/publications/${p.id}`}
      className="block w-full transition-transform duration-500 hover:-translate-y-2 focus:outline-none group"
      aria-label={`View ${p.title}`}
    >
      <div className="relative w-full aspect-[210/297] bg-white border border-gray-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-500 flex items-center justify-center overflow-hidden">
        <PdfCover pdfUrl={p.pdfUrl} title={p.title} />
      </div>
    </Link>
  );
}