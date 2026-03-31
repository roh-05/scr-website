"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, ExternalLink } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    organization: [
      { name: "About Us", href: "/about" },
      { name: "Our Team", href: "/about#team" },
      { name: "Alumni Network", href: "/alumni" },
      { name: "Contact", href: "/contact" },
    ],
    research: [
      { name: "Equity Research", href: "/departments/equity-research" },
      { name: "M&A Analysis", href: "/departments/m-and-a" },
      { name: "Quantitative Finance", href: "/departments/quantitative-research" },
      { name: "Economic Research", href: "/departments/economic-research" },
    ],
    resources: [
      { name: "University of Surrey", href: "https://www.surrey.ac.uk", external: true },
    ]
  };

  return (
    <footer className="bg-surrey-blue text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group focus:outline-none">
              <Image
                src="/scr-logo.jpg"
                alt="Surrey Capital Research Logo"
                width={45}
                height={45}
                className="object-contain"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight group-hover:text-surrey-gold transition-colors">
                  Surrey Capital Research
                </span>
                <span className="text-[10px] text-surrey-gold font-medium tracking-widest uppercase">
                  University of Surrey
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Empowering the next generation of financial leaders through rigorous, student-led investment analysis and economic research.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://linkedin.com/company/surrey-capital-research" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-surrey-gold hover:text-surrey-blue transition-all duration-300 group"
                aria-label="LinkedIn"
              >
                <Image 
                  src="/linkedin.svg" 
                  alt="LinkedIn" 
                  width={20} 
                  height={20} 
                  className="brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300" 
                />
              </a>
              <a 
                href="mailto:contact@surreycapitalresearch.com" 
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-surrey-gold hover:text-surrey-blue transition-all duration-300"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-surrey-gold font-bold uppercase tracking-wider text-xs mb-6">Organization</h3>
            <ul className="space-y-4">
              {footerLinks.organization.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-[1px] bg-surrey-gold transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Research Departments */}
          <div>
            <h3 className="text-surrey-gold font-bold uppercase tracking-wider text-xs mb-6">Departments</h3>
            <ul className="space-y-4">
              {footerLinks.research.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-[1px] bg-surrey-gold transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location & Contact */}
          <div>
            <h3 className="text-surrey-gold font-bold uppercase tracking-wider text-xs mb-6">Get in Touch</h3>
            <div className="space-y-6">
              <div className="flex gap-3 items-start">
                <MapPin size={18} className="text-surrey-gold shrink-0 mt-0.5" />
                <p className="text-gray-400 text-sm leading-relaxed">
                  University of Surrey<br />
                  Guildford, GU2 7XH<br />
                  United Kingdom
                </p>
              </div>
              <ul className="space-y-4 mt-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a 
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                      >
                        {link.name}
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar - Centered */}
        <div className="pt-8 border-t border-white/5 flex justify-center items-center">
          <p className="text-gray-500 text-xs text-center">
            © {currentYear} Surrey Capital Research. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}