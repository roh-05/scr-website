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
  },
  {
    num: "02",
    name: "Mergers & Acquisitions",
    desc: "Strategic rationale, synergy analysis, and financial structuring of major corporate events.",
    slug: "ma",
  },
  {
    num: "03",
    name: "Quantitative Research",
    desc: "Data-driven trading strategies, factor models, and algorithmic frameworks.",
    slug: "quantitative-research",
  },
  {
    num: "04",
    name: "Economic Research",
    desc: "Macro forecasting, central bank policy analysis, and geopolitical market research.",
    slug: "economic-research",
  },
];

export default function HomeClient({
  settings,
  recentReports,
  activeMembersCount,
  alumniCount,
  reportsCount,
}: HomeClientProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-eyebrow", { y: 14, opacity: 0, duration: 0.6 })
      .from(".hero-title", { y: 52, opacity: 0, duration: 1.1 }, "-=0.3")
      .from(".hero-body", { y: 24, opacity: 0, duration: 0.8 }, "-=0.5")
      .from(".hero-ctas > *", { y: 16, opacity: 0, duration: 0.5, stagger: 0.12 }, "-=0.4");

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
  }, { scope: container });

  return (
    <div className="flex flex-col min-h-screen" ref={container}>

      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section className="bg-surrey-blue min-h-[80vh] flex items-center relative">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="hero-eyebrow inline-flex items-center gap-3 mb-8 justify-center">
            <span className="block w-8 h-px bg-surrey-gold shrink-0" />
            <span className="font-mono text-surrey-gold text-[11px] uppercase tracking-[0.2em]">
              University of Surrey
            </span>
            <span className="block w-8 h-px bg-surrey-gold shrink-0" />
          </div>

          <h1 className="hero-title font-serif text-white font-bold leading-[1.05] tracking-tight mb-8 text-6xl md:text-7xl lg:text-8xl">
            {settings?.heroTitle ?? (
              <>Student&#8209;Led<br />Financial<br />Excellence</>
            )}
          </h1>

          <p className="hero-body text-white/60 text-lg leading-relaxed mb-12 max-w-xl mx-auto">
            {settings?.heroSubtitle ??
              "Surrey Capital Research bridges the gap between academic theory and institutional market reality through rigorous, unbiased analysis."}
          </p>

          <div className="hero-ctas flex flex-wrap gap-4 justify-center">
            <Link
              href="/publications"
              className="bg-surrey-gold text-surrey-blue px-8 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-[#c2aa4a] transition-colors"
            >
              Read Our Research
            </Link>
            <Link
              href="/departments"
              className="bg-white text-surrey-blue px-8 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-surrey-light transition-colors"
            >
              Our Departments
            </Link>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-surrey-gold/40 to-transparent" />
      </section>

      {/* ─── STATS BAND ────────────────────────────────────────────────── */}
      <section className="stats-section bg-[#f0ead8] border-b border-surrey-gold/20 py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 divide-x divide-surrey-gold/25">
          {[
            { label: "Active Analysts", value: activeMembersCount },
            { label: "Published Reports", value: reportsCount },
            { label: "Total Alumni", value: alumniCount },
          ].map((s, i) => (
            <div key={i} className="px-6 sm:px-10 text-center">
              <div
                className="font-mono text-surrey-blue font-bold stat-number text-4xl sm:text-5xl"
                data-value={s.value}
              >
                {s.value}
              </div>
              <div className="text-text-muted text-[10px] uppercase tracking-[0.18em] mt-1.5 font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── MISSION ───────────────────────────────────────────────────── */}
      <section className="reveal-on-scroll bg-white py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-10">
            <span className="w-8 h-px bg-surrey-gold shrink-0" />
            <span className="font-mono text-surrey-gold text-[11px] uppercase tracking-[0.2em]">
              {settings?.missionTitle ?? "Our Mission"}
            </span>
          </div>
          <blockquote className="font-serif text-surrey-blue font-semibold leading-[1.3] text-3xl md:text-4xl lg:text-[2.65rem]">
            &ldquo;
            {settings?.missionDescription ??
              "We bridge the gap between academic theory and front-office reality — producing rigorous, unbiased market analysis and preparing the next generation of financial professionals."}
            &rdquo;
          </blockquote>
        </div>
      </section>

      {/* ─── DEPARTMENTS ───────────────────────────────────────────────── */}
      <section className="reveal-on-scroll py-24 bg-surrey-light px-4 sm:px-6 lg:px-8">
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

          {/* gap-px + bg colour = 1px gridlines */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-surrey-grey/35">
            {DEPARTMENTS.map((dept) => (
              <div
                key={dept.name}
                className="reveal-card group bg-white p-8 flex flex-col hover:bg-surrey-blue transition-colors duration-300"
              >
                <span className="font-mono text-[10px] text-surrey-gold/40 group-hover:text-surrey-gold/60 uppercase tracking-widest mb-6 transition-colors">
                  {dept.num}
                </span>
                <h3 className="font-serif text-surrey-blue group-hover:text-white text-xl font-semibold mb-4 leading-snug transition-colors">
                  {dept.name}
                </h3>
                <p className="text-body-text/55 group-hover:text-white/55 text-sm leading-relaxed flex-grow mb-8 transition-colors">
                  {dept.desc}
                </p>
                <Link
                  href={`/departments/${dept.slug}`}
                  className="text-surrey-gold text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 group-hover:gap-3 transition-all mt-auto w-fit"
                >
                  Explore <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PUBLICATIONS + UPDATES ────────────────────────────────────── */}
      <section className="reveal-on-scroll py-24 bg-white px-4 sm:px-6 lg:px-8">
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
                  <div key={pub.id} className="reveal-card border-b border-surrey-grey/40 py-7 group">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="font-mono text-surrey-gold text-[10px] uppercase tracking-widest">
                            {formatDepartment(pub.department)}
                          </span>
                          <span className="text-surrey-grey/60 text-[10px]">·</span>
                          <span className="text-text-muted text-[10px]" suppressHydrationWarning>
                            {new Date(pub.createdAt).toLocaleDateString("en-GB", {
                              month: "short",
                              year: "numeric",
                            })}
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
        className="reveal-on-scroll bg-surrey-blue relative overflow-hidden py-28 text-center px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-surrey-gold/35 to-transparent" />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="w-8 h-px bg-surrey-gold shrink-0" />
            <span className="font-mono text-surrey-gold text-[11px] uppercase tracking-[0.2em]">Join the Team</span>
            <span className="w-8 h-px bg-surrey-gold shrink-0" />
          </div>
          <h2 className="font-serif text-white text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-8">
            {settings?.ctaHeading ?? "Ready to Join the Team?"}
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-12 max-w-xl mx-auto">
            {settings?.ctaSubtext ??
              "We are always looking for driven individuals with a passion for financial markets. Apply to join one of our research desks."}
          </p>
          <Link
            href="/contact"
            className="bg-surrey-gold text-surrey-blue px-10 py-4 font-bold text-sm uppercase tracking-wider hover:bg-[#c2aa4a] transition-colors inline-block"
          >
            Get in Touch
          </Link>
        </div>
      </section>

    </div>
  );
}
