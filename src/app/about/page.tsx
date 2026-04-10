import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSiteSettings } from "@/actions/settings";
import * as LucideIcons from "lucide-react";
import { 
  BarChart3, 
  Briefcase, 
  Calculator, 
  Globe, 
  ChevronDown, 
  ArrowRight 
} from "lucide-react";

// Helper to render lucide icons from string name
const DynamicIcon = ({ name, className, size = 24 }: { name: string, className?: string, size?: number }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  return <IconComponent className={className} size={size} />;
};

export default async function AboutPage() {
  // 1. Fetch live data from the database
  const settingsResult = await getSiteSettings();
  const settings = (settingsResult.success ? settingsResult.data : null) as any;

  // 2. Fetch the leadership team directly from your Postgres database
  const leadershipTeam = await prisma.teamMember.findMany({
    where: { 
      status: 'ACTIVE',
      isLeadership: true 
    },
    orderBy: { lastName: 'asc' }
  });

  const researchAreas = settings?.researchAreas || [];
  const faqs = settings?.faqs || [];

  return (
    <div className="bg-surrey-light min-h-screen">
      
      {/* 1. WHO WE ARE (Hero Section) */}
      <section className="bg-surrey-blue text-surrey-light pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-sm font-bold text-surrey-gold uppercase tracking-[0.2em] mb-4">Who We Are</h1>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
               {settings?.aboutHeroTitle || "Student-Led. Institutional Standards."}
            </h2>
            <p className="text-surrey-light/80 text-lg leading-relaxed mb-6">
              {settings?.aboutHeroDescription1 || "Surrey Capital Research is the University of Surrey's premier financial organization. We bridge the gap between academic theory and front-office reality by producing rigorous, unbiased market analysis."}
            </p>
            <p className="text-surrey-light/80 text-lg leading-relaxed">
              {settings?.aboutHeroDescription2 || "Our mission is to empower the next generation of financial leaders by providing hands-on experience in financial modeling, macroeconomic forecasting, and strategic advisory."}
            </p>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden border border-surrey-light/10 bg-surrey-blue/50 shadow-2xl">
            {settings?.aboutHeroImageUrl ? (
               <Image 
                src={settings.aboutHeroImageUrl} 
                alt="About Hero Visual"
                fill
                className="object-cover"
              />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center flex-col text-surrey-light/30">
                  <span className="font-bold tracking-widest uppercase">Placeholder Image</span>
                  <span className="text-sm">Recommend: Group Photo</span>
                </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. WHAT WE RESEARCH */}
      <section className="py-24 px-6 bg-surrey-beige border-b border-surrey-grey/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-surrey-blue mb-4">
              {settings?.researchTitle || "What We Research"}
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              {settings?.researchIntro || "Our organization is divided into four specialized desks, each operating with the rigor of a professional financial institution."}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchAreas.map((area: any, idx: number) => (
              <Link 
                href={area.href || "#"} 
                key={idx}
                className="bg-surrey-light p-8 rounded-2xl shadow-sm border border-surrey-grey/40 hover:shadow-md hover:border-surrey-gold/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-surrey-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <DynamicIcon name={area.iconName || "BarChart3"} className="text-surrey-gold" />
                </div>
                <h3 className="text-lg font-bold text-surrey-blue mb-3">{area.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {area.description}
                </p>
              </Link>
            ))}
            {researchAreas.length === 0 && (
               <div className="col-span-full py-12 text-center text-text-muted italic">Research areas are being updated...</div>
            )}
          </div>
        </div>
      </section>

      {/* 3. LEADERSHIP TEAM (Database Driven) */}
      <section className="py-24 px-6 bg-surrey-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-surrey-blue mb-4">Leadership Team</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              {settings?.leadershipIntro || "Meet the executive committee dedicated to driving the strategic vision and research quality of Surrey Capital Research."}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-12">
            {leadershipTeam.length > 0 ? (
              leadershipTeam.map((leader) => (
                <div key={leader.id} className="flex flex-col items-center text-center w-48">
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
                        src="/linkedin.svg" 
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
              <p className="w-full text-center text-text-muted">Leadership team profiles are currently being updated.</p>
            )}
          </div>
        </div>
      </section>

      {/* 4. JOIN US (CTA) */}
      <section className="bg-surrey-gold py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-surrey-light mb-6">
            {settings?.joinHeading || "Ready to Accelerate Your Career?"}
          </h2>
          <p className="text-surrey-light/90 text-lg mb-8 max-w-2xl mx-auto font-medium">
            {settings?.joinText || "Applications for the upcoming semester are currently open. Join a network of driven individuals and build the skills required for the modern financial sector."}
          </p>
          <a 
            href={settings?.joinUrl || "https://linkedin.com/company/surrey-capital-research"} 
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
            {faqs.map((faq: any, idx: number) => (
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
            {faqs.length === 0 && (
               <div className="text-center py-8 text-text-muted italic">No FAQs available at this time.</div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}