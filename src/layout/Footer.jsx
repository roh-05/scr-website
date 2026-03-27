import { Link } from 'react-router-dom'
import { TrendingUp, Mail } from 'lucide-react'
import { LinkedInIcon } from '../components/LinkedInIcon'

const FOOTER_LINKS = {
  'Navigate': [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Departments', to: '/departments' },
    { label: 'Publications', to: '/publications' },
    { label: 'Alumni & Contact', to: '/alumni' },
  ],
  'Departments': [
    { label: 'Equity Research', to: '/departments/equity-research' },
    { label: 'M&A', to: '/departments/ma' },
    { label: 'Quantitative Finance', to: '/departments/quant' },
    { label: 'Economics', to: '/departments/economics' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#001848] text-white">
      {/* top section */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-[#FFD100] rounded-lg flex items-center justify-center">
              <TrendingUp size={18} className="text-[#002D72]" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-base tracking-wide">Surrey Capital Research</p>
              <p className="text-[#FFD100] text-[10px] font-semibold tracking-widest uppercase">
                Student-Led Financial Research
              </p>
            </div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            A student-run financial research organisation at the University of Surrey, producing
            high-quality reports spanning equity, M&A, quant, and macroeconomics.
          </p>
          <div className="flex gap-4 mt-6">
            <a
              href="https://www.linkedin.com/company/surrey-capital-research/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center
                         hover:bg-[#FFD100] hover:text-[#002D72] text-white/70 transition-all duration-200"
            >
              <LinkedInIcon size={16} />
            </a>
            <a
              href="mailto:info@surreycapitalresearch.com"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center
                         hover:bg-[#FFD100] hover:text-[#002D72] text-white/70 transition-all duration-200"
            >
              <Mail size={16} />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center
                         hover:bg-[#FFD100] hover:text-[#002D72] text-white/70 transition-all duration-200"
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.733-8.835L1.254 2.25H8.08l4.258 5.622 5.906-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title}>
            <h4 className="text-[#FFD100] font-semibold text-xs tracking-widest uppercase mb-4">
              {title}
            </h4>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-white/60 hover:text-white text-sm transition-colors duration-150"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* bottom bar */}
      <div className="border-t border-white/10 py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-white/40 text-xs">
          <p>© {new Date().getFullYear()} Surrey Capital Research. All rights reserved.</p>
          <p>University of Surrey · Guildford, GU2 7XH</p>
        </div>
      </div>
    </footer>
  )
}
