"use client";

import { useState, useEffect } from "react";
import { getReports, createReport, deleteReport } from "@/actions/reports";
import { uploadReportWithCover } from "@/lib/supabase";
import { DepartmentType, ReportStatus } from "@prisma/client";
import { 
  FileText, PlusCircle, Search, Filter, Edit, Trash2, Eye, UploadCloud, Loader2
} from "lucide-react";

export default function ReportsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  // State for Database Data
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for the Upload Form
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    department: "EQUITY_RESEARCH" as DepartmentType,
    authorNames: "",
    excerpt: "",
    tags: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch reports on page load
  useEffect(() => {
    async function loadReports() {
      const result = await getReports();
      if (result.success && result.data) {
        setReports(result.data);
      }
      setIsLoading(false);
    }
    loadReports();
  }, []);

  // 2. Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 3. Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select a PDF file.");
    
    setIsSubmitting(true);

    try {
      // Step A: Upload file and generate cover
      const uploadResult = await uploadReportWithCover(selectedFile);
      if (!uploadResult) throw new Error("Failed to upload file or generate cover.");
      const { fileUrl, coverUrl } = uploadResult;

      // Step B: Save metadata and URLs to Prisma Database
      const result = await createReport({
        title: formData.title,
        department: formData.department,
        authorNames: formData.authorNames,
        excerpt: formData.excerpt,
        tags: formData.tags,
        fileUrl: fileUrl,
        coverUrl: coverUrl,
        fileSizeBytes: selectedFile.size,
        status: ReportStatus.PUBLISHED, // Auto-publishing for this example
      });

      if (!result.success) {
        alert(result.error);
        return;
      }

      if (result.data) {
        setReports([result.data, ...reports]);
        setIsUploadOpen(false);
        setSelectedFile(null);
        setFormData({ title: "", department: "EQUITY_RESEARCH", authorNames: "", excerpt: "", tags: "" });
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Handle Deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    const result = await deleteReport(id);
    if (result.success) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  // Filter Logic for the search bar
  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.authorNames.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="p-8 lg:p-12">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surrey-blue">Research Reports</h1>
          <p className="text-text-muted mt-1">Upload, edit, and manage all departmental publications.</p>
        </div>
        <button 
          onClick={() => setIsUploadOpen(!isUploadOpen)}
          className="bg-surrey-gold text-surrey-light px-6 py-2.5 rounded-lg font-bold hover:bg-surrey-gold/90 transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          {isUploadOpen ? "Cancel Upload" : <><PlusCircle size={18} /> Upload Report</>}
        </button>
      </header>

      {/* ── UPLOAD MODAL/SECTION ── */}
      {isUploadOpen && (
        <div className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm mb-10 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold text-surrey-blue mb-6 flex items-center gap-2">
            <UploadCloud className="text-surrey-gold" /> Upload New Research
          </h2>
          
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
            
            {/* Drag & Drop Area (Converted to a real file input wrapper) */}
            <div className="relative border-2 border-dashed border-surrey-grey/50 rounded-xl bg-surrey-light/50 flex flex-col items-center justify-center p-10 text-center hover:bg-surrey-beige/30 hover:border-surrey-gold/50 transition-colors group">
              <input 
                type="file" 
                accept=".pdf"
                onChange={handleFileChange}
                required
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <FileText className="text-surrey-blue" size={28} />
              </div>
              <p className="font-bold text-surrey-blue mb-1">
                {selectedFile ? selectedFile.name : "Click to browse or drag PDF here"}
              </p>
              <p className="text-sm text-text-muted">
                {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "Maximum file size 50MB"}
              </p>
            </div>

            {/* Metadata Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-surrey-blue mb-1.5">Report Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 focus:border-surrey-gold transition-all" 
                  placeholder="e.g., Q4 Macroeconomic Outlook" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-surrey-blue mb-1.5">Department</label>
                  <select 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value as DepartmentType})}
                    className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 focus:border-surrey-gold transition-all appearance-none"
                  >
                    <option value="EQUITY_RESEARCH">Equity Research</option>
                    <option value="MERGERS_ACQUISITIONS">M&A</option>
                    <option value="QUANTITATIVE_FINANCE">Quant</option>
                    <option value="ECONOMIC_RESEARCH">Economics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-surrey-blue mb-1.5">Author(s)</label>
                  <input 
                    type="text" 
                    required
                    value={formData.authorNames}
                    onChange={(e) => setFormData({...formData, authorNames: e.target.value})}
                    className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 focus:border-surrey-gold transition-all" 
                    placeholder="Names..." 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-surrey-blue mb-1.5">Executive Summary</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 focus:border-surrey-gold transition-all resize-none" 
                  placeholder="Provide a brief overview of the publication..." 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-surrey-blue mb-1.5">Tags (Comma Separated)</label>
                <input 
                  type="text" 
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 focus:border-surrey-gold transition-all" 
                  placeholder="e.g. Macroeconomics, Tech, UK" 
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-surrey-blue text-surrey-light py-3 rounded-lg font-bold hover:bg-surrey-blue/90 transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? <><Loader2 className="animate-spin" size={18} /> Publishing...</> : "Publish to Website"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── CONTROLS ── */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search reports by title or author..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-surrey-grey/60 text-surrey-blue rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all"
          />
        </div>
      </div>

      {/* ── DATA TABLE ── */}
      <div className="bg-white rounded-2xl border border-surrey-grey/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surrey-light border-b border-surrey-grey/40">
                <th className="py-4 px-6 font-bold text-sm text-surrey-blue uppercase tracking-wider">Report Details</th>
                <th className="py-4 px-6 font-bold text-sm text-surrey-blue uppercase tracking-wider">Department</th>
                <th className="py-4 px-6 font-bold text-sm text-surrey-blue uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 font-bold text-sm text-surrey-blue uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surrey-grey/20">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-text-muted">Loading reports...</td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-text-muted">No reports found.</td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-surrey-light/50 transition-colors group">
                    <td className="py-4 px-6">
                      <p className="font-bold text-surrey-blue">{report.title}</p>
                      <p className="text-sm text-text-muted mt-0.5">
                        By {report.authorNames} • {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-text-muted bg-surrey-beige px-3 py-1 rounded-full">
                        {report.department.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide ${
                        report.status === 'PUBLISHED' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-surrey-grey/30 text-surrey-blue'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a 
                          href={report.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-text-muted hover:text-surrey-blue hover:bg-surrey-grey/20 rounded-md transition-colors" 
                          title="View PDF"
                        >
                          <Eye size={18} />
                        </a>
                        <button 
                          onClick={() => handleDelete(report.id)}
                          className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" 
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}