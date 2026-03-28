import { useState } from 'react'
import { ChevronDown, ChevronUp, Mail } from 'lucide-react'
import { LinkedInIcon } from '../components/LinkedInIcon'

const TEAM = [
  {
    name: 'Alexandra Chen',
    role: 'President',
    dept: 'Equity Research',
    year: '3rd Year, Finance',
    linkedin: 'https://linkedin.com',
    initials: 'AC',
    color: '#00205B',
  },
  {
    name: 'James Okafor',
    role: 'VP, Research',
    dept: 'Quantitative Finance',
    year: '3rd Year, Maths & Economics',
    linkedin: 'https://linkedin.com',
    initials: 'JO',
    color: '#E4002B',
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Equity',
    dept: 'Equity Research',
    year: '2nd Year, Finance',
    linkedin: 'https://linkedin.com',
    initials: 'PS',
    color: '#00205B',
  },
  {
    name: 'Luca Bianchi',
    role: 'Head of M&A',
    dept: 'M&A Advisory',
    year: '3rd Year, Economics',
    linkedin: 'https://linkedin.com',
    initials: 'LB',
    color: '#E4002B',
  },
  {
    name: 'Sophie Williams',
    role: 'Head of Quant',
    dept: 'Quantitative Finance',
    year: '3rd Year, Mathematics',
    linkedin: 'https://linkedin.com',
    initials: 'SW',
    color: '#00205B',
  },
  {
    name: 'Omar Hassan',
    role: 'Head of Economics',
    dept: 'Economics',
    year: '2nd Year, Economics',
    linkedin: 'https://linkedin.com',
    initials: 'OH',
    color: '#E4002B',
  },
]

const FAQS = [
  {
    q: 'Who can join Surrey Capital Research?',
    a: 'Any University of Surrey student, regardless of degree, is welcome to apply. We value curiosity and drive above all — no prior finance experience is required.',
  },
  {
    q: 'When does recruitment open?',
    a: 'We run recruitment at the start of each academic year (typically September/October). Follow our LinkedIn for announcements and application deadlines.',
  },
  {
    q: 'What commitment is expected?',
    a: 'Members typically spend 3–5 hours per week on research, writing, and team meetings. Department heads may commit slightly more.',
  },
  {
    q: 'Are your publications peer-reviewed?',
    a: 'Each report goes through multiple rounds of internal review by senior analysts and is fact-checked before publication.',
  },
  {
    q: 'Can alumni remain involved?',
    a: 'Absolutely. Many alumni mentor current members, speak at events, or contribute to our Alumni Network directory.',
  },
  {
    q: 'Do you offer certifications or credit?',
    a: 'SCR is an extracurricular society. While we do not offer academic credit, membership significantly strengthens CVs and interview performance.',
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 ${open ? 'shadow-md' : ''}`}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-[#00205B] text-sm">{q}</span>
        {open ? <ChevronUp size={18} className="text-[#E4002B] shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
          {a}
        </div>
      )}
    </div>
  )
}

export default function About() {
  return (
    <>
      {/* Page header */}
      <section
        className="pt-32 pb-16 px-6"
        style={{ background: 'linear-gradient(135deg, #001438 0%, #00205B 100%)' }}
      >
        <div className="max-w-3xl mx-auto text-center text-white">
          <span className="inline-block px-3 py-1 mb-4 rounded-full text-xs font-semibold
                           tracking-widest uppercase bg-[#B9975B]/15 text-[#B9975B] border border-[#B9975B]/30">
            About SCR
          </span>
          <h1 className="text-5xl font-bold mb-5">Meet the Team</h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Led by passionate students from across the University of Surrey, our leadership
            drives research quality across four specialist departments.
          </p>
        </div>
      </section>

      {/* Leadership grid */}
      <section className="section bg-white">
        <div className="container-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM.map((m) => (
              <div key={m.name} className="card group text-center">
                {/* Avatar */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center
                               text-2xl font-bold text-white mx-auto mb-4 shadow-lg
                               group-hover:scale-105 transition-transform duration-200"
                  style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}99)` }}
                >
                  {m.initials}
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{m.name}</h3>
                <p className="text-[#00205B] font-semibold text-sm mt-0.5">{m.role}</p>
                <p className="text-[#E4002B] text-xs mt-0.5 font-medium">{m.dept}</p>
                <p className="text-gray-400 text-xs mt-1">{m.year}</p>
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold
                             text-[#0077B5] hover:text-[#00205B] transition-colors duration-150"
                >
                  <LinkedInIcon size={13} /> LinkedIn
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-[#F2F2F2]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 mb-3 rounded-full text-xs font-semibold
                             tracking-widest uppercase bg-[#00205B]/10 text-[#00205B]">
              FAQ
            </span>
            <h2 className="text-3xl font-bold text-[#00205B]">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f) => <FAQItem key={f.q} {...f} />)}
          </div>

          <div className="mt-12 rounded-2xl bg-[#00205B] text-white p-8 text-center">
            <Mail size={28} className="mx-auto mb-3 text-[#B9975B]" />
            <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-white/70 text-sm mb-5">Drop us a message and we'll get back to you within 48 hours.</p>
            <a href="mailto:info@surreycapitalresearch.com" className="btn-primary">
              Email Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
