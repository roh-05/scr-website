"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { 
      name: "Departments", 
      href: "/departments",
      children: [
        { name: "Equity Research", href: "/departments/equity-research" },
        { name: "Mergers & Acquisitions", href: "/departments/m-and-a" },
        { name: "Quantitative Finance", href: "/departments/quantitative-research" },
        { name: "Economics", href: "/departments/economic-research" },
      ]
    },
    { name: "Publications", href: "/publications" },
    { name: "Alumni", href: "/alumni" },
    { name: "Contact", href: "/contact" },
  ];

  const checkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <nav className="bg-surrey-blue text-surrey-light sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">

          {/* Logo / Brand Name */}
          <div className="flex items-center h-full">
            <Link href="/" className="flex-shrink-0 flex items-center gap-3 group focus:outline-none">
              <Image
                src="/scr-logo.jpg"
                alt="Surrey Capital Research Logo"
                width={50}
                height={50}
                className="object-contain"
                priority
              />
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-white group-hover:text-surrey-gold transition-colors">
                  Surrey Capital Research
                </span>
                <span className="text-[10px] text-surrey-gold font-medium tracking-widest uppercase mt-0.5">
                  University of Surrey
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          {/* Removed space-x-2 to prevent margin conflicts */}
          <div className="hidden md:flex items-center h-full">
            {navLinks.map((link) => {
              const isActive = checkActive(link.href);
              
              if (link.children) {
                return (
                  <div key={link.name} className="relative group h-full flex items-center mx-4">
                    <Link
                      href={link.href}
                      // Used inline-flex to align perfectly with non-dropdown links
                      className={`inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200 border-b-2 pb-1 ${isActive
                        ? "text-surrey-gold border-surrey-gold"
                        : "text-surrey-light border-transparent hover:text-white hover:border-surrey-light"
                        }`}
                    >
                      {link.name}
                      {/* Added mt-0.5 to vertically center the chevron with the text */}
                      <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200 mt-0.5" />
                    </Link>

                    {/* Smooth, premium floating dropdown */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-5 w-60 opacity-0 translate-y-3 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 ease-out z-50">
                      <div className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] ring-1 ring-black/5 p-2 flex flex-col gap-1">
                        {link.children.map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={`block px-4 py-2.5 text-sm transition-all duration-200 rounded-lg ${
                                isChildActive 
                                  ? "bg-gray-100 text-surrey-blue font-bold" 
                                  : "text-gray-500 font-medium hover:bg-gray-50 hover:text-surrey-blue"
                              }`}
                            >
                              {child.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              // Standard Link
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  // Used inline-flex for perfect baseline alignment
                  className={`inline-flex items-center text-sm font-medium transition-colors duration-200 mx-4 border-b-2 pb-1 ${isActive
                    ? "text-surrey-gold border-surrey-gold"
                    : "text-surrey-light border-transparent hover:text-white hover:border-surrey-light"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-surrey-light hover:text-white hover:bg-[#2a3c50] focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#2a3c50] border-t border-gray-600 max-h-[80vh] overflow-y-auto">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => {
              const isActive = checkActive(link.href);
              
              return (
                <div key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => { if (!link.children) setIsOpen(false); }}
                    className={`block px-3 py-2.5 rounded-md text-base font-medium transition-colors ${isActive
                      ? "text-surrey-gold bg-[#1e2b3c]"
                      : "text-surrey-light hover:text-white hover:bg-[#1e2b3c]"
                      }`}
                  >
                    {link.name}
                  </Link>
                  
                  {link.children && (
                    <div className="pl-6 mt-1 space-y-1 border-l-2 border-gray-600 ml-4">
                      {link.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={() => setIsOpen(false)}
                            className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                              isChildActive
                                ? "text-surrey-gold bg-[#1e2b3c]/50"
                                : "text-gray-400 hover:text-white hover:bg-[#1e2b3c]/50"
                            }`}
                          >
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}