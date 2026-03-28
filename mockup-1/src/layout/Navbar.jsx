import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, TrendingUp, ChevronDown } from 'lucide-react'
import { LinkedInIcon } from '../components/LinkedInIcon'

const NAV_LINKS = [
  { label: 'Home',         to: '/' },
  { label: 'About',        to: '/about' },
  {
    label: 'Departments',
    to: '/departments',
    children: [
      { label: 'Equity Research', to: '/departments/equity-research' },
      { label: 'Mergers & Acquisitions', to: '/departments/ma' },
      { label: 'Quantitative Finance', to: '/departments/quant' },
      { label: 'Economics',        to: '/departments/economics' },
    ],
  },
  { label: 'Publications',  to: '/publications' },
  { label: 'Alumni & Contact', to: '/alumni' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [dropOpen, setDropOpen]     = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors duration-200 px-1 py-0.5
     after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left
     after:scale-x-0 after:transition-transform after:duration-200 after:bg-[#B9975B]
     hover:after:scale-x-100
     ${isActive ? 'text-[#B9975B] after:scale-x-100' : 'text-white/85 hover:text-white'}`

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled ? 'bg-[#00205B] shadow-xl shadow-black/30' : 'bg-[#00205B]'}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-[#B9975B] rounded-lg flex items-center justify-center
                            shadow-md group-hover:scale-110 transition-transform duration-200">
              <TrendingUp size={16} className="text-[#00205B]" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <p className="text-white font-bold text-sm tracking-wide">Surrey Capital</p>
              <p className="text-[#B9975B] text-[10px] font-semibold tracking-widest uppercase">Research</p>
            </div>
          </Link>


          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    onClick={() => setDropOpen((p) => !p)}
                    onBlur={() => setTimeout(() => setDropOpen(false), 150)}
                    className="flex items-center gap-1 text-sm font-medium text-white/85 hover:text-white
                               transition-colors duration-200 cursor-pointer"
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {dropOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56
                                    bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                      {link.children.map((child) => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          onClick={() => setDropOpen(false)}
                          className={({ isActive }) =>
                            `block px-5 py-3 text-sm font-medium transition-colors duration-150
                             ${isActive
                               ? 'bg-[#00205B] text-white'
                               : 'text-gray-700 hover:bg-[#F5F5F5] hover:text-[#00205B]'}`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
                  {link.label}
                </NavLink>
              )
            )}
          </nav>

          {/* ── CTA ── */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://www.linkedin.com/company/surrey-capital-research/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !py-2 !px-4 !text-xs"
            >
              Join SCR
            </a>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="md:hidden p-2 text-white hover:text-[#B9975B] transition-colors"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="md:hidden bg-[#001d52] border-t border-white/10">
          <nav className="flex flex-col py-4 px-6 gap-1">
            {NAV_LINKS.flatMap((link) =>
              link.children
                ? link.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block py-2 px-3 rounded-lg text-sm font-medium transition-colors
                         ${isActive ? 'bg-[#B9975B]/10 text-[#B9975B]' : 'text-white/80 hover:text-white hover:bg-white/5'}`
                      }
                    >
                      ↳ {child.label}
                    </NavLink>
                  ))
                : [
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === '/'}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block py-2 px-3 rounded-lg text-sm font-medium transition-colors
                         ${isActive ? 'bg-[#B9975B]/10 text-[#B9975B]' : 'text-white/80 hover:text-white hover:bg-white/5'}`
                      }
                    >
                      {link.label}
                    </NavLink>,
                  ]
            )}
            <a
              href="https://www.linkedin.com/company/surrey-capital-research/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-3 justify-center !py-2.5"
            >
              Join SCR on LinkedIn
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
