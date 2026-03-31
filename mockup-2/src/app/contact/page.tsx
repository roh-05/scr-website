// src/app/contact/page.tsx
import Image from "next/image";
import { getSiteSettings } from "@/actions/settings";
import { 
  Mail, 
  MapPin, 
  Building2, 
  MessageSquare
} from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default async function ContactPage() {
  // Fetch settings directly as a Server Component
  const settingsResult = await getSiteSettings();
  const settings = settingsResult.success && settingsResult.data
    ? (settingsResult.data as any)
    : {
        contactEmail: "contact@surreycapital.org",
        officeAddress: "Surrey Business School\nUniversity of Surrey\nGuildford, GU2 7XH\nUnited Kingdom",
        linkedinUrl: "https://linkedin.com/company/surrey-capital-research",
        equityEmail: "equities@surreycapital.org",
        mnaEmail: "mna@surreycapital.org",
        quantEmail: "quant@surreycapital.org",
        economicsEmail: "economics@surreycapital.org",
      };

  const dynamicDepartmentContacts = [
    { name: "Equity Research", email: settings.equityEmail || "equities@surreycapital.org" },
    { name: "Mergers & Acquisitions", email: settings.mnaEmail || "mna@surreycapital.org" },
    { name: "Quantitative Finance", email: settings.quantEmail || "quant@surreycapital.org" },
    { name: "Economic Research", email: settings.economicsEmail || "economics@surreycapital.org" },
  ];

  return (
    <div className="bg-surrey-light min-h-screen pb-24">
      
      {/* ── HERO SECTION ── */}
      <section className="bg-surrey-blue text-surrey-light pt-28 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-sm font-bold text-surrey-gold uppercase tracking-[0.2em] mb-4">Get in Touch</h1>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Contact <span className="text-surrey-gold">Our Team</span>
          </h2>
          <p className="text-surrey-light/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Whether you are a prospective analyst, a corporate partner, or an alumnus, we welcome your inquiries. Reach out to us using the form below or contact a specific department directly.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT GRID ── */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* LEFT COLUMN: General Enquiries Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-surrey-grey/30 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-surrey-gold/10 flex items-center justify-center">
                <MessageSquare className="text-surrey-gold" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-surrey-blue">General Enquiries</h2>
            </div>

            <ContactForm />
          </div>

          {/* RIGHT COLUMN: Directory & Socials */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Department Contacts */}
            <div className="bg-surrey-beige rounded-2xl border border-surrey-grey/40 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-surrey-blue/10 flex items-center justify-center">
                  <Building2 className="text-surrey-blue" size={20} />
                </div>
                <h2 className="text-xl font-bold text-surrey-blue">Department Desks</h2>
              </div>
              
              <ul className="space-y-5">
                {/* Global Contact injected from Database */}
                <li className="group pb-5 border-b border-surrey-grey/30">
                  <p className="text-sm font-bold text-surrey-blue mb-1">General Office</p>
                  <a 
                    href={`mailto:${settings.contactEmail}`} 
                    className="text-text-muted hover:text-surrey-gold text-sm flex items-center gap-2 transition-colors"
                  >
                    <Mail size={14} /> {settings.contactEmail}
                  </a>
                </li>

                {dynamicDepartmentContacts.map((dept, idx) => (
                  <li key={idx} className="group">
                    <p className="text-sm font-bold text-surrey-blue mb-1">{dept.name}</p>
                    <a 
                      href={`mailto:${dept.email}`} 
                      className="text-text-muted hover:text-surrey-gold text-sm flex items-center gap-2 transition-colors"
                    >
                      <Mail size={14} /> {dept.email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Location & Socials */}
            <div className="bg-surrey-blue rounded-2xl shadow-lg border border-surrey-blue p-8 text-surrey-light">
              <h2 className="text-xl font-bold mb-6 text-surrey-light">Connect With Us</h2>
              
              <div className="flex items-start gap-3 mb-8">
                <MapPin size={20} className="text-surrey-gold mt-1 shrink-0" />
                <p className="text-surrey-light/80 text-sm leading-relaxed whitespace-pre-line">
                  {settings.officeAddress}
                </p>
              </div>

              <div className="pt-6 border-t border-surrey-light/10">
                <p className="text-xs font-bold uppercase tracking-wider text-surrey-gold mb-4">Follow Our Network</p>
                <a 
                  href={settings.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-surrey-gold transition-colors group"
                  aria-label="Connect on LinkedIn"
                >
                   <Image 
                    src="/images/linkedin.svg" 
                    alt="LinkedIn" 
                    width={22} 
                    height={22} 
                    className="brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300" 
                  />
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}