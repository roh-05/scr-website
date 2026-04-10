"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  Users, 
  PlusCircle, 
  FileEdit,
  Loader2,
  Clock
} from "lucide-react";
import { getRecentActivity, RecentActivityItem } from "@/actions/dashboard";

export default function AdminDashboard() {
  const [activity, setActivity] = useState<RecentActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadActivity() {
      const result = await getRecentActivity();
      if (result.success && result.data) {
        setActivity(result.data);
      }
      setIsLoading(false);
    }
    loadActivity();
  }, []);

  return (
    <main className="p-8 lg:p-12">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surrey-blue">Welcome back, Admin</h1>
          <p className="text-text-muted mt-1">Here is what's happening on the Surrey Capital Research website today.</p>
        </div>
        <Link 
          href="/admin/reports"
          className="bg-surrey-gold text-surrey-light px-6 py-2.5 rounded-lg font-bold hover:bg-surrey-gold/90 transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} /> New Report
        </Link>
      </header>

      {/* Quick Actions for Non-Technical Users */}
      <h2 className="text-sm font-bold text-surrey-blue uppercase tracking-wider mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        <Link href="/admin/reports" className="bg-white p-6 rounded-2xl border border-surrey-grey/40 shadow-sm hover:shadow-md transition-shadow group block">
          <div className="w-12 h-12 bg-surrey-blue/5 rounded-xl flex items-center justify-center mb-4 group-hover:bg-surrey-blue transition-colors">
            <FileText size={24} className="text-surrey-blue group-hover:text-surrey-light transition-colors" />
          </div>
          <h3 className="font-bold text-surrey-blue text-lg mb-1">Upload a Report</h3>
          <p className="text-text-muted text-sm border-t border-transparent leading-relaxed">Publish new PDFs to the research directory.</p>
        </Link>

        <Link href="/admin/team" className="bg-white p-6 rounded-2xl border border-surrey-grey/40 shadow-sm hover:shadow-md transition-shadow group block">
          <div className="w-12 h-12 bg-surrey-gold/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-surrey-gold transition-colors">
            <Users size={24} className="text-surrey-gold group-hover:text-surrey-light transition-colors" />
          </div>
          <h3 className="font-bold text-surrey-blue text-lg mb-1">Update Team</h3>
          <p className="text-text-muted text-sm border-t border-transparent leading-relaxed">Add new members, change roles, or update photos.</p>
        </Link>

        <Link href="/admin/settings" className="bg-white p-6 rounded-2xl border border-surrey-grey/40 shadow-sm hover:shadow-md transition-shadow group block">
          <div className="w-12 h-12 bg-surrey-grey/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-surrey-grey transition-colors">
            <FileEdit size={24} className="text-surrey-blue group-hover:text-surrey-blue transition-colors" />
          </div>
          <h3 className="font-bold text-surrey-blue text-lg mb-1">Edit Website Copy</h3>
          <p className="text-text-muted text-sm border-t border-transparent leading-relaxed">Change text, mission statements, and external links.</p>
        </Link>

      </div>

      {/* Recent Activity Live Feed */}
      <div className="bg-white rounded-2xl border border-surrey-grey/40 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-surrey-grey/30 bg-surrey-light flex items-center gap-2">
          <Clock className="text-surrey-gold" size={18} />
          <h3 className="font-bold text-surrey-blue">Recent Updates</h3>
        </div>
        
        {isLoading ? (
          <div className="px-6 py-12 flex items-center justify-center gap-2 text-text-muted">
             <Loader2 size={18} className="animate-spin" /> Fetching recent activity...
          </div>
        ) : activity.length === 0 ? (
          <div className="px-6 py-8 text-center text-text-muted italic">
             No recent activity detected.
          </div>
        ) : (
          <ul className="divide-y divide-surrey-grey/20">
            {activity.map((item, i) => (
              <li key={i} className="px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 hover:bg-surrey-light/50 transition-colors group">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-surrey-blue text-sm">{item.title}</p>
                    {item.type === "REPORT" && item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            (View PDF)
                        </a>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{item.subtitle}</p>
                </div>
                <span className="text-xs font-medium text-text-muted bg-surrey-beige px-3 py-1 rounded-full whitespace-nowrap self-start sm:self-auto">
                  {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </main>
  );
}