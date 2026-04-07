"use client";

import { useState, useEffect } from "react";
import { getReports, clearAllCoverImagesStorage, updateReportCoverUrl } from "@/actions/reports";
import { extractCoverImage } from "@/lib/supabase";
import { createBrowserClient } from '@supabase/ssr';
import { 
  getSiteSettings, 
  updateSiteSettings, 
  updateFaqs, 
  updateResearchAreas, 
  updateDepartmentMetadata, 
  updateProjects 
} from "@/actions/settings";
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
  Building2,
  Home,
  Info,
  Layout,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  ExternalLink,
  MessageSquare,
  Palette
} from "lucide-react";
import { DepartmentType } from "@prisma/client";

const TABS = [
  { id: "global", label: "Global & SEO", icon: Globe },
  { id: "homepage", label: "Homepage", icon: Home },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "about", label: "About Page", icon: Info },
  { id: "departments", label: "Departments", icon: Layout },
  { id: "contact", label: "Contact Hero", icon: Mail },
];

const DEPT_LIST = [
  { type: DepartmentType.EQUITY_RESEARCH, label: "Equity Research" },
  { type: DepartmentType.MERGERS_ACQUISITIONS, label: "M&A" },
  { type: DepartmentType.QUANTITATIVE_FINANCE, label: "Quantitative Finance" },
  { type: DepartmentType.ECONOMIC_RESEARCH, label: "Economic Research" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("global");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCaching, setIsCaching] = useState(false);
  const [cacheProgress, setCacheProgress] = useState("");
  
  // State to hold all CMS data
  const [data, setData] = useState<any>({
    // SiteSettings primary fields
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
    heroTitle: "",
    heroSubtitle: "",
    heroImageUrl: "",
    missionTitle: "",
    missionDescription: "",
    ctaHeading: "",
    ctaSubtext: "",
    aboutHeroTitle: "",
    aboutHeroSubtitle: "",
    aboutHeroDescription1: "",
    aboutHeroDescription2: "",
    aboutHeroImageUrl: "",
    researchTitle: "",
    researchIntro: "",
    leadershipIntro: "",
    joinHeading: "",
    joinText: "",
    joinUrl: "",
    deptIndexTitle: "",
    deptIndexIntro: "",
    contactHeroTitle: "",
    contactHeroDescription: "",
    logoUrl: "",
    footerCopyright: "",
    primaryColor: "#3D5A80",
    accentColor: "#B8963E",
    backgroundColor: "#FFFFFF",
    secondaryBgColor: "#F7F8FA",
    mutedColor: "#6B7F94",
    borderColor: "#EBF0F5",
    headingFont: "EB Garamond",
    bodyFont: "Merriweather",

    // Arrays
    faqs: [],
    researchAreas: [],
    deptMetadata: [],
    projects: [],
  });

  // Track active department for editing
  const [activeDept, setActiveDept] = useState(DEPT_LIST[0].type);

  useEffect(() => {
    async function loadSettings() {
      const result = await getSiteSettings();
      if (result.success && result.data) {
        setData(result.data);
      }
      setIsLoading(false);
    }
    loadSettings();
  }, []);

  const handleRebuildCache = async () => {
    if (!confirm("This will delete all existing cover images and regenerate them from their PDFs. This may take a few minutes. Continue?")) return;
    
    setIsCaching(true);
    try {
      setCacheProgress("Clearing existing cache...");
      const clearResult = await clearAllCoverImagesStorage();
      if (!clearResult.success) {
        throw new Error(clearResult.error);
      }

      setCacheProgress("Fetching reports list...");
      const reportsResult = await getReports();
      if (!reportsResult.success) {
        throw new Error(reportsResult.error || "Failed to fetch reports");
      }
      if (!reportsResult.data) {
        throw new Error("Failed to fetch reports: no data returned");
      }

      const reports = reportsResult.data as any[];
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      for (let i = 0; i < reports.length; i++) {
        const report = reports[i];
        setCacheProgress(`Processing report ${i + 1} of ${reports.length}: ${report.title}`);
        
        if (!report.fileUrl) continue;
        
        try {
          const response = await fetch(report.fileUrl + "?t=" + Date.now());
          if (!response.ok) continue;
          
          const blob = await response.blob();
          const file = new File([blob], "temp.pdf", { type: "application/pdf" });
          
          const coverBlob = await extractCoverImage(file);
          if (coverBlob) {
            const baseName = Math.random().toString(36).substring(2, 15) + '_' + Date.now();
            const coverPath = `covers/${baseName}.png`;
            
            const { error: coverError } = await supabase.storage.from('reports').upload(coverPath, coverBlob);
            if (!coverError) {
              const { data: coverData } = supabase.storage.from('reports').getPublicUrl(coverPath);
              await updateReportCoverUrl(report.id, coverData.publicUrl);
            }
          }
        } catch (err) {
          console.error("Error processing report:", report.id, err);
        }
      }

      setCacheProgress("");
      alert("Cover image cache rebuilt successfully!");
    } catch (err: any) {
      alert("Error rebuilding cache: " + err.message);
      setCacheProgress("");
    } finally {
      setIsCaching(false);
    }
  };

  const handlePrimarySave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    const result = await updateSiteSettings(data);
    setIsSaving(false);
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert(result.error || "Failed to save settings.");
    }
  };

  const handleSyncFaqs = async () => {
    setIsSaving(true);
    const result = await updateFaqs(data.faqs);
    setIsSaving(false);
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert(result.error || "Failed to sync FAQs.");
    }
  };

  const handleSyncResearchAreas = async () => {
    setIsSaving(true);
    const result = await updateResearchAreas(data.researchAreas);
    setIsSaving(false);
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert(result.error || "Failed to sync Research Areas.");
    }
  };

  const handleUpdateDeptMeta = async () => {
    setIsSaving(true);
    const meta = data.deptMetadata.find((m: any) => m.department === activeDept) || { department: activeDept };
    const result = await updateDepartmentMetadata(meta);
    setIsSaving(false);
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert(result.error || "Failed to update department info.");
    }
  };

  const handleSyncProjects = async () => {
    setIsSaving(true);
    const projects = data.projects.filter((p: any) => p.department === activeDept);
    const result = await updateProjects(activeDept, projects);
    setIsSaving(false);
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert(result.error || "Failed to sync projects.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDeptMetaChange = (field: string, value: string) => {
    setData((prev: any) => {
      const existing = prev.deptMetadata.find((m: any) => m.department === activeDept);
      let newMeta;
      if (existing) {
        newMeta = prev.deptMetadata.map((m: any) => m.department === activeDept ? { ...m, [field]: value } : m);
      } else {
        newMeta = [...prev.deptMetadata, { department: activeDept, [field]: value }];
      }
      return { ...prev, deptMetadata: newMeta };
    });
  };

  // Helper to move array items
  const moveItem = (arrayName: string, index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= data[arrayName].length) return;
    
    const newArray = [...data[arrayName]];
    [newArray[index], newArray[newIndex]] = [newArray[newIndex], newArray[index]];
    setData((prev: any) => ({ ...prev, [arrayName]: newArray }));
  };

  if (isLoading) {
    return (
      <main className="p-8 lg:p-12 max-w-6xl flex justify-center items-center min-h-[50vh]">
        <div className="flex items-center gap-3 text-surrey-blue font-bold">
          <Loader2 className="animate-spin text-surrey-gold" size={24} />
          Loading Website Content...
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 lg:p-12 max-w-6xl">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-surrey-blue flex items-center gap-3">
            <Settings2 className="text-surrey-gold" size={28} />
            Website Editing
          </h1>
          <p className="text-text-muted mt-1">Directly manage all front-facing elements of the Surrey Capital Research website.</p>
        </div>
        
        <div className="flex gap-2">
           {saveSuccess && (
            <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200 animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 size={16} /> <span className="font-bold text-sm">Changes Saved</span>
            </div>
          )}
        </div>
      </header>

      {/* TABS NAVIGATION */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-4 border-b border-surrey-grey/30 no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all whitespace-nowrap ${
                isActive 
                  ? "bg-white border-t border-x border-surrey-grey/40 text-surrey-blue shadow-[0_-2px_10px_rgba(0,0,0,0.02)]" 
                  : "text-text-muted hover:text-surrey-blue"
              }`}
            >
              <Icon size={18} className={isActive ? "text-surrey-gold" : ""} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-10 animate-in fade-in duration-500">
        
        {/* ─── GLOBAL & SEO TAB ─── */}
        {activeTab === "global" && (
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-surrey-blue flex items-center gap-2">
                  <Globe className="text-surrey-gold" size={20} /> Identity & SEO
                </h2>
                <button onClick={handlePrimarySave} disabled={isSaving} className="btn-primary-sm">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Tab
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="label">Organization Name</label>
                  <input type="text" name="organizationName" value={data.organizationName} onChange={handleChange} className="input" />
                </div>
                <div className="space-y-2">
                  <label className="label">University Affiliation</label>
                  <input type="text" name="universityAffiliation" value={data.universityAffiliation} onChange={handleChange} className="input" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="label">Global SEO Description</label>
                  <textarea rows={2} name="globalDescription" value={data.globalDescription} onChange={handleChange} className="input h-auto resize-none" />
                </div>
                 <div className="space-y-2">
                  <label className="label">Logo URL</label>
                  <input type="text" name="logoUrl" value={data.logoUrl || ""} onChange={handleChange} className="input" placeholder="/logo.svg" />
                </div>
                <div className="space-y-2">
                  <label className="label">Footer Copyright Text</label>
                  <input type="text" name="footerCopyright" value={data.footerCopyright} onChange={handleChange} className="input" />
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm">
               <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-surrey-blue flex items-center gap-2">
                  <Mail className="text-surrey-gold" size={20} /> Contact Info & Social
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="label">Public Email</label>
                  <input type="email" name="contactEmail" value={data.contactEmail} onChange={handleChange} className="input" />
                </div>
                <div className="space-y-2">
                  <label className="label">LinkedIn Page</label>
                  <input type="url" name="linkedinUrl" value={data.linkedinUrl} onChange={handleChange} className="input" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="label">Office Address</label>
                  <textarea rows={3} name="officeAddress" value={data.officeAddress} onChange={handleChange} className="input h-auto resize-none" />
                </div>
              </div>
            </section>

             {/* DANGER ZONE */}
            <section className="bg-red-50/30 p-8 rounded-2xl border border-red-100 shadow-sm">
              <h2 className="text-lg font-bold text-red-700 mb-6 flex items-center gap-2 border-b border-red-100 pb-4">
                <ShieldAlert className="text-red-600" size={18} /> System Status
              </h2>
              <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-red-100">
                <div>
                  <h3 className="font-bold text-surrey-blue">Maintenance Mode</h3>
                  <p className="text-sm text-text-muted mt-1">Hides the public site under a "Coming Soon" page.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handlePrimarySave()}
                  className={`toggle ${data.maintenanceMode ? 'bg-red-600' : 'bg-surrey-grey'}`}
                >
                  <span className={`toggle-dot ${data.maintenanceMode ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-red-100 mt-4">
                <div>
                  <h3 className="font-bold text-surrey-blue">Rebuild Report Covers Cache</h3>
                  <p className="text-sm text-text-muted mt-1">
                     {isCaching ? (
                         <span className="text-surrey-gold font-bold flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> {cacheProgress}</span>
                     ) : (
                         "Deletes all stored cover images and completely regenerates them from PDFs."
                     )}
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={handleRebuildCache}
                  disabled={isCaching}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isCaching ? "Rebuilding..." : "Rebuild Cache"}
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ─── HOMEPAGE TAB ─── */}
        {activeTab === "homepage" && (
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-surrey-blue flex items-center gap-2">
                  <Home className="text-surrey-gold" size={20} /> Hero Section
                </h2>
                <button onClick={handlePrimarySave} disabled={isSaving} className="btn-primary-sm">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                </button>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="label">Hero Title</label>
                  <input type="text" name="heroTitle" value={data.heroTitle} onChange={handleChange} className="input text-lg font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="label">Hero Subtitle / Description</label>
                  <textarea rows={3} name="heroSubtitle" value={data.heroSubtitle} onChange={handleChange} className="input h-auto resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="label">Hero Image URL (or path)</label>
                  <div className="flex gap-4">
                    <input type="text" name="heroImageUrl" value={data.heroImageUrl} onChange={handleChange} className="input flex-1" />
                    <div className="w-12 h-12 rounded bg-surrey-light border border-surrey-grey/40 overflow-hidden relative shrink-0">
                      <img src={data.heroImageUrl} alt="preview" className="object-cover w-full h-full" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm">
              <h2 className="text-xl font-bold text-surrey-blue mb-6 border-b border-surrey-grey/20 pb-4">Mission Statement</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="label">Heading</label>
                  <input type="text" name="missionTitle" value={data.missionTitle} onChange={handleChange} className="input" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="label">Description</label>
                  <textarea rows={3} name="missionDescription" value={data.missionDescription} onChange={handleChange} className="input h-auto resize-none" />
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm">
              <h2 className="text-xl font-bold text-surrey-blue mb-6 border-b border-surrey-grey/20 pb-4">Bottom Call-To-Action (CTA)</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="label">Heading</label>
                  <input type="text" name="ctaHeading" value={data.ctaHeading} onChange={handleChange} className="input" />
                </div>
                <div className="space-y-2">
                  <label className="label">Subtext</label>
                  <input type="text" name="ctaSubtext" value={data.ctaSubtext} onChange={handleChange} className="input" />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ─── BRANDING TAB ─── */}
        {activeTab === "branding" && (
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-surrey-blue flex items-center gap-2">
                  <Palette className="text-surrey-gold" size={20} /> Brand Palette
                </h2>
                <button onClick={handlePrimarySave} disabled={isSaving} className="btn-primary-sm">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Colors
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="label">Primary Color (Blue)</label>
                  <div className="flex gap-3">
                    <input type="color" name="primaryColor" value={data.primaryColor} onChange={handleChange} className="h-11 w-11 rounded-lg border border-surrey-grey/30 p-1 cursor-pointer" />
                    <input type="text" name="primaryColor" value={data.primaryColor} onChange={handleChange} className="input font-mono text-sm uppercase" />
                  </div>
                  <p className="text-[10px] text-text-muted italic">Used for headers, text, and primary actions.</p>
                </div>
                
                <div className="space-y-3">
                  <label className="label">Accent Color (Gold)</label>
                  <div className="flex gap-3">
                    <input type="color" name="accentColor" value={data.accentColor} onChange={handleChange} className="h-11 w-11 rounded-lg border border-surrey-grey/30 p-1 cursor-pointer" />
                    <input type="text" name="accentColor" value={data.accentColor} onChange={handleChange} className="input font-mono text-sm uppercase" />
                  </div>
                  <p className="text-[10px] text-text-muted italic">Used for highlights, icons, and small buttons.</p>
                </div>

                <div className="space-y-3">
                  <label className="label">Main Background</label>
                  <div className="flex gap-3">
                    <input type="color" name="backgroundColor" value={data.backgroundColor} onChange={handleChange} className="h-11 w-11 rounded-lg border border-surrey-grey/30 p-1 cursor-pointer" />
                    <input type="text" name="backgroundColor" value={data.backgroundColor} onChange={handleChange} className="input font-mono text-sm uppercase" />
                  </div>
                  <p className="text-[10px] text-text-muted italic">The default background color for all pages.</p>
                </div>

                <div className="space-y-3">
                  <label className="label">Secondary Background</label>
                  <div className="flex gap-3">
                    <input type="color" name="secondaryBgColor" value={data.secondaryBgColor} onChange={handleChange} className="h-11 w-11 rounded-lg border border-surrey-grey/30 p-1 cursor-pointer" />
                    <input type="text" name="secondaryBgColor" value={data.secondaryBgColor} onChange={handleChange} className="input font-mono text-sm uppercase" />
                  </div>
                  <p className="text-[10px] text-text-muted italic">Used for sections, cards, and alternating content.</p>
                </div>

                <div className="space-y-3">
                  <label className="label">Muted / Metadata Text</label>
                  <div className="flex gap-3">
                    <input type="color" name="mutedColor" value={data.mutedColor} onChange={handleChange} className="h-11 w-11 rounded-lg border border-surrey-grey/30 p-1 cursor-pointer" />
                    <input type="text" name="mutedColor" value={data.mutedColor} onChange={handleChange} className="input font-mono text-sm uppercase" />
                  </div>
                  <p className="text-[10px] text-text-muted italic">Used for subheaders and less prominent text.</p>
                </div>

                <div className="space-y-3">
                  <label className="label">Border & Divider Color</label>
                  <div className="flex gap-3">
                    <input type="color" name="borderColor" value={data.borderColor} onChange={handleChange} className="h-11 w-11 rounded-lg border border-surrey-grey/30 p-1 cursor-pointer" />
                    <input type="text" name="borderColor" value={data.borderColor} onChange={handleChange} className="input font-mono text-sm uppercase" />
                  </div>
                  <p className="text-[10px] text-text-muted italic">Used for borders, lines, and table separators.</p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm">
              <h2 className="text-xl font-bold text-surrey-blue mb-6">Typography</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="label">Heading Font</label>
                  <select name="headingFont" value={data.headingFont} onChange={handleChange} className="input">
                    <option value="EB Garamond">EB Garamond</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Merriweather">Merriweather</option>
                    <option value="Roboto Slab">Roboto Slab</option>
                    <option value="Lora">Lora</option>
                    <option value="Inter">Inter</option>
                  </select>
                  <p className="text-[10px] text-text-muted italic">Used for all page titles, section headers, and bold highlights.</p>
                </div>
                
                <div className="space-y-3">
                  <label className="label">Body Font</label>
                  <select name="bodyFont" value={data.bodyFont} onChange={handleChange} className="input">
                    <option value="Merriweather">Merriweather</option>
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lora">Lora</option>
                  </select>
                  <p className="text-[10px] text-text-muted italic">Used for standard paragraphs, metadata, and structural UI elements.</p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm overflow-hidden">
                <h2 className="text-lg font-bold text-surrey-blue mb-6">Live Branding Preview</h2>
                {data.headingFont && data.bodyFont && (
                  <link href={`https://fonts.googleapis.com/css2?family=${data.headingFont.replace(/ /g, '+')}:wght@400;700&family=${data.bodyFont.replace(/ /g, '+')}:wght@400;700&display=swap`} rel="stylesheet" />
                )}
                <div 
                    className="p-10 rounded-xl border border-surrey-grey/20 space-y-6"
                    style={{ backgroundColor: data.backgroundColor, fontFamily: `'${data.bodyFont}', sans-serif` }}
                >
                    <div className="flex gap-2">
                        <div className="w-10 h-10 rounded-full shrink-0" style={{ backgroundColor: data.primaryColor }} />
                        <div className="flex-1 space-y-2">
                             <h3 className="text-xl font-bold" style={{ color: data.primaryColor, fontFamily: `'${data.headingFont}', serif` }}>Dynamic Branding Example</h3>
                             <p className="text-sm" style={{ color: data.mutedColor }}>This is how your chosen colors will look together in various UI components.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-6 rounded-xl border" style={{ backgroundColor: data.secondaryBgColor, borderColor: data.borderColor }}>
                            <h4 className="font-bold mb-2" style={{ color: data.primaryColor, fontFamily: `'${data.headingFont}', serif` }}>Secondary Card</h4>
                            <p className="text-xs" style={{ color: data.mutedColor }}>This section uses your secondary background and border colors.</p>
                        </div>
                         <div className="p-6 rounded-xl border flex flex-col items-center justify-center gap-4" style={{ backgroundColor: 'white', borderColor: data.borderColor }}>
                            <button className="px-6 py-2 rounded-lg text-white font-bold text-sm shadow-sm transition-opacity hover:opacity-90" style={{ backgroundColor: data.primaryColor, fontFamily: `'${data.bodyFont}', sans-serif` }}>
                                Primary Action
                            </button>
                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: data.accentColor, fontFamily: `'${data.bodyFont}', sans-serif` }}>
                                Accent Highlight
                            </span>
                        </div>
                    </div>
                </div>
            </section>
          </div>
        )}

        {/* ─── ABOUT PAGE TAB ─── */}
        {activeTab === "about" && (
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-surrey-blue flex items-center gap-2">
                  <Info className="text-surrey-gold" size={20} /> Hero & Intro
                </h2>
                <button onClick={handlePrimarySave} disabled={isSaving} className="btn-primary-sm">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="label">About Hero Title</label>
                  <input type="text" name="aboutHeroTitle" value={data.aboutHeroTitle} onChange={handleChange} className="input text-lg font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="label">Description Paragraph 1</label>
                  <textarea rows={4} name="aboutHeroDescription1" value={data.aboutHeroDescription1} onChange={handleChange} className="input h-auto resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="label">Description Paragraph 2</label>
                  <textarea rows={4} name="aboutHeroDescription2" value={data.aboutHeroDescription2} onChange={handleChange} className="input h-auto resize-none" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="label">Research Section Title & Intro</label>
                  <div className="flex gap-4">
                    <input type="text" name="researchTitle" value={data.researchTitle} onChange={handleChange} className="input flex-[1]"  />
                    <input type="text" name="researchIntro" value={data.researchIntro} onChange={handleChange} className="input flex-[2]" />
                  </div>
                </div>
              </div>
            </section>

             {/* RESEARCH AREAS EDITOR */}
            <section className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-surrey-blue">Research Highlights Cards (About Page)</h2>
                <div className="flex gap-2">
                  <button onClick={() => setData((p:any) => ({ ...p, researchAreas: [...p.researchAreas, { title: "", description: "", iconName: "BarChart3", href: "" }] }))} className="btn-secondary-sm">
                    <Plus size={16} /> Add Area
                  </button>
                  <button onClick={handleSyncResearchAreas} disabled={isSaving} className="btn-primary-sm">
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Sync Cards
                  </button>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {data.researchAreas.map((area: any, idx: number) => (
                  <div key={idx} className="p-5 border border-surrey-grey/30 rounded-xl bg-surrey-light/30 space-y-4">
                    <div className="flex justify-between items-start">
                      <input 
                        type="text" 
                        value={area.title} 
                        onChange={(e) => setData((p:any) => ({ ...p, researchAreas: p.researchAreas.map((a:any, i:number) => i === idx ? { ...a, title: e.target.value } : a) }))} 
                        className="font-bold bg-transparent border-none focus:ring-0 p-0 text-surrey-blue" 
                        placeholder="Area Title"
                      />
                      <div className="flex gap-1">
                        <button onClick={() => moveItem('researchAreas', idx, 'up')} className="text-text-muted hover:text-surrey-blue"><ChevronUp size={16} /></button>
                        <button onClick={() => moveItem('researchAreas', idx, 'down')} className="text-text-muted hover:text-surrey-blue"><ChevronDown size={16} /></button>
                        <button onClick={() => setData((p:any) => ({ ...p, researchAreas: p.researchAreas.filter((_:any, i:number) => i !== idx) }))} className="text-red-500 hover:text-red-700 ml-2"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <textarea 
                      rows={2} 
                      value={area.description} 
                      onChange={(e) => setData((p:any) => ({ ...p, researchAreas: p.researchAreas.map((a:any, i:number) => i === idx ? { ...a, description: e.target.value } : a) }))} 
                      className="input text-sm h-auto bg-white" 
                      placeholder="Short description..."
                    />
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={area.iconName} 
                        onChange={(e) => setData((p:any) => ({ ...p, researchAreas: p.researchAreas.map((a:any, i:number) => i === idx ? { ...a, iconName: e.target.value } : a) }))} 
                        className="input text-xs" 
                        placeholder="Icon Name (Lucide)"
                      />
                      <input 
                        type="text" 
                        value={area.href} 
                        onChange={(e) => setData((p:any) => ({ ...p, researchAreas: p.researchAreas.map((a:any, i:number) => i === idx ? { ...a, href: e.target.value } : a) }))} 
                        className="input text-xs" 
                        placeholder="Link Path"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ EDITOR */}
            <section className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-surrey-blue flex items-center gap-2">
                  <MessageSquare className="text-surrey-gold" size={20} /> Frequently Asked Questions
                </h2>
                <div className="flex gap-2">
                  <button onClick={() => setData((p:any) => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] }))} className="btn-secondary-sm">
                    <Plus size={16} /> Add FAQ
                  </button>
                  <button onClick={handleSyncFaqs} disabled={isSaving} className="btn-primary-sm">
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Sync FAQs
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {data.faqs.map((faq: any, idx: number) => (
                  <div key={idx} className="p-4 border border-surrey-grey/20 rounded-xl space-y-3">
                    <div className="flex justify-between gap-4">
                      <input 
                        type="text" 
                        value={faq.question} 
                        onChange={(e) => setData((p:any) => ({ ...p, faqs: p.faqs.map((f:any, i:number) => i === idx ? { ...f, question: e.target.value } : f) }))} 
                        className="input flex-1 font-bold" 
                        placeholder="Question..."
                      />
                      <div className="flex gap-1 items-center">
                        <button onClick={() => moveItem('faqs', idx, 'up')} className="text-text-muted hover:text-surrey-blue"><ChevronUp size={16} /></button>
                        <button onClick={() => moveItem('faqs', idx, 'down')} className="text-text-muted hover:text-surrey-blue"><ChevronDown size={16} /></button>
                        <button onClick={() => setData((p:any) => ({ ...p, faqs: p.faqs.filter((_:any, i:number) => i !== idx) }))} className="text-red-500 hover:text-red-700 ml-2"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <textarea 
                      rows={2} 
                      value={faq.answer} 
                      onChange={(e) => setData((p:any) => ({ ...p, faqs: p.faqs.map((f:any, i:number) => i === idx ? { ...f, answer: e.target.value } : f) }))} 
                      className="input h-auto text-sm resize-none" 
                      placeholder="Answer..."
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ─── DEPARTMENTS TAB ─── */}
        {activeTab === "departments" && (
          <div className="space-y-8">
             <section className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-surrey-blue">Index Header & Global Stats</h2>
                <button onClick={handlePrimarySave} disabled={isSaving} className="btn-primary-sm">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="label">Index Page Title</label>
                  <input type="text" name="deptIndexTitle" value={data.deptIndexTitle} onChange={handleChange} className="input" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="label">Index Page Intro</label>
                  <textarea rows={2} name="deptIndexIntro" value={data.deptIndexIntro} onChange={handleChange} className="input h-auto resize-none" />
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-surrey-grey/20 grid md:grid-cols-4 gap-6">
                 {/* Quick Email Edits */}
                 <div className="space-y-2">
                  <label className="label text-[10px]">Equity Email</label>
                  <input type="email" name="equityEmail" value={data.equityEmail} onChange={handleChange} className="input text-xs" />
                </div>
                <div className="space-y-2">
                  <label className="label text-[10px]">M&A Email</label>
                  <input type="email" name="mnaEmail" value={data.mnaEmail} onChange={handleChange} className="input text-xs" />
                </div>
                <div className="space-y-2">
                  <label className="label text-[10px]">Quant Email</label>
                  <input type="email" name="quantEmail" value={data.quantEmail} onChange={handleChange} className="input text-xs" />
                </div>
                <div className="space-y-2">
                  <label className="label text-[10px]">Economics Email</label>
                  <input type="email" name="economicsEmail" value={data.economicsEmail} onChange={handleChange} className="input text-xs" />
                </div>
              </div>
            </section>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* DESK SELECTOR SIDEBAR */}
              <div className="lg:col-span-1 space-y-2">
                 {DEPT_LIST.map((dept) => (
                   <button 
                    key={dept.type} 
                    onClick={() => setActiveDept(dept.type)}
                    className={`w-full text-left p-4 rounded-xl border font-bold transition-all ${
                      activeDept === dept.type 
                        ? "bg-surrey-blue text-white border-surrey-blue" 
                        : "bg-white text-surrey-blue border-surrey-grey/30 hover:border-surrey-gold"
                    }`}
                   >
                     {dept.label}
                   </button>
                 ))}
              </div>

              {/* DESK SPECIFIC EDITOR */}
              <div className="lg:col-span-3 space-y-8">
                <section className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-surrey-blue">Desk Specifics: <span className="text-surrey-gold">{DEPT_LIST.find(d => d.type === activeDept)?.label}</span></h2>
                    <button onClick={handleUpdateDeptMeta} disabled={isSaving} className="btn-primary-sm">
                      {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Update Desk
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="label">Display Name (Hero Title)</label>
                        <input 
                          type="text" 
                          value={data.deptMetadata.find((m:any) => m.department === activeDept)?.name || ""} 
                          onChange={(e) => handleDeptMetaChange("name", e.target.value)} 
                          className="input" 
                          placeholder="e.g., Equity Research"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="label">Lucide Icon Name</label>
                        <input 
                          type="text" 
                          value={data.deptMetadata.find((m:any) => m.department === activeDept)?.iconName || ""} 
                          onChange={(e) => handleDeptMetaChange("iconName", e.target.value)} 
                          className="input" 
                          placeholder="e.g., TrendingUp, Briefcase"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="label">Hero Teaser (Short Description)</label>
                      <textarea 
                        rows={2} 
                        value={data.deptMetadata.find((m:any) => m.department === activeDept)?.description || ""} 
                        onChange={(e) => handleDeptMetaChange("description", e.target.value)} 
                        className="input h-auto resize-none" 
                        placeholder="A one-sentence teaser for the hero section..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="label">Core Focus (Short String)</label>
                      <input 
                        type="text" 
                        value={data.deptMetadata.find((m:any) => m.department === activeDept)?.focus || ""} 
                        onChange={(e) => handleDeptMetaChange("focus", e.target.value)} 
                        className="input" 
                        placeholder="e.g., Fundamental Analysis & Valuation"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="label">Desk Overview / Mandatory Text (Detailed)</label>
                      <textarea 
                        rows={6} 
                        value={data.deptMetadata.find((m:any) => m.department === activeDept)?.overview || ""} 
                        onChange={(e) => handleDeptMetaChange("overview", e.target.value)} 
                        className="input h-auto resize-none" 
                        placeholder="The long-form description of the desk's activities..."
                      />
                    </div>
                  </div>
                </section>

                <section className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-surrey-blue">Active Pipeline (Projects)</h2>
                    <div className="flex gap-2">
                       <button onClick={() => setData((p:any) => ({ ...p, projects: [...p.projects, { department: activeDept, title: "", type: "", status: "Drafting" }] }))} className="btn-secondary-sm">
                        <Plus size={16} /> Add Project
                      </button>
                      <button onClick={handleSyncProjects} disabled={isSaving} className="btn-primary-sm">
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Sync Pipeline
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {data.projects.filter((p: any) => p.department === activeDept).map((project: any, idx: number) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 border border-surrey-grey/20 rounded-xl bg-surrey-light/10">
                        <input 
                          type="text" 
                          value={project.title} 
                          onChange={(e) => setData((p:any) => ({ ...p, projects: p.projects.map((proj:any) => proj === project ? { ...proj, title: e.target.value } : proj) }))} 
                          className="input flex-[3] font-bold" 
                          placeholder="Project Title"
                        />
                        <input 
                          type="text" 
                          value={project.type} 
                          onChange={(e) => setData((p:any) => ({ ...p, projects: p.projects.map((proj:any) => proj === project ? { ...proj, type: e.target.value } : proj) }))} 
                          className="input flex-[2]" 
                          placeholder="Type (e.g. Deep Dive)"
                        />
                        <select 
                          value={project.status} 
                          onChange={(e) => setData((p:any) => ({ ...p, projects: p.projects.map((proj:any) => proj === project ? { ...proj, status: e.target.value } : proj) }))} 
                          className="input flex-[1.5]"
                        >
                          <option value="Drafting">Drafting</option>
                          <option value="In Review">In Review</option>
                          <option value="Publishing Soon">Publishing Soon</option>
                        </select>
                        <button onClick={() => setData((p:any) => ({ ...p, projects: p.projects.filter((proj:any) => proj !== project) }))} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={20} /></button>
                      </div>
                    ))}
                    {data.projects.filter((p: any) => p.department === activeDept).length === 0 && (
                      <div className="text-center py-8 text-text-muted">No active projects found for this desk.</div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {/* ─── CONTACT TAB ─── */}
        {activeTab === "contact" && (
           <section className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm grow min-h-[400px]">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-surrey-blue flex items-center gap-2">
               <Mail className="text-surrey-gold" size={20} /> Contact Page Hero
             </h2>
             <button onClick={handlePrimarySave} disabled={isSaving} className="btn-primary-sm">
               {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
             </button>
           </div>
           <div className="space-y-6">
             <div className="space-y-2">
               <label className="label">Contact Hero Title</label>
               <input type="text" name="contactHeroTitle" value={data.contactHeroTitle} onChange={handleChange} className="input text-lg font-bold" />
             </div>
             <div className="space-y-2">
               <label className="label">Contact Hero Description</label>
               <textarea rows={4} name="contactHeroDescription" value={data.contactHeroDescription} onChange={handleChange} className="input h-auto resize-none" />
             </div>
             <div className="p-4 bg-surrey-beige/50 rounded-xl border border-surrey-gold/20 text-sm text-surrey-blue/70">
               <span className="font-bold">Note:</span> Specific department emails and office address are managed in the <button onClick={() => setActiveTab('global')} className="text-surrey-gold font-bold hover:underline">Global & SEO</button> tab.
             </div>
           </div>
         </section>
        )}

      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          background: #f8fafc;
          border: 1px solid rgba(148, 163, 184, 0.4);
          color: #1e293b;
          border-radius: 0.75rem;
          padding: 0.625rem 1rem;
          outline: none;
          transition: all 0.2s;
        }
        .input:focus {
          border-color: #ac9741;
          box-shadow: 0 0 0 4px rgba(172, 151, 65, 0.1);
          background: white;
        }
        .label {
          display: block;
          font-size: 0.875rem;
          font-weight: 700;
          color: #1e293b;
        }
        .btn-primary-sm {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #1e293b;
          color: white;
          padding: 0.5rem 1.25rem;
          border-radius: 0.625rem;
          font-weight: 700;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .btn-primary-sm:hover:not(:disabled) {
          background: #2d3748;
          transform: translateY(-1px);
        }
        .btn-primary-sm:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-secondary-sm {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #f1f5f9;
          color: #1e293b;
          padding: 0.5rem 1.25rem;
          border-radius: 0.625rem;
          font-weight: 700;
          font-size: 0.875rem;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }
        .btn-secondary-sm:hover {
          background: #e2e8f0;
        }
        .toggle {
          position: relative;
          display: inline-flex;
          height: 1.75rem;
          width: 3.5rem;
          flex-shrink: 0;
          cursor: pointer;
          border-radius: 9999px;
          border: 2px solid transparent;
          transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
        }
        .toggle-dot {
          pointer-events: none;
          display: inline-block;
          height: 1.5rem;
          width: 1.5rem;
          transform: translateX(0);
          border-radius: 9999px;
          background: white;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease-in-out;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}