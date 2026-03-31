import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import LinkedInFeed from "@/components/LinkedInFeed";

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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
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
              { name: "Equity Research", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", slug: "equity-research" },
              { name: "M&A", desc: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", slug: "ma" },
              { name: "Quantitative Research", desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.", slug: "quantitative-research" },
              { name: "Economic Research", desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.", slug: "economic-research" },
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

          {/* Custom JSON LinkedIn Feed */}
          {/* Custom JSON LinkedIn Feed */}
          <div className="flex flex-col h-full">
            <h2 className="text-3xl font-bold text-surrey-blue mb-8">Latest Updates</h2>
            {/* The wrapper must explicitly say flex-1 to push the component to fill the space */}
            <div className="flex-1 min-h-0">
              <LinkedInFeed />
            </div>
          </div>

        </div>
      </section>

      {/* 5. Call to Action */}
      <section className="bg-surrey-blue text-white py-16 text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4">Ready to Join the Team?</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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