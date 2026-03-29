"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Mail, 
  MapPin, 
  Send, 
  Building2, 
  MessageSquare,
  CheckCircle2
} from "lucide-react";

// --- DEPARTMENT CONTACT DATA ---
const DEPARTMENT_CONTACTS = [
  { name: "Equity Research", email: "equities@surreycapital.org" },
  { name: "Mergers & Acquisitions", email: "mna@surreycapital.org" },
  { name: "Quantitative Finance", email: "quant@surreycapital.org" },
  { name: "Economic Research", email: "economics@surreycapital.org" },
];

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    setTimeout(() => {
      setFormStatus("success");
      setTimeout(() => setFormStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <div className="bg-surrey-light min-h-screen pb-24">
      
      {/* ── HERO SECTION ── */}
      {/* FIX: Increased pb-20 to pb-32 to create a much deeper blue canvas */}
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
      {/* FIX: Increased -mt-8 to -mt-16 so the panels overlap the deep blue background significantly more */}
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-bold text-surrey-blue">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required
                    className="w-full bg-surrey-beige/50 border border-surrey-grey/40 text-surrey-blue rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-bold text-surrey-blue">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    required
                    className="w-full bg-surrey-beige/50 border border-surrey-grey/40 text-surrey-blue rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-bold text-surrey-blue">Subject</label>
                <select 
                  id="subject"
                  className="w-full bg-surrey-beige/50 border border-surrey-grey/40 text-surrey-blue rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all appearance-none"
                >
                  <option value="general">General Inquiry</option>
                  <option value="recruitment">Recruitment & Applications</option>
                  <option value="partnership">Corporate Partnership</option>
                  <option value="alumni">Alumni Relations</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-bold text-surrey-blue">Message</label>
                <textarea 
                  id="message" 
                  rows={5}
                  required
                  className="w-full bg-surrey-beige/50 border border-surrey-grey/40 text-surrey-blue rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={formStatus !== "idle"}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  formStatus === "success" 
                    ? "bg-green-600 text-white" 
                    : "bg-surrey-blue text-surrey-light hover:bg-surrey-blue/90 shadow-md"
                }`}
              >
                {formStatus === "idle" && <><Send size={18} /> Send Message</>}
                {formStatus === "submitting" && "Sending..."}
                {formStatus === "success" && <><CheckCircle2 size={18} /> Message Sent Successfully</>}
              </button>
            </form>
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
                {DEPARTMENT_CONTACTS.map((dept, idx) => (
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
                <p className="text-surrey-light/80 text-sm leading-relaxed">
                  Surrey Business School<br/>
                  University of Surrey<br/>
                  Guildford, GU2 7XH<br/>
                  United Kingdom
                </p>
              </div>

              <div className="pt-6 border-t border-surrey-light/10">
                <p className="text-xs font-bold uppercase tracking-wider text-surrey-gold mb-4">Follow Our Network</p>
                <a 
                  href="https://linkedin.com/company/surrey-capital-research" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-surrey-gold transition-colors group"
                  aria-label="Connect on LinkedIn"
                >
                   <Image 
                    src="/linkedin.svg" 
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