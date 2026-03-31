import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { 
  BarChart3, 
  Briefcase, 
  Calculator, 
  Globe, 
  ChevronDown, 
  ArrowRight 
} from "lucide-react";

// --- STATIC CONFIGURATION ---
const RESEARCH_AREAS = [
  {
    title: "Equity Research",
    icon: <BarChart3 className="text-surrey-gold" size={24} />,
    description: "Fundamental analysis, financial modeling, and valuation of publicly traded companies across global sectors.",
    href: "/departments/equity-research"
  },
  {
    title: "Mergers & Acquisitions",
    icon: <Briefcase className="text-surrey-gold" size={24} />,
    description: "Strategic rationale, LBO modeling, and precedent transaction analysis for global deal flow.",
    href: "/departments/m-and-a"
  },
  {
    title: "Quantitative Finance",
    icon: <Calculator className="text-surrey-gold" size={24} />,
    description: "Algorithmic trading strategies, risk modeling, and backtesting using Python and advanced statistics.",
    href: "/departments/quantitative-research"
  },
  {
    title: "Economic Research",
    icon: <Globe className="text-surrey-gold" size={24} />,
    description: "Macroeconomic forecasting, central bank policy analysis, and global thematic trends.",
    href: "/departments/economic-research"
  }
];

const FAQS = [
  {
    question: "Do I need prior financial experience to join?",
    answer: "No. While prior knowledge is helpful, we look for genuine passion, a strong work ethic, and a willingness to learn. We provide comprehensive training for all new analysts."
  },
  {
    question: "What is the expected time commitment?",
    answer: "Members typically dedicate 5-8 hours per week. This includes weekly departmental meetings, independent research, and financial modeling workshops."
  },
  {
    question: "Can non-finance majors apply?",
    answer: "Absolutely. We have successful analysts studying Engineering, Mathematics, Computer Science, Law, and more. Diverse academic backgrounds strengthen our research."
  },
  {
    question: "When does recruitment take place?",
    answer: "We primarily recruit at the beginning of the Autumn semester, with occasional limited recruitment windows in the Spring depending on departmental needs."
  }
];

export default async function AboutPage() {
  // 1. Fetch the leadership team directly from your Postgres database
  const leadershipTeam = await prisma.teamMember.findMany({
    where: { 
      status: 'ACTIVE',
      isLeadership: true 
    },
    orderBy: { lastName: 'asc' }
  });

  return (
    <div className="bg-surrey-light min-h-screen">
      
      {/* 1. WHO WE ARE (Hero Section) */}
      <section className="bg-surrey-blue text-surrey-light pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-sm font-bold text-surrey-gold uppercase tracking-[0.2em] mb-4">Who We Are</h1>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
              Student-Led. <br/> Institutional Standards.
            </h2>
            <p className="text-surrey-light/80 text-lg leading-relaxed mb-6">
              Surrey Capital Research is the University of Surrey's premier financial organization. We bridge the gap between academic theory and front-office reality by producing rigorous, unbiased market analysis.
            </p>
            <p className="text-surrey-light/80 text-lg leading-relaxed">
              Our mission is to empower the next generation of financial leaders by providing hands-on experience in financial modeling, macroeconomic forecasting, and strategic advisory.
            </p>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden border border-surrey-light/10 bg-surrey-blue/50 shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center flex-col text-surrey-light/30">
              <span className="font-bold tracking-widest uppercase">Placeholder Image</span>
              <span className="text-sm">Recommend: Group Photo</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT WE RESEARCH */}
      <section className="py-24 px-6 bg-surrey-beige border-b border-surrey-grey/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-surrey-blue mb-4">What We Research</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Our organization is divided into four specialized desks, each operating with the rigor of a professional financial institution.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {RESEARCH_AREAS.map((area, idx) => (
              <Link 
                href={area.href} 
                key={idx}
                className="bg-surrey-light p-8 rounded-2xl shadow-sm border border-surrey-grey/40 hover:shadow-md hover:border-surrey-gold/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-surrey-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {area.icon}
                </div>
                <h3 className="text-lg font-bold text-surrey-blue mb-3">{area.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {area.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LEADERSHIP TEAM (Database Driven) */}
      <section className="py-24 px-6 bg-surrey-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-surrey-blue mb-4">Leadership Team</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Meet the executive committee dedicated to driving the strategic vision and research quality of Surrey Capital Research.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadershipTeam.length > 0 ? (
              leadershipTeam.map((leader) => (
                <div key={leader.id} className="flex flex-col items-center text-center">
                  <div className="w-40 h-40 rounded-full bg-surrey-grey/20 mb-6 overflow-hidden relative border-4 border-surrey-light shadow-lg">
                    {leader.imageUrl ? (
                      <Image 
                        src={leader.imageUrl} 
                        alt={`${leader.firstName} ${leader.lastName}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surrey-grey/30 text-surrey-blue font-bold text-2xl">
                        {leader.firstName[0]}{leader.lastName[0]}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-surrey-blue">{leader.firstName} {leader.lastName}</h3>
                  <p className="text-surrey-gold font-medium text-sm mb-4">{leader.role}</p>
                  
                  {leader.linkedinUrl && (
                    <a 
                      href={leader.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-surrey-blue flex items-center justify-center hover:bg-transparent transition-colors group border border-transparent hover:border-surrey-grey"
                      aria-label={`Connect with ${leader.firstName} on LinkedIn`}
                    >
                      <Image 
                        src="/images/linkedin.svg" 
                        alt="LinkedIn" 
                        width={18} 
                        height={18} 
                        className="brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300" 
                      />
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-text-muted">Leadership team profiles are currently being updated.</p>
            )}
          </div>
        </div>
      </section>

      {/* 4. JOIN US (CTA) */}
      <section className="bg-surrey-gold py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-surrey-light mb-6">
            Ready to Accelerate Your Career?
          </h2>
          <p className="text-surrey-light/90 text-lg mb-8 max-w-2xl mx-auto font-medium">
            Applications for the upcoming semester are currently open. Join a network of driven individuals and build the skills required for the modern financial sector.
          </p>
          <a 
            href="https://linkedin.com/company/surrey-capital-research" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-surrey-blue text-surrey-light px-8 py-4 rounded-lg font-bold hover:bg-surrey-blue/90 transition-colors shadow-lg"
          >
            Apply Now <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* 5. FAQS (CSS-Only Accordion) */}
      <section className="py-24 px-6 bg-surrey-light">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-surrey-blue mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <details 
                key={idx} 
                className="group border border-surrey-grey/50 bg-surrey-light rounded-xl overflow-hidden open:border-surrey-gold open:bg-surrey-beige transition-colors duration-200 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="w-full text-left px-6 py-5 flex items-center justify-between cursor-pointer focus:outline-none select-none">
                  <span className="font-bold text-surrey-blue pr-4">{faq.question}</span>
                  <ChevronDown 
                    className="text-surrey-gold transition-transform duration-300 shrink-0 group-open:rotate-180" 
                    size={20} 
                  />
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-text-muted leading-relaxed text-sm">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}