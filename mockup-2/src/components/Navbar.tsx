"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Add this import
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Departments", href: "/departments" },
    { name: "Publications", href: "/publications" },
    { name: "Alumni", href: "/alumni" },
    { name: "Events", href: "/events" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-surrey-blue text-surrey-light sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">

          {/* Logo / Brand Name */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
              {/* The Next.js Image Component */}
              <Image
                src="/scr-logo.jpg"
                alt="Surrey Capital Research Logo"
                width={50}   // Adjust these dimensions based on your logo's aspect ratio
                height={50}
                className="object-contain"
                priority     // Tells Next.js to load this immediately
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
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${isActive
                    ? "text-surrey-gold border-b-2 border-surrey-gold pb-1"
                    : "text-surrey-light hover:text-white hover:border-b-2 hover:border-surrey-light pb-1"
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
              aria-expanded="false"
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
        <div className="md:hidden bg-[#2a3c50] border-t border-gray-600">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive
                    ? "text-surrey-gold bg-[#1e2b3c]"
                    : "text-surrey-light hover:text-white hover:bg-[#1e2b3c]"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}