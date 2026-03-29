"use client";

import { 
  FileText, 
  Users, 
  PlusCircle, 
  FileEdit 
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <main className="p-8 lg:p-12">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surrey-blue">Welcome back, Admin</h1>
          <p className="text-text-muted mt-1">Here is what's happening on the Surrey Capital Research website today.</p>
        </div>
        <button className="bg-surrey-gold text-surrey-light px-6 py-2.5 rounded-lg font-bold hover:bg-surrey-gold/90 transition-colors shadow-sm flex items-center justify-center gap-2">
          <PlusCircle size={18} /> New Report
        </button>
      </header>

      {/* Quick Actions for Non-Technical Users */}
      <h2 className="text-sm font-bold text-surrey-blue uppercase tracking-wider mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        <div className="bg-white p-6 rounded-2xl border border-surrey-grey/40 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
          <div className="w-12 h-12 bg-surrey-blue/5 rounded-xl flex items-center justify-center mb-4 group-hover:bg-surrey-blue transition-colors">
            <FileText size={24} className="text-surrey-blue group-hover:text-surrey-light transition-colors" />
          </div>
          <h3 className="font-bold text-surrey-blue text-lg mb-1">Upload a Report</h3>
          <p className="text-text-muted text-sm">Publish new PDFs to the research directory.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-surrey-grey/40 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
          <div className="w-12 h-12 bg-surrey-gold/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-surrey-gold transition-colors">
            <Users size={24} className="text-surrey-gold group-hover:text-surrey-light transition-colors" />
          </div>
          <h3 className="font-bold text-surrey-blue text-lg mb-1">Update Team</h3>
          <p className="text-text-muted text-sm">Add new members, change roles, or update photos.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-surrey-grey/40 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
          <div className="w-12 h-12 bg-surrey-grey/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-surrey-grey transition-colors">
            <FileEdit size={24} className="text-surrey-blue group-hover:text-surrey-blue transition-colors" />
          </div>
          <h3 className="font-bold text-surrey-blue text-lg mb-1">Edit Website Copy</h3>
          <p className="text-text-muted text-sm">Change text, mission statements, and external links.</p>
        </div>

      </div>

      {/* Recent Activity Mockup */}
      <div className="bg-white rounded-2xl border border-surrey-grey/40 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-surrey-grey/30 bg-surrey-light">
          <h3 className="font-bold text-surrey-blue">Recent Updates</h3>
        </div>
        <ul className="divide-y divide-surrey-grey/20">
          {[
            { title: "Q3 Equities Report uploaded", user: "Jane S.", time: "2 hours ago" },
            { title: "Updated John Doe's LinkedIn link", user: "Admin", time: "1 day ago" },
            { title: "Added 3 new members to Alumni list", user: "Admin", time: "3 days ago" },
          ].map((item, i) => (
            <li key={i} className="px-6 py-4 flex justify-between items-center hover:bg-surrey-light/50 transition-colors">
              <div>
                <p className="font-medium text-surrey-blue text-sm">{item.title}</p>
                <p className="text-xs text-text-muted mt-0.5">by {item.user}</p>
              </div>
              <span className="text-xs font-medium text-text-muted bg-surrey-beige px-3 py-1 rounded-full">
                {item.time}
              </span>
            </li>
          ))}
        </ul>
      </div>

    </main>
  );
}