import { Link } from 'react-router-dom'
import { TrendingUp, Globe, BarChart2, BookOpen, ArrowRight } from 'lucide-react'

export const DEPARTMENTS = [
  {
    slug: 'equity-research',
    name: 'Equity Research',
    tagline: 'Stock Analysis · Sector Coverage · DCF Modelling',
    description:
      'Our Equity Research department produces institutional-quality stock pitches with fundamental valuation models, qualitative business analysis, and forward-looking sector outlooks. Think Goldman Sachs initiation reports — but student-authored.',
    icon: TrendingUp,
    color: '#00205B',
    accent: '#B9975B',
    highlights: [
      'Weekly stock analysis with DCF & comparable company models',
      'Coverage of FTSE 100, S&P 500, and emerging markets',
      'Sector rotation strategy reports',
      'Monthly portfolio mock competition',
    ],
    publications: [
      { title: 'UK Semiconductor Sector Outlook Q1 2025', date: 'Mar 2025' },
      { title: 'AstraZeneca: Buy Thesis & Price Target Update', date: 'Feb 2025' },
    ],
  },
  {
    slug: 'ma',
    name: 'Mergers & Acquisitions',
    tagline: 'Deal Analysis · Valuation · LBO Modelling',
    description:
      'The M&A department analyses live and announced transactions, building LBO models and synergy analyses that mirror the work of investment banking analysts. Members develop skills directly applicable to internship and graduate roles in IBD.',
    icon: Globe,
    color: '#E4002B',
    accent: '#B9975B',
    highlights: [
      'Live deal tear-sheets and strategic rationale breakdowns',
      'LBO modelling and accretion/dilution analysis',
      'Post-merger integration case studies',
      'Regulatory and antitrust research',
    ],
    publications: [
      { title: 'Microsoft–Activision: Two Years On', date: 'Feb 2025' },
      { title: "EV Consolidation Wave: Who's Next?", date: 'Jan 2025' },
    ],
  },
  {
    slug: 'quant',
    name: 'Quantitative Finance',
    tagline: 'Factor Models · Algo Strategies · Backtesting',
    description:
      'From statistical factor models to Python-based systematic strategies, the Quant department bridges mathematics and markets. Members collaborate on backtested portfolios, derivatives pricing, and machine-learning applications in finance.',
    icon: BarChart2,
    color: '#00205B',
    accent: '#E4002B',
    highlights: [
      'Multi-factor equity model (Value, Momentum, Quality)',
      'Options pricing with Black-Scholes and Monte Carlo',
      'Backtesting framework in Python (Backtrader)',
      'Crypto microstructure and liquidity research',
    ],
    publications: [
      { title: 'Momentum + Low-Vol Factor Combo: UK Backtest', date: 'Mar 2025' },
      { title: 'ML Regime Detection for Asset Allocation', date: 'Jan 2025' },
    ],
  },
  {
    slug: 'economics',
    name: 'Economics',
    tagline: 'Macro Analysis · Policy Research · Empirical Studies',
    description:
      'The Economics department produces rigorous macroeconomic research covering monetary policy, global trade dynamics, and empirical data analysis. Reports are written with Bloomberg-style clarity and academic rigour.',
    icon: BookOpen,
    color: '#E4002B',
    accent: '#B9975B',
    highlights: [
      'UK & EU monetary policy tracker',
      'Inflation regime analysis (CPI, PPI, PCE)',
      'EM capital flows and currency risk reports',
      'Labour market dynamics and productivity research',
    ],
    publications: [
      { title: 'BOE Rate Path: Cutting Cycle Analysis', date: 'Mar 2025' },
      { title: 'UK Productivity Puzzle — A Decade Later', date: 'Feb 2025' },
    ],
  },
]

export default function Departments() {
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
            Our Departments
          </span>
          <h1 className="text-5xl font-bold mb-5">Four Areas of Expertise</h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Each department operates independently with its own analysts, editors, and portfolio of
            published research — all under the SCR umbrella.
          </p>
        </div>
      </section>

      {/* Department cards */}
      <section className="section bg-white">
        <div className="container-xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {DEPARTMENTS.map((d) => (
            <Link
              key={d.slug}
              to={`/departments/${d.slug}`}
              className="card group overflow-hidden relative"
            >
              {/* colour bar */}
              <div
                className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, ${d.color}, ${d.accent})` }}
              />
              <div className="flex items-start gap-4 pt-2">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
                  style={{ backgroundColor: `${d.color}18` }}
                >
                  <d.icon size={24} style={{ color: d.color }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#00205B] transition-colors">
                    {d.name}
                  </h2>
                  <p className="text-xs text-[#E4002B] font-semibold tracking-wide mt-0.5">{d.tagline}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mt-4">{d.description}</p>
              <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold"
                   style={{ color: d.color }}>
                View department <ArrowRight size={15} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
