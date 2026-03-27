import { useParams, Link } from 'react-router-dom'
import { DEPARTMENTS } from './Departments'
import { ArrowLeft, CheckCircle, FileText, ChevronRight } from 'lucide-react'

export default function DepartmentDetail() {
  const { slug } = useParams()
  const dept = DEPARTMENTS.find((d) => d.slug === slug)

  if (!dept) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24">
        <h1 className="text-4xl font-bold text-[#002D72] mb-4">Department Not Found</h1>
        <p className="text-gray-500 mb-8">The department you're looking for doesn't exist.</p>
        <Link to="/departments" className="btn-primary" style={{ color: '#002D72', background: '#FFD100' }}>
          <ArrowLeft size={16} /> Back to Departments
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <section
        className="pt-32 pb-16 px-6"
        style={{ background: `linear-gradient(135deg, #001848 0%, ${dept.color} 100%)` }}
      >
        <div className="max-w-3xl mx-auto text-white">
          <Link
            to="/departments"
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={15} /> All Departments
          </Link>
          <span
            className="inline-block px-3 py-1 mb-4 rounded-full text-xs font-semibold
                       tracking-widest uppercase border"
            style={{ color: dept.accent, borderColor: `${dept.accent}50`, backgroundColor: `${dept.accent}15` }}
          >
            {dept.tagline}
          </span>
          <h1 className="text-5xl font-bold mb-5">{dept.name}</h1>
          <p className="text-white/75 text-lg leading-relaxed">{dept.description}</p>
        </div>
      </section>

      {/* Content */}
      <section className="section bg-white">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Highlights */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-[#002D72] mb-6">What We Cover</h2>
            <ul className="space-y-3">
              {dept.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <CheckCircle size={18} className="mt-0.5 shrink-0" style={{ color: dept.color }} />
                  <span className="text-gray-700 text-sm leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <h2 className="text-2xl font-bold text-[#002D72] mb-5">Recent Publications</h2>
              <div className="space-y-3">
                {dept.publications.map((p) => (
                  <div
                    key={p.title}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-200
                               hover:border-[#002D72]/30 hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={18} style={{ color: dept.color }} className="shrink-0" />
                      <div>
                        <p className="text-gray-900 font-semibold text-sm">{p.title}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{p.date}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 shrink-0" />
                  </div>
                ))}
              </div>
              <Link
                to="/publications"
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold"
                style={{ color: dept.color }}
              >
                See all publications <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div
              className="rounded-2xl p-6 text-white"
              style={{ background: `linear-gradient(135deg, ${dept.color}, ${dept.color}cc)` }}
            >
              <h3 className="font-bold text-base mb-3">Interested in joining?</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                Applications open each September. Follow us on LinkedIn for updates.
              </p>
              <a
                href="https://www.linkedin.com/company/surrey-capital-research/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !text-[#002D72] w-full justify-center"
              >
                Follow SCR
              </a>
            </div>

            <div className="card border border-gray-200">
              <h3 className="font-semibold text-[#002D72] mb-3 text-sm">The SCR Way</h3>
              {['Research-first culture', 'Peer review process', 'Real market data', 'Industry mentors'].map((s) => (
                <div key={s} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00A3AD]" />
                  <span className="text-gray-600 text-xs">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
