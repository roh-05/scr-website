// src/app/alumni/AlumniClient.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, MapPin, Briefcase, GraduationCap, ArrowRight } from "lucide-react";

// The shape of the data we expect from the server
type AlumniData = {
  id: string;
  name: string;
  scrRole: string;
  department: string;
  classYear: string | null;
  currentRole: string | null;
  company: string | null;
  location: string | null;
  linkedin: string | null;
  imageUrl: string | null;
  quote: string | null;
};

const DEPARTMENTS = ["All", "Equity Research", "Mergers & Acquisitions", "Quantitative Finance", "Economic Research"];

export default function AlumniClient({ initialAlumni }: { initialAlumni: AlumniData[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDept, setActiveDept] = useState("All");

  // Filter Logic
  const filteredAlumni = initialAlumni.filter((alumnus) => {
    const searchTarget = `${alumnus.name} ${alumnus.company || ""}`.toLowerCase();
    const matchesSearch = searchTarget.includes(searchTerm.toLowerCase());
    const matchesDept = activeDept === "All" || alumnus.department === activeDept;
    
    return matchesSearch && matchesDept;
  });

  return (
    <div className="bg-surrey-light min-h-screen pb-24">
      
      {/* ── HERO SECTION ── */}
      <section className="bg-surrey-blue text-surrey-light pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-sm font-bold text-surrey-gold uppercase tracking-[0.2em] mb-4">The SCR Legacy</h1>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Our Global <span className="text-surrey-gold">Alumni Network</span>
          </h2>
          <p className="text-surrey-light/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Surrey Capital Research alumni go on to build exceptional careers at the world's leading investment banks, hedge funds, and financial institutions.
          </p>
        </div>
      </section>

      {/* ── DIRECTORY CONTROLS ── */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-surrey-grey/30 p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-center">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or company..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surrey-light border border-surrey-grey/50 text-surrey-blue rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all placeholder:text-text-muted/70"
            />
          </div>

          {/* Department Filters */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeDept === dept 
                    ? "bg-surrey-blue text-surrey-light shadow-md" 
                    : "bg-surrey-beige text-text-muted hover:bg-surrey-grey/30 hover:text-surrey-blue"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ── ALUMNI PROFILES GRID ── */}
      <section className="max-w-7xl mx-auto px-6 pt-16">
        {filteredAlumni.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAlumni.map((alumnus) => (
              <div 
                key={alumnus.id} 
                className="bg-white rounded-2xl shadow-sm border border-surrey-grey/30 hover:shadow-xl hover:border-surrey-gold/40 transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Top Banner */}
                <div className="h-16 bg-surrey-beige w-full relative">
                  {alumnus.classYear && (
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-bold text-surrey-blue shadow-sm flex items-center gap-1.5">
                      <GraduationCap size={14} className="text-surrey-gold" />
                      Class of '{alumnus.classYear.slice(-2)}
                    </div>
                  )}
                </div>

                {/* Profile Content */}
                <div className="px-6 flex-grow relative -mt-8">
                  
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-surrey-light rounded-xl border-4 border-white shadow-sm flex items-center justify-center mb-4 overflow-hidden relative">
                     {alumnus.imageUrl ? (
                        <Image 
                          src={alumnus.imageUrl} 
                          alt={alumnus.name}
                          fill
                          className="object-cover"
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center bg-surrey-grey/30 text-surrey-blue font-bold text-xl">
                           {alumnus.name.charAt(0)}
                        </div>
                     )}
                  </div>

                  {/* Header */}
                  <div className="mb-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-surrey-blue leading-tight">{alumnus.name}</h3>
                      <p className="text-surrey-gold text-sm font-bold mt-1">{alumnus.scrRole}</p>
                    </div>
                    {/* LinkedIn Icon */}
                    {alumnus.linkedin && (
                      <a 
                        href={alumnus.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-surrey-blue/5 flex items-center justify-center hover:bg-surrey-blue group/ln transition-colors shrink-0"
                        aria-label="LinkedIn Profile"
                      >
                        <Image 
                          src="/images/linkedin.svg" 
                          alt="LinkedIn" 
                          width={14} 
                          height={14} 
                          className="opacity-50 group-hover/ln:brightness-0 group-hover/ln:invert transition-all" 
                        />
                      </a>
                    )}
                  </div>

                  {/* Current Role Details */}
                  <div className="space-y-2 mb-6">
                    {alumnus.currentRole && (
                      <div className="flex items-start gap-2 text-sm text-text-muted">
                        <Briefcase size={16} className="shrink-0 mt-0.5 text-surrey-grey" />
                        <span className="font-medium text-surrey-blue">{alumnus.currentRole}</span>
                      </div>
                    )}
                    {alumnus.company && (
                      <div className="flex items-start gap-2 text-sm text-text-muted">
                        <div className="w-4 flex justify-center shrink-0 mt-0.5">
                          <span className="font-bold text-surrey-grey text-xs">@</span>
                        </div>
                        <span>{alumnus.company}</span>
                      </div>
                    )}
                    {alumnus.location && (
                      <div className="flex items-start gap-2 text-sm text-text-muted">
                        <MapPin size={16} className="shrink-0 mt-0.5 text-surrey-grey" />
                        <span>{alumnus.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Divider & Quote */}
                  {alumnus.quote && (
                    <>
                      <div className="h-px w-full bg-surrey-beige mb-5"></div>
                      <p className="text-sm text-text-muted italic leading-relaxed pb-6">
                        "{alumnus.quote}"
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-surrey-grey/30">
            <h3 className="text-xl font-bold text-surrey-blue mb-2">No profiles found</h3>
            <p className="text-text-muted">We couldn't find any alumni matching your current search or filter criteria.</p>
            <button 
              onClick={() => {setSearchTerm(""); setActiveDept("All");}}
              className="mt-6 text-surrey-gold font-bold hover:text-surrey-blue transition-colors underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* ── CTA SECTION ── */}
      <section className="max-w-4xl mx-auto px-6 mt-24 text-center">
        <div className="bg-surrey-beige rounded-3xl p-10 md:p-16 border border-surrey-grey/40">
          <h2 className="text-2xl md:text-3xl font-bold text-surrey-blue mb-4">Are you an SCR Alumnus?</h2>
          <p className="text-text-muted mb-8 max-w-xl mx-auto">
            We are always looking to reconnect with former members, feature new profiles, and invite alumni to our exclusive networking events.
          </p>
          <a 
            href="mailto:alumni@surreycapital.org" 
            className="inline-flex items-center gap-2 bg-surrey-blue text-surrey-light px-8 py-3.5 rounded-lg font-bold hover:bg-surrey-blue/90 transition-colors shadow-md"
          >
            Update Your Details <ArrowRight size={18} />
          </a>
        </div>
      </section>

    </div>
  );
}