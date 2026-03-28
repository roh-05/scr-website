import { Link } from 'react-router-dom'
import {
  ArrowRight, TrendingUp, BookOpen, Users, BarChart2,
  ChevronRight, Award, Globe
} from 'lucide-react'
import { LinkedInIcon } from '../components/LinkedInIcon'

const STATS = [
  { value: '4',    label: 'Departments' },
  { value: '50+',  label: 'Active Members' },
  { value: '20+',  label: 'Publications' },
  { value: '3rd',  label: 'Year Running' },
]

const DEPT_CARDS = [
  {
    icon: TrendingUp,
    title: 'Equity Research',
    desc: 'Deep-dive stock analyses, DCF models, and sector trackers.',
    slug: 'equity-research',
    color: '#00205B',
  },
  {
    icon: Globe,
    title: 'M&A Advisory',
    desc: 'Deal structuring, valuation frameworks, and case studies.',
    slug: 'ma',
    color: '#E4002B',
  },
  {
    icon: BarChart2,
    title: 'Quantitative Finance',
    desc: 'Factor models, algorithmic strategies, and backtesting.',
    slug: 'quant',
    color: '#00205B',
  },
  {
    icon: BookOpen,
    title: 'Economics',
    desc: 'Macro outlooks, policy analysis, and empirical research.',
    slug: 'economics',
    color: '#E4002B',
  },
]

// ── LinkedIn post placeholder data ─────────────────────────────
const LI_POSTS = [
  {
    id: 1,
    date: 'Mar 2025',
    title: 'SCR publishes Q1 UK Equity Outlook',
    excerpt:
      'Our Equity Research team releases a comprehensive review of FTSE 100 sector performance…',
    link: 'https://linkedin.com',
  },
  {
    id: 2,
    date: 'Feb 2025',
    title: 'Recruitment open for 2025 cohort',
    excerpt:
      'Applications are now open for our five flagship departments. Join 50+ students…',
    link: 'https://linkedin.com',
  },
  {
    id: 3,
    date: 'Jan 2025',
    title: 'Alumni Spotlight: From SCR to Goldman Sachs',
    excerpt:
      'We caught up with a former head of Equity Research now at GS IBD London…',
    link: 'https://linkedin.com',
  },
]

export default function Home() {
  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #001438 0%, #00205B 55%, #002d7a 100%)',
        }}
        className="relative min-h-screen flex items-center overflow-hidden pt-16"
      >
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Gold accent blob */}
        <div
          className="absolute top-20 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #B9975B, transparent)' }}
        />
        <div
          className="absolute bottom-10 left-20 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #E4002B, transparent)' }}
        />

        <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left copy */}
          <div>
            <span className="inline-block px-3 py-1 mb-6 rounded-full text-xs font-semibold tracking-widest uppercase
                             bg-[#B9975B]/15 text-[#B9975B] border border-[#B9975B]/30 animate-fade-in-up">
              Student-Led · University of Surrey
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 animate-fade-in-up delay-100">
              Research-Driven<br />
              <span style={{ color: '#B9975B' }}>Financial Insight.</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-lg animate-fade-in-up delay-200">
              Surrey Capital Research is a student-run organisation producing Bloomberg-quality
              analysis in Equity Research, M&A, Quantitative Finance, and Macroeconomics.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up delay-300">
              <Link to="/publications" className="btn-primary">
                Read Our Reports <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="btn-outline">
                Meet the Team
              </Link>
            </div>

            {/* Stats strip */}
            <div className="mt-14 grid grid-cols-4 gap-4 animate-fade-in-up delay-300">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-[#B9975B] text-3xl font-bold">{s.value}</p>
                  <p className="text-white/50 text-xs mt-1 uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: dept cards mini-grid */}
          <div className="grid grid-cols-2 gap-4">
            {DEPT_CARDS.map((d) => (
              <Link
                key={d.slug}
                to={`/departments/${d.slug}`}
                className="group bg-white/5 border border-white/10 rounded-2xl p-5
                           hover:bg-white/10 hover:border-[#B9975B]/40 transition-all duration-300"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${d.color}60` }}
                >
                  <d.icon size={20} className="text-[#B9975B]" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{d.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{d.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-[#B9975B] text-xs font-medium
                                opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Learn more <ChevronRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT TEASER ──────────────────────────────────────── */}
      <section className="section bg-[#F2F2F2]">
        <div className="container-xl text-center">
          <span className="inline-block px-3 py-1 mb-4 rounded-full text-xs font-semibold
                           tracking-widest uppercase bg-[#00205B]/10 text-[#00205B]">
            Our Mission
          </span>
          <h2 className="text-4xl font-bold text-[#00205B] mb-5">
            Bridging the Gap Between<br />Academia &amp; Markets
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            We equip University of Surrey students with real-world financial skills through
            collaborative research, mentorship from industry professionals, and a culture of
            intellectual curiosity.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {[
              { icon: Award,   text: 'Industry-standard research methodology' },
              { icon: Users,   text: 'Cross-departmental collaboration' },
              { icon: BookOpen, text: 'Open-access publications' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                <Icon size={18} className="text-[#E4002B]" />
                {text}
              </div>
            ))}
          </div>
          <Link to="/about" className="btn-primary" style={{ color: '#00205B', background: '#B9975B' }}>
            Learn About SCR <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── LINKEDIN FEED PLACEHOLDER ─────────────────────────── */}
      <section className="section bg-white">
        <div className="container-xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="inline-block px-3 py-1 mb-3 rounded-full text-xs font-semibold
                               tracking-widest uppercase bg-[#0077B5]/10 text-[#0077B5]">
                Latest on LinkedIn
              </span>
              <h2 className="text-3xl font-bold text-[#00205B]">News &amp; Updates</h2>
            </div>
            <a
              href="https://www.linkedin.com/company/surrey-capital-research/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-[#0077B5] hover:underline"
            >
              <LinkedInIcon size={16} /> Follow on LinkedIn
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LI_POSTS.map((post) => (
              <a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="card group"
              >
                {/* Shimmer header mimicking LinkedIn card */}
                <div className="h-2 w-16 rounded-full bg-[#0077B5] mb-4 opacity-70" />
                <p className="text-[#00205B] text-xs font-semibold uppercase tracking-wide mb-2">
                  {post.date}
                </p>
                <h3 className="text-gray-900 font-semibold text-base mb-2 leading-snug
                               group-hover:text-[#00205B] transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>
                <div className="mt-4 flex items-center gap-1 text-[#0077B5] text-sm font-medium">
                  Read on LinkedIn <ChevronRight size={14} />
                </div>
              </a>
            ))}
          </div>

          {/* Placeholder banner for future embed */}
          <div className="mt-8 rounded-2xl border-2 border-dashed border-[#0077B5]/30
                          bg-[#0077B5]/5 p-8 text-center text-[#0077B5]/60 text-sm">
            <LinkedInIcon size={28} className="mx-auto mb-2 opacity-50" />
            LinkedIn feed widget will be embedded here once the page is published and the LinkedIn
            Company Page is verified.
          </div>
        </div>
      </section>

      {/* ── JOIN CTA ──────────────────────────────────────────── */}
      <section
        className="section"
        style={{ background: 'linear-gradient(135deg, #00205B 0%, #E4002B 100%)' }}
      >
        <div className="container-xl text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Join SCR?</h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Applications open every September. Follow us on LinkedIn to be the first to know.
          </p>
          <a
            href="https://www.linkedin.com/company/surrey-capital-research/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <LinkedInIcon size={17} /> Follow on LinkedIn
          </a>
        </div>
      </section>
    </>
  )
}
