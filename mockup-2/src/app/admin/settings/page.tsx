"use client";

import { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings } from "@/actions/settings";
import { 
  Save, 
  Globe, 
  Mail, 
  MapPin, 
  Link as LinkIcon, 
  Settings2,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  Building2
} from "lucide-react";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // State to hold the live database data
  const [formData, setFormData] = useState({
    organizationName: "",
    universityAffiliation: "",
    globalDescription: "",
    contactEmail: "",
    linkedinUrl: "",
    officeAddress: "",
    maintenanceMode: false,
    equityEmail: "",
    mnaEmail: "",
    quantEmail: "",
    economicsEmail: "",
  });

  // 1. Fetch settings on page load
  useEffect(() => {
    async function loadSettings() {
      const result = await getSiteSettings();
      if (!result.success) {
        console.error("Failed to load settings:", result.error);
      } else if (result.data) {
        setFormData((prev) => ({ ...prev, ...(result.data as any) }));
      }
      setIsLoading(false);
    }
    loadSettings();
  }, []);

  // 2. Handle saving to the database
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    
    // We only send truthy updates
    const result = await updateSiteSettings(formData);
    
    setIsSaving(false);
    if (result.success) {
      setSaveSuccess(true);
      // Reset the success button visually after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert(result.error || "Failed to save settings.");
    }
  };

  // 3. Helper to update form state cleanly
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Loading State UI
  if (isLoading) {
    return (
      <main className="p-8 lg:p-12 max-w-5xl flex justify-center items-center min-h-[50vh]">
        <div className="flex items-center gap-3 text-surrey-blue font-bold">
          <Loader2 className="animate-spin text-surrey-gold" size={24} />
          Loading Settings Vault...
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 lg:p-12 max-w-5xl">
      
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surrey-blue flex items-center gap-3">
            <Settings2 className="text-surrey-gold" size={28} />
            Website Editing
          </h1>
          <p className="text-text-muted mt-1">Manage global website configurations, contact details, edit UI elements and SEO.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`px-8 py-3 rounded-lg font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
            saveSuccess 
              ? "bg-green-600 text-white" 
              : "bg-surrey-blue text-surrey-light hover:bg-surrey-blue/90"
          } disabled:opacity-70`}
        >
          {isSaving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : saveSuccess ? <><CheckCircle2 size={18} /> Saved</> : <><Save size={18} /> Save Changes</>}
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
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-surrey-blue">University Affiliation</label>
              <input 
                type="text" 
                name="universityAffiliation"
                value={formData.universityAffiliation}
                onChange={handleChange}
                className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-bold text-surrey-blue">Global Site Description (SEO)</label>
              <textarea 
                rows={3}
                name="globalDescription"
                value={formData.globalDescription}
                onChange={handleChange}
                className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all resize-none" 
              />
              <p className="text-xs text-text-muted">This text appears in Google search results and link previews.</p>
            </div>
          </div>
        </section>

        {/* ── CONTACT & SOCIAL ── */}
        <section className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm">
          <h2 className="text-xl font-bold text-surrey-blue mb-6 flex items-center gap-2 border-b border-surrey-grey/30 pb-4">
            <Mail className="text-surrey-gold" size={20} /> Primary Contact & Social
          </h2>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-surrey-blue">Global Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input 
                    type="email" 
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
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
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
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
                  name="officeAddress"
                  value={formData.officeAddress}
                  onChange={handleChange}
                  className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all resize-none" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── DEPARTMENT EMAILS ── */}
        <section className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm">
          <h2 className="text-xl font-bold text-surrey-blue mb-6 flex items-center gap-2 border-b border-surrey-grey/30 pb-4">
            <Building2 className="text-surrey-gold" size={20} /> Department Desks Email Routing
          </h2>
          <p className="text-sm text-text-muted mb-6 -mt-2">
            These emails are publicly displayed on the Contact page for desk-specific inquiries.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-surrey-blue">Equity Research</label>
              <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input 
                  type="email" 
                  name="equityEmail"
                  value={formData.equityEmail}
                  onChange={handleChange}
                  className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-surrey-blue">Mergers & Acquisitions</label>
              <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input 
                  type="email" 
                  name="mnaEmail"
                  value={formData.mnaEmail}
                  onChange={handleChange}
                  className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-surrey-blue">Quantitative Finance</label>
              <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input 
                  type="email" 
                  name="quantEmail"
                  value={formData.quantEmail}
                  onChange={handleChange}
                  className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-surrey-blue">Economic Research</label>
              <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input 
                  type="email" 
                  name="economicsEmail"
                  value={formData.economicsEmail}
                  onChange={handleChange}
                  className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" 
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
              onClick={() => setFormData(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 focus:ring-offset-2 ${
                formData.maintenanceMode ? 'bg-red-600' : 'bg-surrey-grey'
              }`}
            >
              <span className="sr-only">Toggle Maintenance Mode</span>
              <span 
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.maintenanceMode ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

      </form>
    </main>
  );
}