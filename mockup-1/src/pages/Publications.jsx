import { useState, useMemo } from 'react'
import { Search, Filter, FileText, Download, ExternalLink, X, Tag } from 'lucide-react'

// ── Mock data ─────────────────────────────────────────────────────────────────
const PUBLICATIONS = [
  {
    id: 1,
    title: 'UK Semiconductor Sector Outlook Q1 2025',
    department: 'Equity Research',
    date: '2025-03-10',
    authors: ['Priya Sharma', 'James Lee'],
    tags: ['Tech', 'FTSE', 'Semiconductors'],
    excerpt:
      'A comprehensive review of UK-listed semiconductor companies, supply-chain dynamics, and 12-month price targets for AMAT and ARM.',
    pdfUrl: '#',
    featured: true,
  },
  {
    id: 2,
    title: 'BOE Rate Path: Cutting Cycle Analysis',
    department: 'Economics',
    date: '2025-03-05',
    authors: ['Omar Hassan'],
    tags: ['Macro', 'Monetary Policy', 'UK'],
    excerpt:
      'Using Taylor Rule frameworks and market-implied paths to forecast the Bank of England\'s rate trajectory through 2025.',
    pdfUrl: '#',
    featured: false,
  },
  {
    id: 3,
    title: 'Momentum + Low-Vol Factor Combo: UK Backtest',
    department: 'Quantitative Finance',
    date: '2025-03-01',
    authors: ['Sophie Williams', 'David Park'],
    tags: ['Factor Models', 'UK Equities', 'Backtesting'],
    excerpt:
      'A Python-based backtest of a combined Momentum and Low-Volatility factor strategy on FTSE 350 constituents (2015–2024).',
    pdfUrl: '#',
    featured: true,
  },
  {
    id: 4,
    title: 'Microsoft–Activision: Two Years On',
    department: 'M&A Advisory',
    date: '2025-02-20',
    authors: ['Luca Bianchi'],
    tags: ['M&A', 'Gaming', 'Tech'],
    excerpt:
      'Post-merger integration review: examining synergy realisation, regulatory impact, and strategic implications for the gaming sector.',
    pdfUrl: '#',
    featured: false,
  },
  {
    id: 5,
    title: 'AstraZeneca: Buy Thesis & Price Target Update',
    department: 'Equity Research',
    date: '2025-02-14',
    authors: ['Priya Sharma'],
    tags: ['Pharma', 'FTSE 100', 'Equity Note'],
    excerpt:
      'DCF and EV/EBITDA-based valuation update for AZN following strong FY2024 results and pipeline expansion announcement.',
    pdfUrl: '#',
    featured: false,
  },
  {
    id: 6,
    title: 'UK Productivity Puzzle — A Decade Later',
    department: 'Economics',
    date: '2025-02-10',
    authors: ['Omar Hassan', 'Freya Thompson'],
    tags: ['Macro', 'Labour Economics', 'UK'],
    excerpt:
      'Revisiting the post-GFC UK productivity slowdown with updated ONS data and structural analysis of the hybrid work transition.',
    pdfUrl: '#',
    featured: false,
  },
  {
    id: 7,
    title: 'EV Consolidation Wave: Who\'s Next?',
    department: 'M&A Advisory',
    date: '2025-01-28',
    authors: ['Luca Bianchi', 'Aisha Koroma'],
    tags: ['M&A', 'Automotive', 'EV'],
    excerpt:
      'Identifying consolidation targets in the European and US EV space using precedent transaction multiples and strategic fit analysis.',
    pdfUrl: '#',
    featured: false,
  },
  {
    id: 8,
    title: 'ML Regime Detection for Asset Allocation',
    department: 'Quantitative Finance',
    date: '2025-01-15',
    authors: ['Sophie Williams'],
    tags: ['Machine Learning', 'Asset Allocation', 'Quant'],
    excerpt:
      'Applying Hidden Markov Models and K-Means clustering to identify bull/bear/neutral market regimes for dynamic allocation switching.',
    pdfUrl: '#',
    featured: false,
  },
]

const DEPARTMENTS = ['All', 'Equity Research', 'M&A Advisory', 'Quantitative Finance', 'Economics']

