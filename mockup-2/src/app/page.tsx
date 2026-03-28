import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section (Updated 50/50 Split) */}
      <section className="bg-surrey-blue text-white py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Column: Text & CTA */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Student-Led <br className="hidden lg:block" />
              <span className="text-surrey-gold">Financial Excellence</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-gray-300 leading-relaxed max-w-lg">
              Surrey Capital Research is the premier student-run investment and economic research group at the University of Surrey. We deliver institutional-quality insights across global markets.
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
            {/* Make sure to drop an image named "hero-visual.jpg" 
              into your /public folder! 
            */}
            <Image
              src="/hero-visual.webp"
              alt="Abstract quantitative data visualization"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw" /* Add this line! */
              className="object-cover"
              priority
            />
            {/* Subtle overlay to blend the image perfectly with your dark slate theme */}
            <div className="absolute inset-0 bg-surrey-blue/20 mix-blend-multiply"></div>
          </div>

        </div>
      </section>

      {/* 2. Mission Statement */}
      <section className="py-16 bg-surrey-light px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-surrey-blue mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            To bridge the gap between academic theory and financial industry practice. We empower University of Surrey students by providing a rigorous platform to develop analytical skills, produce actionable investment research, and build a network of future financial leaders.
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
              { name: "Equity Research", desc: "Fundamental analysis and valuation of publicly traded companies.", slug: "equity-research" },
              { name: "M&A", desc: "Tracking deal flow, strategic rationale, and synergies in global transactions.", slug: "ma" },
              { name: "Quantitative Research", desc: "Data-driven strategies, algorithmic modeling, and risk management.", slug: "quantitative-research" },
              { name: "Economic Research", desc: "Macroeconomic trends, monetary policy, and global market forecasting.", slug: "economic-research" },
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

          {/* Featured Publications */}
          <div>
            <h2 className="text-3xl font-bold text-surrey-blue mb-8">Latest Publications</h2>
            <div className="space-y-6">
              {[
                { title: "Q3 Global Macro Outlook", dept: "Economic Research", date: "Oct 2025" },
                { title: "Initiating Coverage: Tech Sector", dept: "Equity Research", date: "Sep 2025" },
                { title: "Volatility Modeling via Machine Learning", dept: "Quantitative Research", date: "Aug 2025" },
              ].map((pub, i) => (
                <div key={i} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:border-surrey-gold transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-surrey-gold">{pub.dept}</span>
                    <span className="text-xs text-text-muted">{pub.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-surrey-blue mb-3">{pub.title}</h3>
                  <Link href="/publications" className="text-sm text-surrey-blue font-semibold hover:underline">
                    Read Report &rarr;
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/publications" className="inline-block bg-surrey-blue text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#2a3c50] transition-colors">
                View Publication Archive
              </Link>
            </div>
          </div>

          {/* LinkedIn Feed Placeholder */}
          <div>
            <h2 className="text-3xl font-bold text-surrey-blue mb-8">Latest Updates</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
              <svg className="w-12 h-12 text-[#0A66C2] mb-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <h3 className="text-xl font-bold text-surrey-blue mb-2">Follow us on LinkedIn</h3>
              <p className="text-surrey-blue/80 mb-6">Stay up to date with our latest research, events, and alumni success stories.</p>
              <a
                href="https://www.linkedin.com/company/surreycapitalresearch/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0A66C2] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#084e96] transition-colors"
              >
                View LinkedIn Page
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Call to Action */}
      <section className="bg-surrey-blue text-white py-16 text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4">Ready to Join the Team?</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          We recruit highly motivated analysts at the beginning of each academic year. Check our contact page for current openings and application details.
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