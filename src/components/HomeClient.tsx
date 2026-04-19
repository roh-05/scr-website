"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import LinkedInFeed from "@/components/LinkedInFeed";

const AnimatedBackground = dynamic(() => import("@/components/AnimatedBackground"), { ssr: false });

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

const TICKER_ITEMS = [
  "Equity Research",
  "Mergers & Acquisitions",
  "Quantitative Research",
  "Economic Research",
  "FTSE 100 Analysis",
  "Systematic Strategies",
  "Macro Forecasting",
  "Financial Modelling",
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

  useGSAP(
    () => {
      // ── Stacking panel animation ──────────────────────────────────────────
      const panels = gsap.utils.toArray<HTMLElement>(".panel");
      const panelsToPin = panels.slice(0, -1);

      panelsToPin.forEach((panel) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "bottom bottom",
            pinSpacing: false,
            pin: true,
            scrub: true,
            onRefresh: () =>
              gsap.set(panel, {
                transformOrigin: `center ${panel.offsetHeight - window.innerHeight / 2}px`,
              }),
          },
        });
        tl.fromTo(
          panel,
          { scale: 1, opacity: 1, borderRadius: 0 },
          { scale: 0.82, opacity: 0.5, borderRadius: 14, duration: 1 }
        ).to(panel, { opacity: 0, duration: 0.1 });
      });

      // ── Hero entrance ─────────────────────────────────────────────────────
      const entryTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      entryTl
        .from(".hero-eyebrow", { y: 14, opacity: 0, duration: 0.6 })
        .from(".hero-title", { y: 52, opacity: 0, duration: 1.1 }, "-=0.3")
        .from(".hero-sub", { y: 24, opacity: 0, duration: 0.8 }, "-=0.5")
        .from(".hero-ctas > *", { y: 16, opacity: 0, duration: 0.5, stagger: 0.12 }, "-=0.3")
        .from(".hero-ticker", { y: 20, opacity: 0, duration: 0.6 }, "-=0.2");

      // ── Stats count-up ────────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".stat-number").forEach((el) => {
        const target = Number(el.dataset.value) || 0;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2.5,
          ease: "power2.out",
          scrollTrigger: { trigger: ".stats-panel", start: "top 80%" },
          onUpdate: () => {
            el.innerText = Math.ceil(obj.val).toString();
          },
        });
      });
    },
    { scope: container }
  );

  return (
    <div ref={container}>

      {/* ── PANEL 1 · HERO ──────────────────────────────────────────────────── */}
      <section className="panel relative min-h-screen flex flex-col" style={{ backgroundColor: "#263C55" }}>
        <AnimatedBackground />

        {/* Main content */}
        <div className="relative z-10 flex-1 flex items-center w-full max-w-6xl mx-auto px-6 lg:px-10 pt-28 pb-20">
          <div className="w-full">

            {/* Eyebrow */}
            <div className="hero-eyebrow inline-flex items-center gap-3 mb-10">
              <span className="relative inline-flex h-2 w-2 shrink-0">
                <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-surrey-gold opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-surrey-gold" />
              </span>
              <span className="font-mono text-surrey-gold text-[11px] uppercase tracking-[0.22em]">
                University of Surrey — Est. 2022
              </span>
            </div>

            {/* Title */}
            <h1
              className="hero-title font-serif text-white font-bold leading-[1.02] tracking-tight mb-10"
              style={{ fontSize: "clamp(3.5rem, 9vw, 8.5rem)" }}
            >
              {settings?.heroTitle ?? (
                <>
                  Student&#8209;Led<br />
                  Financial<br />
                  Excellence
                </>
              )}
            </h1>

            {/* Body + CTAs row */}
            <div className="hero-sub flex flex-col sm:flex-row sm:items-end gap-8">
              <p className="text-white/50 text-base leading-relaxed max-w-md">
                {settings?.heroSubtitle ??
                  "Surrey Capital Research bridges the gap between academic theory and institutional market reality through rigorous, unbiased analysis."}
              </p>
              <div className="hero-ctas flex flex-wrap gap-3 sm:shrink-0 sm:ml-auto">
                <Link
                  href="/publications"
                  className="bg-surrey-gold text-white px-7 py-3 text-[11px] font-bold uppercase tracking-widest font-mono border border-surrey-gold hover:bg-transparent hover:text-surrey-gold transition-colors duration-200"
                >
                  Read Research
                </Link>
                <Link
                  href="/contact"
                  className="border border-white/25 text-white px-7 py-3 text-[11px] font-bold uppercase tracking-widest font-mono hover:border-white/60 hover:bg-white/5 transition-colors duration-200"
                >
                  Join the Team
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Ticker bar */}
        <div className="hero-ticker relative z-10 border-t overflow-hidden py-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="animate-marquee font-mono text-[10px] uppercase tracking-[0.18em] whitespace-nowrap" style={{ color: "rgba(255,255,255,0.2)" }}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="mx-8">
                <span className="mr-8" style={{ color: "rgba(172,151,65,0.4)" }}>◆</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PANEL 2 · STATS ─────────────────────────────────────────────────── */}
      <section className="panel stats-panel min-h-screen bg-surrey-light flex items-center">
        <div className="w-full max-w-6xl mx-auto px-6 lg:px-10 py-20">

          <div className="mb-20">
            <div className="inline-flex items-center gap-3">
              <span className="w-8 h-px bg-surrey-gold shrink-0" />
              <span className="font-mono text-surrey-gold text-[11px] uppercase tracking-[0.22em]">
                By the Numbers
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3">
            {[
              { label: "Active Analysts", value: activeMembersCount, suffix: "+", animate: true },
              { label: "Published Reports", value: reportsCount, suffix: "", animate: true },
              { label: "Founded", value: 2022, suffix: "", animate: false },
            ].map((s, i) => (
              <div
                key={i}
                className="py-12 px-2 sm:px-10 flex flex-col border-b sm:border-b-0 sm:border-r last:border-0"
                style={{ borderColor: "rgba(38,60,85,0.08)" }}
              >
                <div className="flex items-end gap-1.5 mb-5">
                  <span
                    className={`font-serif font-bold leading-none${s.animate ? " stat-number" : ""}`}
                    style={{ fontSize: "clamp(5rem, 13vw, 10rem)", color: "#263C55" }}
                    data-value={s.animate ? s.value : undefined}
                  >
                    {s.value}
                  </span>
                  {s.suffix && (
                    <span
                      className="font-serif font-bold text-surrey-gold mb-2"
                      style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}
                    >
                      {s.suffix}
                    </span>
                  )}
                </div>
                <div className="w-8 h-px bg-surrey-gold/30 mb-5" />
                <div className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: "rgba(38,60,85,0.4)" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── PANEL 3 · MISSION ───────────────────────────────────────────────── */}
      <section className="panel min-h-screen flex items-center relative" style={{ backgroundColor: "#263C55" }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(172,151,65,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(172,151,65,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-10 py-24">

          {/* Section label */}
          <div className="flex items-center gap-4 mb-12">
            <span className="w-12 h-px bg-surrey-gold/50 shrink-0" />
            <span className="font-mono text-surrey-gold text-[11px] uppercase tracking-[0.22em]">
              {settings?.missionTitle ?? "Our Mission"} &middot; Est. 2022
            </span>
          </div>

          {/* Oversized quotation mark */}
          <div
            className="font-serif leading-none select-none mb-2"
            style={{ fontSize: "clamp(7rem, 18vw, 14rem)", lineHeight: 0.75, color: "rgba(172,151,65,0.12)" }}
            aria-hidden="true"
          >
            &ldquo;
          </div>

          {/* Quote */}
          <blockquote
            className="font-serif text-white font-semibold leading-[1.25]"
            style={{ fontSize: "clamp(1.6rem, 3.5vw, 3.2rem)" }}
          >
            {settings?.missionDescription ??
              "We bridge the gap between academic theory and front-office reality — producing rigorous, unbiased market analysis and preparing the next generation of financial professionals."}
          </blockquote>

        </div>
      </section>

      {/* ── PANEL 4 · DEPARTMENTS ───────────────────────────────────────────── */}
      <section id="departments" className="panel min-h-screen bg-surrey-light flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 py-20">

          <div className="flex items-end justify-between mb-14">
            <div>
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-surrey-gold shrink-0" />
                <span className="font-mono text-surrey-gold text-[11px] uppercase tracking-[0.22em]">
                  Research Desks
                </span>
              </div>
              <h2
                className="font-serif font-semibold leading-tight"
                style={{ color: "#263C55", fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
              >
                Our Departments
              </h2>
            </div>
            <Link
              href="/departments"
              className="hidden sm:inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest hover:text-surrey-gold transition-colors"
              style={{ color: "#263C55" }}
            >
              View all <span className="text-surrey-gold">→</span>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: "rgba(38,60,85,0.1)" }}>
            {DEPARTMENTS.map((dept) => (
              <div
                key={dept.name}
                className="group bg-white p-8 flex flex-col hover:bg-[#263C55] transition-colors duration-300 relative overflow-hidden"
              >
                <span className="font-mono text-[9px] text-surrey-gold/50 group-hover:text-surrey-gold/70 uppercase tracking-widest mb-6 transition-colors">
                  {dept.num} ——
                </span>
                <h3 className="font-serif text-xl font-semibold mb-4 leading-snug transition-colors text-[#263C55] group-hover:text-white">
                  {dept.name}
                </h3>
                <p className="text-sm leading-relaxed mb-6 transition-colors text-[#263C55]/50 group-hover:text-white line-clamp-3">
                  {dept.desc}
                </p>
                <span className="font-mono text-[9px] text-surrey-gold border border-surrey-gold/30 group-hover:border-surrey-gold/60 px-2 py-0.5 uppercase tracking-widest w-fit mb-auto transition-colors">
                  {dept.sector}
                </span>
                <Link
                  href={`/departments/${dept.slug}`}
                  className="text-surrey-gold font-mono text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-2 group-hover:gap-3 transition-all mt-6 w-fit"
                >
                  Explore <span>→</span>
                </Link>
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-surrey-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/departments"
              className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest hover:text-surrey-gold transition-colors"
              style={{ color: "#263C55" }}
            >
              View all departments <span className="text-surrey-gold">→</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ── PANEL 5 · PUBLICATIONS + UPDATES ───────────────────────────────── */}
      <section id="publications" className="panel min-h-screen bg-white flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-16">

            {/* Publications */}
            <div>
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-surrey-gold shrink-0" />
                <span className="font-mono text-surrey-gold text-[11px] uppercase tracking-[0.22em]">Research</span>
              </div>
              <h2
                className="font-serif font-semibold mb-12 leading-tight"
                style={{ color: "#263C55", fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
              >
                Latest Publications
              </h2>

              <div className="border-t" style={{ borderColor: "rgba(38,60,85,0.08)" }}>
                {recentReports.length > 0 ? (
                  recentReports.map((pub, i) => (
                    <div
                      key={pub.id}
                      className="border-b border-l-2 border-l-transparent hover:border-l-surrey-gold py-7 pl-5 group transition-all duration-200"
                      style={{ borderBottomColor: "rgba(38,60,85,0.06)" }}
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="font-mono text-surrey-gold text-[10px] uppercase tracking-widest border border-surrey-gold/30 px-2 py-0.5">
                              [{formatDepartment(pub.department)}]
                            </span>
                            <span className="text-[10px]" style={{ color: "rgba(38,60,85,0.3)" }}>·</span>
                            <span
                              className="font-mono text-[10px]"
                              style={{ color: "rgba(38,60,85,0.4)" }}
                              suppressHydrationWarning
                            >
                              {new Date(pub.createdAt)
                                .toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })
                                .replace(/\//g, "-")}
                            </span>
                          </div>
                          <h3
                            className="font-serif text-xl font-semibold leading-snug group-hover:text-surrey-gold/80 transition-colors"
                            style={{ color: "#263C55" }}
                          >
                            {pub.title}
                          </h3>
                          <a
                            href={pub.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest hover:text-surrey-gold transition-colors mt-4"
                            style={{ color: "#263C55" }}
                          >
                            Read Report <span className="text-surrey-gold">→</span>
                          </a>
                        </div>
                        <span className="font-mono text-sm shrink-0 pt-0.5" style={{ color: "rgba(38,60,85,0.18)" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    className="py-12 text-center text-sm border-b"
                    style={{ color: "rgba(38,60,85,0.4)", borderColor: "rgba(38,60,85,0.08)" }}
                  >
                    No publications yet — check back soon.
                  </div>
                )}
              </div>

              <div className="mt-10">
                <Link
                  href="/publications"
                  className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest hover:text-surrey-gold transition-colors group"
                  style={{ color: "#263C55" }}
                >
                  View Full Archive
                  <span className="text-surrey-gold group-hover:translate-x-1 inline-block transition-transform">→</span>
                </Link>
              </div>
            </div>

            {/* Updates */}
            <div>
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-surrey-gold shrink-0" />
                <span className="font-mono text-surrey-gold text-[11px] uppercase tracking-[0.22em]">Updates</span>
              </div>
              <h2
                className="font-serif font-semibold mb-12 leading-tight"
                style={{ color: "#263C55", fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
              >
                Latest Updates
              </h2>
              <LinkedInFeed />
            </div>

          </div>
        </div>
      </section>

      {/* ── PANEL 6 · CTA ─────────────────────────────────────────────────────
            Last panel — does not fall back */}
      <section className="panel min-h-screen flex items-center relative" style={{ backgroundColor: "#263C55" }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(172,151,65,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(172,151,65,0.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(172,151,65,0.3), transparent)" }}
        />

        <div className="relative z-10 w-full max-w-3xl mx-auto px-6 text-center py-24">

          <div className="flex items-center justify-center gap-4 mb-10">
            <span className="w-12 h-px shrink-0" style={{ backgroundColor: "rgba(172,151,65,0.4)" }} />
            <span className="font-mono text-surrey-gold text-[11px] uppercase tracking-[0.22em]">Join the Team</span>
            <span className="w-12 h-px shrink-0" style={{ backgroundColor: "rgba(172,151,65,0.4)" }} />
          </div>

          <h2
            className="font-serif text-white font-semibold leading-tight mb-8"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            {settings?.ctaHeading ?? "Ready to Join the Team?"}
          </h2>

          <p className="text-base leading-relaxed mb-4 max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            {settings?.ctaSubtext ??
              "We are always looking for driven individuals with a passion for financial markets. Apply to join one of our research desks."}
          </p>

          <p className="font-mono text-xs uppercase tracking-widest mb-14" style={{ color: "rgba(172,151,65,0.5)" }}>
            Apply for the 2026 Cohort — deadline 15 May
          </p>

          <Link
            href="/contact"
            className="bg-surrey-gold text-white px-10 py-4 font-mono text-[11px] font-bold uppercase tracking-widest border border-surrey-gold hover:bg-transparent hover:text-surrey-gold transition-colors duration-200 inline-block"
          >
            Apply Now →
          </Link>

        </div>
      </section>

    </div>
  );
}