const DEPT_COLOR = {
  'Equity Research':    { bg: '#00205B', text: '#fff' },
  'M&A Advisory':       { bg: '#E4002B', text: '#fff' },
  'Quantitative Finance': { bg: '#B9975B', text: '#fff' },
  'Economics':          { bg: '#36454F', text: '#fff' },
}

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Publications() {
  const [query, setQuery] = useState('')
  const [activeDept, setActiveDept] = useState('All')

  const results = useMemo(() => {
    return PUBLICATIONS.filter((p) => {
      const matchesDept = activeDept === 'All' || p.department === activeDept
      const q = query.toLowerCase()
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.authors.some((a) => a.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.excerpt.toLowerCase().includes(q)
      return matchesDept && matchesQuery
    })
  }, [query, activeDept])

  return (
    <>
      {/* Header */}
      <section
        className="pt-32 pb-16 px-6"
        style={{ background: 'linear-gradient(135deg, #001438 0%, #00205B 100%)' }}
      >
        <div className="max-w-3xl mx-auto text-center text-white">
          <span className="inline-block px-3 py-1 mb-4 rounded-full text-xs font-semibold
                           tracking-widest uppercase bg-[#B9975B]/15 text-[#B9975B] border border-[#B9975B]/30">
            Research Library
          </span>
          <h1 className="text-5xl font-bold mb-5">Publications</h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Browse our archive of equity notes, macro outlooks, quant research, and M&A deal
            analyses — all authored by Surrey students.
          </p>
        </div>
      </section>

      {/* Controls */}
      <section className="bg-[#F2F2F2] border-b border-gray-200 sticky top-16 z-30 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, or tag…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl
                         bg-white focus:outline-none focus:ring-2 focus:ring-[#00205B]/30
                         focus:border-[#00205B] transition-all duration-200"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Dept filter pills */}
          <div className="flex flex-wrap gap-2">
            <Filter size={15} className="text-gray-400 mt-2 shrink-0" />
            {DEPARTMENTS.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDept(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150
                  ${activeDept === d
                    ? 'bg-[#00205B] text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#00205B]/40 hover:text-[#00205B]'
                  }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="section bg-white">
        <div className="container-xl">
          {/* result count */}
          <p className="text-gray-400 text-sm mb-6">
            Showing <span className="text-gray-700 font-semibold">{results.length}</span> of {PUBLICATIONS.length} reports
            {activeDept !== 'All' && <> in <span className="text-[#00205B] font-semibold">{activeDept}</span></>}
          </p>

          {/* Featured row */}
          {!query && activeDept === 'All' && (
            <div className="mb-10">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#B9975B] mb-4
                             flex items-center gap-2">
                <span className="w-6 h-0.5 bg-[#B9975B]" /> Featured Reports
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PUBLICATIONS.filter((p) => p.featured).map((p) => (
                  <ReportCard key={p.id} report={p} featured />
                ))}
              </div>
              <div className="border-t border-gray-100 mt-10 mb-6" />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4
                             flex items-center gap-2">
                <span className="w-6 h-0.5 bg-gray-300" /> All Reports
              </h2>
            </div>
          )}

          {results.length === 0 ? (
            <div className="text-center py-20">
              <FileText size={40} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No publications match your search.</p>
              <button
                onClick={() => { setQuery(''); setActiveDept('All') }}
                className="mt-4 text-[#00205B] text-sm font-semibold hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.map((p) => <ReportCard key={p.id} report={p} />)}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function ReportCard({ report: p, featured }) {
  const deptStyle = DEPT_COLOR[p.department] || { bg: '#6B7280', text: '#fff' }
  return (
    <div className={`card flex flex-col ${featured ? 'border-l-4' : ''}`}
         style={featured ? { borderLeftColor: deptStyle.bg } : {}}>
      {/* Dept badge */}
      <div className="flex items-start justify-between mb-3">
        <span
          className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
          style={{ backgroundColor: `${deptStyle.bg}18`, color: deptStyle.bg }}
        >
          {p.department}
        </span>
        <span className="text-gray-400 text-xs">{formatDate(p.date)}</span>
      </div>

      <div className="flex items-start gap-3 mb-3">
        <FileText size={18} className="shrink-0 mt-0.5" style={{ color: deptStyle.bg }} />
        <h3 className="text-gray-900 font-bold text-sm leading-snug">{p.title}</h3>
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mb-3 flex-1">{p.excerpt}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {p.tags.map((t) => (
          <span key={t}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium">
            <Tag size={9} /> {t}
          </span>
        ))}
      </div>

      <p className="text-gray-400 text-xs mb-4">
        By {p.authors.join(', ')}
      </p>

      {/* Actions */}
      <div className="flex gap-3 mt-auto">
        <a
          href={p.pdfUrl}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold
                     text-white transition-all duration-150 hover:opacity-90 hover:-translate-y-0.5"
          style={{ backgroundColor: deptStyle.bg }}
        >
          <Download size={13} /> Download PDF
        </a>
        <a
          href={p.pdfUrl}
          className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold
                     border border-gray-200 text-gray-600 hover:border-[#00205B]/40 hover:text-[#00205B]
                     transition-all duration-150"
        >
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  )
}
