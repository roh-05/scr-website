"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import LinkedInFeed from "@/components/LinkedInFeed";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Helper to format the Prisma ENUMs (e.g., 'EQUITY_RESEARCH' -> 'Equity Research')
const formatDepartment = (dept: string) => {
  return dept
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

interface HomeClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentReports: any[];
  activeMembersCount: number;
  alumniCount: number;
  reportsCount: number;
}

export default function HomeClient({
  settings,
  recentReports,
  activeMembersCount,
  alumniCount,
  reportsCount,
}: HomeClientProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Hero Entrance Animation
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl.from(".hero-text", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
    });

    // 2. Stats Section - Count up numbers when in view
    const statElements = gsap.utils.toArray<HTMLElement>('.stat-number');
    statElements.forEach((el) => {
      const target = Number(el.innerText) || 0;
      el.innerText = '0'; // start at 0
      const targetObj = { val: 0 };
      gsap.to(targetObj, {
        val: target,
        duration: 2.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".stats-section",
          start: "top 80%",
        },
        onUpdate: () => { 
          el.innerText = Math.ceil(targetObj.val).toString(); 
        }
      });
    });

    // 3. Reveal elements on scroll
    gsap.utils.toArray<HTMLElement>('.reveal-on-scroll').forEach(section => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    });

    gsap.utils.toArray<HTMLElement>('.reveal-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power3.out"
        });
      });

  }, { scope: container });

  return (
    <div className="flex flex-col min-h-screen" ref={container}>
      {/* 1. Hero Section (Centered Layout) */}
      <section className="bg-surrey-blue text-white py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center min-h-[70vh]">
        {/* Animated Background Nodes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-surrey-gold/10 rounded-full blur-3xl animate-float-node"></div>
        <div className="absolute top-2/3 right-1/4 w-96 h-96 bg-surrey-gold/10 rounded-full blur-3xl animate-float-node" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-white/5 rounded-full blur-2xl animate-float-node" style={{ animationDelay: "4s" }}></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="hero-text text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            {settings?.heroTitle || "Student-Led Financial Excellence"}
          </h1>
          <p className="hero-text text-xl md:text-2xl mb-12 text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {settings?.heroSubtitle || "Surrey Capital Research is the premier student-led financial organization bridging the gap between academic theory and institutional market reality."}
          </p>
          <div className="hero-text flex flex-wrap justify-center gap-6">
            <Link
              href="/publications"
              className="bg-surrey-gold text-surrey-blue px-10 py-4 rounded-md font-bold text-lg hover:bg-[#c2aa4a] transition-all shadow-[0_0_20px_rgba(184,153,60,0.4)] hover:shadow-[0_0_30px_rgba(184,153,60,0.6)]"
            >
              Read Our Research
            </Link>
            <Link
              href="/departments"
              className="bg-transparent border-2 border-surrey-gold text-surrey-gold px-10 py-4 rounded-md font-bold text-lg hover:bg-surrey-gold hover:text-surrey-blue transition-colors shadow-[0_0_15px_rgba(0,0,0,0.2)]"
            >
              Explore Departments
            </Link>
          </div>
        </div>
        {/* Subtle gradient overlay to blend into the theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
      </section>


      {/* 2. Credibility Statistics Bar */}
      <section className="stats-section bg-surrey-blue text-white py-14 border-b border-surrey-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-surrey-gold/30">
            <div className="stats-item pt-4 md:pt-0">
              <div className="stat-number text-5xl md:text-6xl font-black text-surrey-gold mb-3 drop-shadow-md">{activeMembersCount}</div>
              <div className="text-sm md:text-base uppercase tracking-[0.2em] text-gray-300 font-bold">Active Analysts</div>
            </div>
            <div className="stats-item pt-4 md:pt-0">
              <div className="stat-number text-5xl md:text-6xl font-black text-surrey-gold mb-3 drop-shadow-md">{reportsCount}</div>
              <div className="text-sm md:text-base uppercase tracking-[0.2em] text-gray-300 font-bold">Published Reports</div>
            </div>
            <div className="stats-item pt-4 md:pt-0">
              <div className="stat-number text-5xl md:text-6xl font-black text-surrey-gold mb-3 drop-shadow-md">{alumniCount}</div>
              <div className="text-sm md:text-base uppercase tracking-[0.2em] text-gray-300 font-bold">Total Alumni</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission Statement */}
      <section className="reveal-on-scroll mission-section py-20 bg-surrey-light px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-surrey-blue mb-8">
            {settings?.missionTitle || "Our Mission"}
          </h2>
          <p className="text-xl text-body-text leading-relaxed">
            {settings?.missionDescription || "Surrey Capital Research is the University of Surrey's premier financial organization. We bridge the gap between academic theory and front-office reality by producing rigorous, unbiased market analysis."}
          </p>
        </div>
      </section>

      {/* 4. Department Highlights */}
      <section className="reveal-on-scroll py-24 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl font-bold text-surrey-blue">Research Departments</h2>
            <Link href="/departments" className="text-surrey-gold font-semibold text-lg hover:underline hidden sm:block">
              View all departments &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Equity Research", desc: "Deep-dive fundamental analysis, financial modeling, and actionable investment recommendations.", slug: "equity-research" },
              { name: "M&A", desc: "Strategic rationale, synergy analysis, and financial structuring of major corporate events.", slug: "ma" },
              { name: "Quantitative Research", desc: "Data-driven trading strategies, factor models, and algorithmic frameworks.", slug: "quantitative-research" },
              { name: "Economic Research", desc: "Macroeconomic forecasting, central bank policy analysis, and geopolitical research.", slug: "economic-research" },
            ].map((dept) => (
              <div key={dept.name} className="reveal-card bg-surrey-light rounded-xl p-8 border-t-4 border-surrey-gold shadow-sm hover:shadow-[0_10px_30px_rgba(172,151,65,0.15)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-surrey-gold/0 to-surrey-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <h3 className="text-2xl font-bold text-surrey-blue mb-4">{dept.name}</h3>
                <p className="text-body-text/80 mb-8 text-base flex-grow">{dept.desc}</p>
                <Link href={`/departments/${dept.slug}`} className="text-surrey-blue font-bold text-base hover:text-surrey-gold transition-colors inline-block mt-auto">
                  Learn more &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Publications & LinkedIn (Split Layout) */}
      <section className="reveal-on-scroll py-20 bg-surrey-light px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Featured Publications (Database Driven) */}
          <div>
            <h2 className="text-3xl font-bold text-surrey-blue mb-8">Latest Publications</h2>
            <div className="space-y-6">
              {recentReports.length > 0 ? (
                recentReports.map((pub) => (
                  <div key={pub.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-surrey-gold hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-surrey-gold">
                        {formatDepartment(pub.department)}
                      </span>
                      <span className="text-xs text-text-muted" suppressHydrationWarning>
                        {new Date(pub.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-surrey-blue mb-4">{pub.title}</h3>
                    <a 
                      href={pub.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-surrey-blue font-semibold hover:text-surrey-gold inline-flex items-center gap-1 transition-colors"
                    >
                      Read Report &rarr;
                    </a>
                  </div>
                ))
              ) : (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-text-muted">
                  No publications have been uploaded yet. Check back soon!
                </div>
              )}
            </div>
            <div className="mt-10">
              <Link href="/publications" className="inline-block bg-surrey-blue text-white px-8 py-3 rounded-md text-base font-bold hover:bg-[#2a3c50] transition-colors shadow-md hover:shadow-lg">
                View Publication Archive
              </Link>
            </div>
          </div>

          {/* Custom JSON LinkedIn Feed */}
          <div className="flex flex-col h-full">
            <h2 className="text-3xl font-bold text-surrey-blue mb-8">Latest Updates</h2>
            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <LinkedInFeed />
            </div>
          </div>

        </div>
      </section>

      {/* 6. Call to Action */}
      <section className="reveal-on-scroll bg-surrey-blue text-white py-24 text-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
            {settings?.ctaHeading || "Ready to Join the Team?"}
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            {settings?.ctaSubtext || "We are always looking for driven individuals with a passion for financial markets. Apply to join one of our research desks and gain hands-on experience in institutional-grade analysis."}
          </p>
          <Link
            href="/contact"
            className="bg-surrey-gold text-surrey-blue px-10 py-4 rounded-md font-bold text-xl hover:bg-[#c2aa4a] transition-all shadow-[0_0_20px_rgba(184,153,60,0.4)] hover:shadow-[0_0_30px_rgba(184,153,60,0.6)] inline-block hover:-translate-y-1"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
