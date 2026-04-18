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

const formatDepartment = (dept: string) =>
  dept.split("_").map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");

interface HomeClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentReports: any[];
  activeMembersCount: number;
  alumniCount: number;
  reportsCount: number;
}

const DEPARTMENTS = [
  {
    num: "01",
    name: "Equity Research",
    desc: "Fundamental analysis, financial modelling, and investment recommendations on listed equities.",
    slug: "equity-research",
    sector: "FTSE 100",
  },
  {
    num: "02",
    name: "Mergers & Acquisitions",
    desc: "Strategic rationale, synergy analysis, and financial structuring of major corporate events.",
    slug: "ma",
    sector: "LARGE CAP",
  },
  {
    num: "03",
    name: "Quantitative Research",
    desc: "Data-driven trading strategies, factor models, and algorithmic frameworks.",
    slug: "quantitative-research",
    sector: "SYSTEMATIC",
  },
  {
    num: "04",
    name: "Economic Research",
    desc: "Macro forecasting, central bank policy analysis, and geopolitical market research.",
    slug: "economic-research",
    sector: "MACRO",
  },
];

export default function HomeClient({
  settings,
  recentReports,
  activeMembersCount,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  alumniCount,
  reportsCount,
}: HomeClientProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-eyebrow", { y: 14, opacity: 0, duration: 0.6 })
      .from(".hero-title", { y: 52, opacity: 0, duration: 1.1 }, "-=0.3")
      .from(".hero-body", { y: 24, opacity: 0, duration: 0.8 }, "-=0.5")
      .from(".hero-ctas > *", { y: 16, opacity: 0, duration: 0.5, stagger: 0.12 }, "-=0.3");

    // Stats count-up on scroll
    gsap.utils.toArray<HTMLElement>(".stat-number").forEach((el) => {
      const target = Number(el.dataset.value) || 0;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2.5,
        ease: "power2.out",
        scrollTrigger: { trigger: ".stats-section", start: "top 80%" },
        onUpdate: () => { el.innerText = Math.ceil(obj.val).toString(); },
      });
    });

    // Progress bar fill on scroll
    gsap.utils.toArray<HTMLElement>(".stat-progress-bar").forEach((bar) => {
      gsap.to(bar, {
        width: (bar.dataset.target || "0") + "%",
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: { trigger: ".stats-section", start: "top 80%" },
      });
    });

    gsap.utils.toArray<HTMLElement>(".reveal-on-scroll").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 82%" },
        y: 40, opacity: 0, duration: 1, ease: "power3.out",
      });
    });

    gsap.utils.toArray<HTMLElement>(".reveal-card").forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: "top 88%" },
        y: 32, opacity: 0, duration: 0.7, delay: i * 0.08, ease: "power3.out",
      });
    });

    // Mission accent bar
    gsap.fromTo(
      ".mission-accent-bar",
      { height: "0%" },
      {
        height: "100%",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ".mission-section", start: "top 75%" },
      }
    );

    // CTA rule sweep
    gsap.fromTo(
      ".cta-rule",
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.4,
        ease: "power2.out",
        transformOrigin: "left",
        scrollTrigger: { trigger: ".cta-section", start: "top 80%" },
      }
    );
  }, { scope: container });

  const maxVal = Math.max(activeMembersCount, reportsCount) || 1;

  return (
    <div className="flex flex-col min-h-screen" ref={container}>

      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section className="bg-surrey-blue min-h-[80vh] flex items-center relative overflow-hidden">

        {/* Animated grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none animate-drift-grid"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(172,151,65,0.04) 39px, rgba(172,151,65,0.04) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(172,151,65,0.04) 39px, rgba(172,151,65,0.04) 40px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 text-left">

          {/* Eyebrow with pulsing LIVE dot */}
          <div className="hero-eyebrow inline-flex items-center gap-3 mb-8">
            <span className="relative inline-flex h-2 w-2 shrink-0">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-surrey-gold opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-surrey-gold" />
            </span>
            <span className="font-mono text-surrey-gold text-[11px] uppercase tracking-[0.2em]">
              University of Surrey
            </span>
          </div>

          <h1 className="hero-title font-serif text-white font-bold leading-[1.05] tracking-tight mb-6 text-6xl md:text-7xl lg:text-8xl">
            {settings?.heroTitle ?? (
              <>Student&#8209;Led<br />Financial<br />Excellence</>
            )}
          </h1>

          <p className="hero-body text-white/60 text-lg leading-relaxed mb-8 max-w-xl">
            {settings?.heroSubtitle ??
              "Surrey Capital Research bridges the gap between academic theory and institutional market reality through rigorous, unbiased analysis."}
          </p>

          <div className="hero-ctas flex flex-wrap gap-4">
            <Link
              href="/publications"
              className="bg-surrey-gold text-surrey-blue px-8 py-3.5 text-sm font-bold uppercase tracking-wider border border-surrey-gold hover:bg-transparent hover:text-surrey-gold transition-colors duration-200"
            >
              Read Our Research
            </Link>
            <Link
              href="/contact"
              className="border border-white/50 text-white px-8 py-3.5 text-sm font-bold uppercase tracking-wider hover:border-white hover:bg-white/10 transition-colors duration-200"
            >
              Join the Team
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS BAND ────────────────────────────────────────────────── */}
      <section className="stats-section bg-white border-t border-surrey-gold/20 py-16">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-3">
          {[
            { label: "Active Analysts", value: activeMembersCount, animate: true },
            { label: "Published Reports", value: reportsCount, animate: true },
            { label: "Founded", value: 2022, animate: false },
          ].map((s, i) => (
            <div key={i} className="px-8 sm:px-12 py-4 text-left">
              <div
                className={`font-mono text-surrey-gold font-bold text-5xl sm:text-6xl leading-none mb-3${s.animate ? " stat-number" : ""}`}
                data-value={s.animate ? s.value : undefined}
              >
                {s.value}
              </div>
              <div className="w-full h-px bg-surrey-gold/15 mb-3 overflow-hidden">
                {s.animate && (
                  <div
                    className="stat-progress-bar h-full bg-surrey-gold"
                    style={{ width: "0%" }}
                    data-target={String(Math.round((s.value / maxVal) * 100))}
                  />
                )}
              </div>
              <div className="font-mono text-surrey-blue/60 text-[13px] uppercase tracking-[0.2em]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── MISSION ───────────────────────────────────────────────────── */}
      <section className="reveal-on-scroll mission-section bg-white py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex gap-8">

          {/* Left accent bar */}
          <div className="hidden lg:block w-px bg-surrey-gold/30 relative shrink-0">
            <div
              className="mission-accent-bar absolute top-0 left-0 w-full bg-surrey-gold"
              style={{ height: "0%" }}
            />
          </div>

          <div className="flex-1">
            <div className="inline-flex items-center gap-3 mb-10">
              <span className="font-mono text-surrey-gold text-[11px] uppercase tracking-[0.2em]">
                [ {settings?.missionTitle ?? "OUR MISSION"} &middot; EST. 2022 ]
              </span>
            </div>
            <blockquote className="font-serif text-surrey-blue font-semibold leading-[1.3] text-3xl md:text-4xl lg:text-[2.65rem]">
              &ldquo;
              {settings?.missionDescription ??
                "We bridge the gap between academic theory and front-office reality — producing rigorous, unbiased market analysis and preparing the next generation of financial professionals."}
              &rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* ─── DEPARTMENTS ───────────────────────────────────────────────── */}
      <section id="departments" className="reveal-on-scroll py-24 bg-surrey-light px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-14">
            <div>
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-surrey-gold shrink-0" />
                <span className="font-mono text-surrey-gold text-[11px] uppercase tracking-[0.2em]">
                  Research Desks
                </span>
              </div>
              <h2 className="font-serif text-surrey-blue text-4xl lg:text-5xl font-semibold">
                Our Departments
              </h2>
            </div>
            <Link
              href="/departments"
              className="hidden sm:inline-flex items-center gap-1.5 text-surrey-blue text-xs font-bold uppercase tracking-wider hover:text-surrey-gold transition-colors"
            >
              View all <span className="text-surrey-gold">→</span>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0.5 bg-surrey-gold/20">
            {DEPARTMENTS.map((dept) => (
              <div
                key={dept.name}
                className="reveal-card group bg-white p-8 flex flex-col hover:bg-surrey-blue transition-colors duration-300 relative overflow-hidden"
              >
                <span className="font-mono text-[9px] text-surrey-gold/50 group-hover:text-surrey-gold/70 uppercase tracking-widest mb-5 transition-colors">
                  DESK_{dept.num}
                </span>
                <h3 className="font-serif text-surrey-blue group-hover:text-white text-xl font-semibold mb-4 leading-snug transition-colors">
                  {dept.name}
                </h3>
                <p className="text-body-text/55 group-hover:text-white/55 text-sm leading-relaxed mb-6 transition-colors line-clamp-3">
                  {dept.desc}
                </p>
                <span className="font-mono text-[9px] text-surrey-gold/70 group-hover:text-surrey-gold border border-surrey-gold/40 group-hover:border-surrey-gold/60 px-2 py-0.5 uppercase tracking-widest w-fit mb-6 transition-colors">
                  {dept.sector}
                </span>
                <Link
                  href={`/departments/${dept.slug}`}
                  className="text-surrey-gold text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 group-hover:gap-3 transition-all mt-auto w-fit"
                >
                  Explore <span>→</span>
                </Link>
                {/* Hover accent sweep */}
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-surrey-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            ))}
          </div>

          {/* Secondary View All link below the grid */}
          <div className="mt-8 text-center">
            <Link
              href="/departments"
              className="inline-flex items-center gap-1.5 text-surrey-blue text-xs font-bold uppercase tracking-wider hover:text-surrey-gold transition-colors"
            >
              View all departments <span className="text-surrey-gold">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PUBLICATIONS + UPDATES ────────────────────────────────────── */}
      <section id="publications" className="reveal-on-scroll py-24 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[3fr_2fr] gap-16">

          {/* Publications */}
          <div>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-surrey-gold shrink-0" />
              <span className="font-mono text-surrey-gold text-[11px] uppercase tracking-[0.2em]">Research</span>
            </div>
            <h2 className="font-serif text-surrey-blue text-3xl lg:text-4xl font-semibold mb-10">
              Latest Publications
            </h2>

            <div className="border-t border-surrey-grey/40">
              {recentReports.length > 0 ? (
                recentReports.map((pub, i) => (
                  <div
                    key={pub.id}
                    className="reveal-card border-b border-surrey-grey/20 border-l-2 border-l-transparent hover:border-l-surrey-gold py-7 group pl-4 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="font-mono text-surrey-gold text-[10px] uppercase tracking-widest border border-surrey-gold/30 px-2 py-0.5">
                            [{formatDepartment(pub.department)}]
                          </span>
                          <span className="text-surrey-grey/60 text-[10px]">·</span>
                          <span className="font-mono text-text-muted text-[10px]" suppressHydrationWarning>
                            {new Date(pub.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }).replace(/\//g, "-")}
                          </span>
                        </div>
                        <h3 className="font-serif text-surrey-blue text-xl font-semibold leading-snug group-hover:text-surrey-gold/80 transition-colors">
                          {pub.title}
                        </h3>
                        <a
                          href={pub.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-surrey-blue hover:text-surrey-gold transition-colors mt-4"
                        >
                          Read Report <span className="text-surrey-gold">→</span>
                        </a>
                      </div>
                      <span className="font-mono text-surrey-grey/40 text-sm shrink-0 pt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-text-muted text-sm border-b border-surrey-grey/40">
                  No publications yet — check back soon.
                </div>
              )}
            </div>

            <div className="mt-10">
              <Link
                href="/publications"
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-surrey-blue hover:text-surrey-gold transition-colors group"
              >
                View Full Archive
                <span className="text-surrey-gold group-hover:translate-x-1 inline-block transition-transform">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Updates */}
          <div>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-surrey-gold shrink-0" />
              <span className="font-mono text-surrey-gold text-[11px] uppercase tracking-[0.2em]">Updates</span>
            </div>
            <h2 className="font-serif text-surrey-blue text-3xl lg:text-4xl font-semibold mb-10">
              Latest Updates
            </h2>
            <LinkedInFeed />
          </div>

        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────────── */}
      <section
        className="reveal-on-scroll cta-section bg-surrey-blue relative overflow-hidden py-28 text-center px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage:
            "linear-gradient(rgba(172,151,65,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(172,151,65,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-surrey-gold/35 to-transparent" />
        <div className="max-w-3xl mx-auto relative z-10">
          {/* Animated rule */}
          <div className="mb-10 overflow-hidden">
            <div
              className="cta-rule h-px bg-surrey-gold mx-auto"
              style={{ width: "100%", transformOrigin: "left" }}
            />
          </div>

          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="w-8 h-px bg-surrey-gold shrink-0" />
            <span className="font-mono text-surrey-gold text-[11px] uppercase tracking-[0.2em]">Join the Team</span>
            <span className="w-8 h-px bg-surrey-gold shrink-0" />
          </div>
          <h2 className="font-serif text-white text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-8">
            {settings?.ctaHeading ?? "Ready to Join the Team?"}
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-4 max-w-xl mx-auto">
            {settings?.ctaSubtext ??
              "We are always looking for driven individuals with a passion for financial markets. Apply to join one of our research desks."}
          </p>
          <p className="text-white/40 text-sm font-mono uppercase tracking-wider mb-12">
            Apply for the 2026 Cohort — deadline 15 May
          </p>
          <Link
            href="/contact"
            className="bg-surrey-blue text-white px-10 py-4 font-bold text-sm uppercase tracking-wider border border-surrey-blue hover:bg-transparent hover:text-surrey-blue transition-colors inline-block"
          >
            Apply Now
          </Link>
        </div>
      </section>

    </div>
  );
}
