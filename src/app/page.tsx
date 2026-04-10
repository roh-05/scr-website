import Link from "next/link";
import Image from "next/image";

import LinkedInFeed from "@/components/LinkedInFeed";
import prisma from "@/lib/prisma";
import { getSiteSettings } from "@/actions/settings";

// Helper to format the Prisma ENUMs (e.g., 'EQUITY_RESEARCH' -> 'Equity Research')
const formatDepartment = (dept: string) => {
  return dept
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

export default async function Home() {
  // 1. Fetch live data from the database
  const settingsResult = await getSiteSettings();
  const settings = (settingsResult.success ? settingsResult.data : null) as any;
  
  // 2. Fetch the 3 most recently published reports
  const recentReports = await prisma.report.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  // 3. Fetch live stats
  const activeMembersCount = await prisma.teamMember.count({ where: { status: 'ACTIVE' } });
  const alumniCount = await prisma.teamMember.count({ where: { status: 'ALUMNI' } });
  const reportsCount = await prisma.report.count({ where: { status: 'PUBLISHED' } });

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section (Updated 50/50 Split) */}
      <section className="bg-surrey-blue text-white py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Column: Text & CTA */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              {settings?.heroTitle || "Student-Led Financial Excellence"}
            </h1>
            <p className="text-lg md:text-xl mb-10 text-gray-300 leading-relaxed max-w-lg">
              {settings?.heroSubtitle || "Surrey Capital Research is the premier student-led financial organization bridging the gap between academic theory and institutional market reality."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/publications"
                className="bg-surrey-gold text-surrey-blue px-8 py-3 rounded-md font-bold hover:bg-[#c2aa4a] transition-colors shadow-lg"
              >
                Read Our Research
              </Link>
              <Link
                href="/departments"
                className="bg-transparent border-2 border-surrey-gold text-surrey-gold px-8 py-3 rounded-md font-bold hover:bg-surrey-gold hover:text-surrey-blue transition-colors"
              >
                Explore Departments
              </Link>
            </div>
          </div>

          {/* Right Column: Abstract Data Visualization */}
          <div className="relative h-[300px] sm:h-[400px] lg:h-[450px] w-full rounded-xl overflow-hidden shadow-2xl border border-text-muted/30">
            <Image
              src={settings?.heroImageUrl || "/hero-visual.webp"}
              alt="Abstract quantitative data visualization"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {/* Subtle overlay to blend the image perfectly with your dark slate theme */}
            <div className="absolute inset-0 bg-surrey-blue/20 mix-blend-multiply"></div>
          </div>

        </div>
      </section>

      {/* 2. Credibility Statistics Bar */}
      <section className="bg-surrey-blue text-white py-12 border-y border-surrey-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-surrey-gold/30">
            <div className="pt-4 md:pt-0">
              <div className="text-4xl md:text-5xl font-extrabold text-surrey-gold mb-2">{activeMembersCount}</div>
              <div className="text-xs md:text-sm uppercase tracking-widest text-gray-300 font-bold">Active Analysts</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-4xl md:text-5xl font-extrabold text-surrey-gold mb-2">{reportsCount}</div>
              <div className="text-xs md:text-sm uppercase tracking-widest text-gray-300 font-bold">Published Reports</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-4xl md:text-5xl font-extrabold text-surrey-gold mb-2">{alumniCount}</div>
              <div className="text-xs md:text-sm uppercase tracking-widest text-gray-300 font-bold">Total Alumni</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission Statement */}
      <section className="py-16 bg-surrey-light px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-surrey-blue mb-6">
            {settings?.missionTitle || "Our Mission"}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {settings?.missionDescription || "Surrey Capital Research is the University of Surrey's premier financial organization. We bridge the gap between academic theory and front-office reality by producing rigorous, unbiased market analysis."}
          </p>
        </div>
      </section>

      {/* 3. Department Highlights */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-bold text-surrey-blue">Research Departments</h2>
            <Link href="/departments" className="text-surrey-gold font-semibold hover:underline hidden sm:block">
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
              <div key={dept.name} className="bg-surrey-light rounded-lg p-6 border-t-4 border-surrey-gold shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-surrey-blue mb-3">{dept.name}</h3>
                <p className="text-surrey-blue/80 mb-6 text-sm">{dept.desc}</p>
                <Link href={`/departments/${dept.slug}`} className="text-surrey-blue font-semibold text-sm hover:text-surrey-gold transition-colors">
                  Learn more &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Publications & LinkedIn (Split Layout) */}
      <section className="py-20 bg-surrey-light px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Featured Publications (Database Driven) */}
          <div>
            <h2 className="text-3xl font-bold text-surrey-blue mb-8">Latest Publications</h2>
            <div className="space-y-6">
              {recentReports.length > 0 ? (
                recentReports.map((pub) => (
                  <div key={pub.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:border-surrey-gold transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-surrey-gold">
                        {formatDepartment(pub.department)}
                      </span>
                      <span className="text-xs text-text-muted">
                        {new Date(pub.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-surrey-blue mb-3">{pub.title}</h3>
                    <a 
                      href={pub.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-surrey-blue font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      Read Report &rarr;
                    </a>
                  </div>
                ))
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center text-text-muted">
                  No publications have been uploaded yet. Check back soon!
                </div>
              )}
            </div>
            <div className="mt-8">
              <Link href="/publications" className="inline-block bg-surrey-blue text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#2a3c50] transition-colors">
                View Publication Archive
              </Link>
            </div>
          </div>

          {/* Custom JSON LinkedIn Feed */}
          <div className="flex flex-col h-full">
            <h2 className="text-3xl font-bold text-surrey-blue mb-8">Latest Updates</h2>
            <div className="flex-1 min-h-0">
              <LinkedInFeed />
            </div>
          </div>

        </div>
      </section>

      {/* 5. Call to Action */}
      <section className="bg-surrey-blue text-white py-16 text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4">
          {settings?.ctaHeading || "Ready to Join the Team?"}
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          {settings?.ctaSubtext || "We are always looking for driven individuals with a passion for financial markets. Apply to join one of our research desks and gain hands-on experience in institutional-grade analysis."}
        </p>
        <Link
          href="/contact"
          className="bg-surrey-gold text-surrey-blue px-8 py-3 rounded-md font-bold hover:bg-[#c2aa4a] transition-colors shadow-lg inline-block"
        >
          Get in Touch
        </Link>
      </section>
    </div>
  );
}