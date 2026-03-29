"use client";

import { useState } from "react";
import { 
  Save, 
  Globe, 
  Mail, 
  MapPin, 
  Link as LinkIcon, 
  Settings2,
  ShieldAlert,
  CheckCircle2
} from "lucide-react";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate database update
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  return (
    <main className="p-8 lg:p-12 max-w-5xl">
      
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surrey-blue flex items-center gap-3">
            <Settings2 className="text-surrey-gold" size={28} />
            Site Settings
          </h1>
          <p className="text-text-muted mt-1">Manage global website configurations, contact details, and SEO.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`px-8 py-3 rounded-lg font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
            saveSuccess 
              ? "bg-green-600 text-white" 
              : "bg-surrey-blue text-surrey-light hover:bg-surrey-blue/90"
          }`}
        >
          {isSaving ? "Saving..." : saveSuccess ? <><CheckCircle2 size={18} /> Saved</> : <><Save size={18} /> Save Changes</>}
        </button>
      </header>

      <form className="space-y-8" onSubmit={handleSave}>
        
        {/* ── GENERAL INFORMATION ── */}
        <section className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm">
          <h2 className="text-xl font-bold text-surrey-blue mb-6 flex items-center gap-2 border-b border-surrey-grey/30 pb-4">
            <Globe className="text-surrey-gold" size={20} /> General Information
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-surrey-blue">Organization Name</label>
              <input 
                type="text" 
                defaultValue="Surrey Capital Research"
                className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-surrey-blue">University Affiliation</label>
              <input 
                type="text" 
                defaultValue="University of Surrey"
                className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-bold text-surrey-blue">Global Site Description (SEO)</label>
              <textarea 
                rows={3}
                defaultValue="Student-led equity, M&A, quantitative, and economic research."
                className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all resize-none" 
              />
              <p className="text-xs text-text-muted">This text appears in Google search results and link previews.</p>
            </div>
          </div>
        </section>

        {/* ── CONTACT & SOCIAL ── */}
        <section className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm">
          <h2 className="text-xl font-bold text-surrey-blue mb-6 flex items-center gap-2 border-b border-surrey-grey/30 pb-4">
            <Mail className="text-surrey-gold" size={20} /> Contact & Social
          </h2>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-surrey-blue">Primary Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input 
                    type="email" 
                    defaultValue="contact@surreycapital.org"
                    className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-surrey-blue">LinkedIn Page URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input 
                    type="url" 
                    defaultValue="https://linkedin.com/company/surrey-capital-research"
                    className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-surrey-blue">Office Address (Footer & Contact Page)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-text-muted" size={16} />
                <textarea 
                  rows={3}
                  defaultValue="Surrey Business School\nUniversity of Surrey\nGuildford, GU2 7XH\nUnited Kingdom"
                  className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all resize-none" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── SYSTEM & DANGER ZONE ── */}
        <section className="bg-red-50/50 p-8 rounded-2xl border border-red-100 shadow-sm">
          <h2 className="text-xl font-bold text-red-700 mb-6 flex items-center gap-2 border-b border-red-200 pb-4">
            <ShieldAlert className="text-red-600" size={20} /> System Settings
          </h2>
          
          <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-red-100">
            <div>
              <h3 className="font-bold text-surrey-blue">Maintenance Mode</h3>
              <p className="text-sm text-text-muted mt-1">
                When active, the public website will be hidden and display a "Coming Soon" or "Under Maintenance" message.
              </p>
            </div>
            
            {/* Custom Toggle Switch */}
            <button 
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 focus:ring-offset-2 ${
                maintenanceMode ? 'bg-red-600' : 'bg-surrey-grey'
              }`}
            >
              <span className="sr-only">Toggle Maintenance Mode</span>
              <span 
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  maintenanceMode ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

      </form>
    </main>
  );
}