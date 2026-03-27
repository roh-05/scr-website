import { useState } from 'react'
import { Mail, ExternalLink, Send, CheckCircle, User } from 'lucide-react'
import { LinkedInIcon } from '../components/LinkedInIcon'

// ── Alumni directory data ────────────────────────────────────────────────────
const ALUMNI = [
  {
    name: 'Emily Zhang',
    gradYear: '2024',
    role: 'Investment Banking Analyst',
    firm: 'Goldman Sachs',
    dept: 'Equity Research',
    linkedin: 'https://linkedin.com',
    initials: 'EZ',
    color: '#002D72',
  },
  {
    name: 'Kwame Asante',
    gradYear: '2023',
    role: 'Equity Research Associate',
    firm: 'Barclays Capital',
    dept: 'Equity Research',
    linkedin: 'https://linkedin.com',
    initials: 'KA',
    color: '#00A3AD',
  },
  {
    name: 'Isabelle Moreau',
    gradYear: '2024',
    role: 'M&A Analyst',
    firm: 'Rothschild & Co',
    dept: 'M&A Advisory',
    linkedin: 'https://linkedin.com',
    initials: 'IM',
    color: '#002D72',
  },
  {
    name: 'Rajan Patel',
    gradYear: '2023',
    role: 'Quant Analyst',
    firm: 'Man Group',
    dept: 'Quantitative Finance',
    linkedin: 'https://linkedin.com',
    initials: 'RP',
    color: '#4F46E5',
  },
  {
    name: 'Hannah Müller',
    gradYear: '2022',
    role: 'Macro Economist',
    firm: 'Bank of England',
    dept: 'Economics',
    linkedin: 'https://linkedin.com',
    initials: 'HM',
    color: '#059669',
  },
  {
    name: 'Tyler Brooks',
    gradYear: '2022',
    role: 'Portfolio Manager',
    firm: 'BlackRock',
    dept: 'Quantitative Finance',
    linkedin: 'https://linkedin.com',
    initials: 'TB',
    color: '#4F46E5',
  },
]

const DEPT_FILTERS = ['All', 'Equity Research', 'M&A Advisory', 'Quantitative Finance', 'Economics']

export default function Alumni() {
  const [filter, setFilter]     = useState('All')
  const [form, setForm]         = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]   = useState(false)

  const displayed = ALUMNI.filter((a) => filter === 'All' || a.dept === filter)

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate async send — replace with your backend/Formspree endpoint
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <>
      {/* Header */}
      <section
        className="pt-32 pb-16 px-6"
        style={{ background: 'linear-gradient(135deg, #001848 0%, #002D72 100%)' }}
      >
        <div className="max-w-3xl mx-auto text-center text-white">
          <span className="inline-block px-3 py-1 mb-4 rounded-full text-xs font-semibold
                           tracking-widest uppercase bg-[#FFD100]/15 text-[#FFD100] border border-[#FFD100]/30">
            Our Network
          </span>
          <h1 className="text-5xl font-bold mb-5">Alumni &amp; Contact</h1>
          <p className="text-white/70 text-lg leading-relaxed">
            SCR alumni have gone on to top roles in investment banking, asset management, and economic
            research. Reach out or browse the directory below.
          </p>
        </div>
      </section>

      {/* Alumni Directory */}
      <section className="section bg-white">
        <div className="container-xl">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h2 className="text-3xl font-bold text-[#002D72]">Alumni Directory</h2>
            {/* filter pills */}
            <div className="flex flex-wrap gap-2">
              {DEPT_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150
                    ${filter === f
                      ? 'bg-[#002D72] text-white shadow'
                      : 'bg-[#F2F2F2] text-gray-600 hover:text-[#002D72]'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((a) => (
              <div key={a.name} className="card flex items-start gap-4">
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white
                               font-bold text-sm shrink-0 shadow-md"
                  style={{ background: `linear-gradient(135deg, ${a.color}, ${a.color}99)` }}
                >
                  {a.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{a.name}</p>
                  <p className="text-xs text-[#002D72] font-semibold mt-0.5 truncate">{a.role}</p>
                  <p className="text-xs text-gray-500 truncate">{a.firm} · Class of {a.gradYear}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${a.color}15`, color: a.color }}
                    >
                      {a.dept}
                    </span>
                    <a
                      href={a.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0077B5] hover:text-[#002D72] transition-colors"
                    >
                      <LinkedInIcon size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact + LinkedIn */}
      <section className="section bg-[#F2F2F2]">
        <div className="container-xl grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact form */}
          <div>
            <h2 className="text-3xl font-bold text-[#002D72] mb-2">Get in Touch</h2>
            <p className="text-gray-500 text-sm mb-8">
              Whether you're a prospective member, an organisation wanting to partner, or an alumnus
              reconnecting — we'd love to hear from you.
            </p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-8
                              bg-white rounded-2xl border border-green-100 shadow-sm">
                <CheckCircle size={48} className="text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm">
                  Thanks for reaching out. We aim to respond within 48 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  className="mt-6 text-[#002D72] text-sm font-semibold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-[#002D72]/25 focus:border-[#002D72]
                                 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@surrey.ac.uk"
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-[#002D72]/25 focus:border-[#002D72]
                                 transition-all duration-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Subject
                  </label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="e.g. Partnership Enquiry"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-[#002D72]/25 focus:border-[#002D72]
                               transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us how we can help…"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl resize-none
                               focus:outline-none focus:ring-2 focus:ring-[#002D72]/25 focus:border-[#002D72]
                               transition-all duration-200"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ color: '#002D72', background: '#FFD100' }}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#002D72]/30 border-t-[#002D72] rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <><Send size={15} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Connect panel */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#002D72]">Connect with Us</h2>
            <p className="text-gray-500 text-sm">
              Stay up to date with our latest research, events, and recruitment cycles.
            </p>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/surrey-capital-research/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-200
                         hover:border-[#0077B5]/40 hover:shadow-lg group transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0077B5] flex items-center justify-center text-white shrink-0">
                <LinkedInIcon size={22} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 group-hover:text-[#0077B5] transition-colors">LinkedIn</p>
                <p className="text-gray-500 text-xs">@surrey-capital-research · Follow for updates</p>
              </div>
              <ExternalLink size={15} className="text-gray-300 group-hover:text-[#0077B5] transition-colors" />
            </a>

            {/* Email */}
            <a
              href="mailto:info@surreycapitalresearch.com"
              className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-200
                         hover:border-[#002D72]/40 hover:shadow-lg group transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-[#002D72] flex items-center justify-center text-white shrink-0">
                <Mail size={22} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 group-hover:text-[#002D72] transition-colors">Email</p>
                <p className="text-gray-500 text-xs">info@surreycapitalresearch.com</p>
              </div>
              <ExternalLink size={15} className="text-gray-300 group-hover:text-[#002D72] transition-colors" />
            </a>

            {/* Alumni note */}
            <div className="rounded-2xl bg-[#002D72] text-white p-6">
              <User size={22} className="text-[#FFD100] mb-3" />
              <h3 className="font-bold text-lg mb-2">Are you an SCR Alumnus?</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                If you graduated from SCR and aren't listed in our directory, we'd love to add you.
                Send us your LinkedIn and we'll get you featured.
              </p>
              <a href="mailto:alumni@surreycapitalresearch.com" className="btn-primary !text-[#002D72]">
                <Mail size={14} /> Submit Your Profile
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
