"use client";

import { useState } from "react";
import { 
  FileText, 
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  UploadCloud
} from "lucide-react";

// --- MOCK DATABASE ---
const MOCK_REPORTS = [
  { id: 1, title: "Q3 Global Equities Outlook", department: "Equity Research", date: "Oct 12, 2026", status: "Published", author: "Jane Smith" },
  { id: 2, title: "LBO Viability in Tech Sector", department: "Mergers & Acquisitions", date: "Sep 28, 2026", status: "Published", author: "Alex Wright" },
  { id: 3, title: "Algorithmic Arbitrage Models", department: "Quantitative Finance", date: "Sep 15, 2026", status: "Draft", author: "Sarah W." },
  { id: 4, title: "European Central Bank Rate Analysis", department: "Economic Research", date: "Aug 30, 2026", status: "Published", author: "David Osei" },
  { id: 5, title: "Renewable Energy Sector Initiation", department: "Equity Research", date: "Aug 14, 2026", status: "Published", author: "Jane Smith" },
];

export default function ReportsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

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

      {/* ── UPLOAD MODAL/SECTION (Toggled) ── */}
      {isUploadOpen && (
        <div className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm mb-10 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold text-surrey-blue mb-6 flex items-center gap-2">
            <UploadCloud className="text-surrey-gold" /> Upload New Research
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Drag & Drop Area */}
            <div className="border-2 border-dashed border-surrey-grey/50 rounded-xl bg-surrey-light/50 flex flex-col items-center justify-center p-10 text-center hover:bg-surrey-beige/30 hover:border-surrey-gold/50 transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <FileText className="text-surrey-blue" size={28} />
              </div>
              <p className="font-bold text-surrey-blue mb-1">Click to browse or drag PDF here</p>
              <p className="text-sm text-text-muted">Maximum file size 50MB</p>
            </div>

            {/* Metadata Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-surrey-blue mb-1.5">Report Title</label>
                <input type="text" className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 focus:border-surrey-gold transition-all" placeholder="e.g., Q4 Macroeconomic Outlook" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-surrey-blue mb-1.5">Department</label>
                  <select className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 focus:border-surrey-gold transition-all appearance-none">
                    <option>Equity Research</option>
                    <option>M&A</option>
                    <option>Quant</option>
                    <option>Economics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-surrey-blue mb-1.5">Author(s)</label>
                  <input type="text" className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 focus:border-surrey-gold transition-all" placeholder="Names..." />
                </div>
              </div>
              <button className="w-full bg-surrey-blue text-surrey-light py-3 rounded-lg font-bold hover:bg-surrey-blue/90 transition-colors mt-2">
                Publish to Website
              </button>
            </div>
          </div>
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
        <button className="bg-white border border-surrey-grey/60 text-surrey-blue px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-surrey-beige transition-colors">
          <Filter size={18} /> Filter by Dept
        </button>
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
              {MOCK_REPORTS.map((report) => (
                <tr key={report.id} className="hover:bg-surrey-light/50 transition-colors group">
                  <td className="py-4 px-6">
                    <p className="font-bold text-surrey-blue">{report.title}</p>
                    <p className="text-sm text-text-muted mt-0.5">By {report.author} • {report.date}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-text-muted bg-surrey-beige px-3 py-1 rounded-full">
                      {report.department}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide ${
                      report.status === 'Published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-surrey-grey/30 text-surrey-blue'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-text-muted hover:text-surrey-blue hover:bg-surrey-grey/20 rounded-md transition-colors" title="View">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-text-muted hover:text-surrey-blue hover:bg-surrey-grey/20 rounded-md transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-surrey-grey/30 bg-surrey-light flex justify-between items-center text-sm text-text-muted">
          <span>Showing 1 to 5 of 24 reports</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-surrey-grey/40 rounded hover:bg-surrey-grey/20 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-surrey-grey/40 rounded hover:bg-surrey-grey/20">Next</button>
          </div>
        </div>
      </div>

    </main>
  );
}