"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  TrendingUp,
  Inbox,
  Rss
} from "lucide-react";
import { logout } from "@/actions/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // If the user is on the login page, render the page without the sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Helper function to check active routes
  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-surrey-beige flex relative">
      
      {/* ── GLOBAL ADMIN SIDEBAR ── */}
      <aside className="w-64 bg-surrey-blue text-white flex flex-col fixed inset-y-0 left-0 border-r border-surrey-blue/90 shadow-2xl z-20">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-surrey-gold rounded flex items-center justify-center">
            <TrendingUp size={18} className="text-surrey-blue" strokeWidth={3} />
          </div>
          <span className="font-bold tracking-wider text-sm">SCR ADMIN</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link 
            href="/admin" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/admin") 
                ? "bg-surrey-gold/20 text-surrey-gold font-bold" 
                : "text-white/70 hover:bg-white/5 hover:text-white font-medium"
            }`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          
          <Link 
            href="/admin/reports" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/admin/reports") 
                ? "bg-surrey-gold/20 text-surrey-gold font-bold" 
                : "text-white/70 hover:bg-white/5 hover:text-white font-medium"
            }`}
          >
            <FileText size={18} /> Manage Reports
          </Link>
          
          <Link 
            href="/admin/team" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/admin/team") 
                ? "bg-surrey-gold/20 text-surrey-gold font-bold" 
                : "text-white/70 hover:bg-white/5 hover:text-white font-medium"
            }`}
          >
            <Users size={18} /> Manage Team
          </Link>
          
          <Link 
            href="/admin/settings" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/admin/settings") 
                ? "bg-surrey-gold/20 text-surrey-gold font-bold" 
                : "text-white/70 hover:bg-white/5 hover:text-white font-medium"
            }`}
          >
            <Settings size={18} /> Website editing
          </Link>
          
          <Link
            href="/admin/enquiries"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/admin/enquiries")
                ? "bg-surrey-gold/20 text-surrey-gold font-bold"
                : "text-white/70 hover:bg-white/5 hover:text-white font-medium"
            }`}
          >
            <Inbox size={18} /> Enquiries
          </Link>

          <Link
            href="/admin/linkedin"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/admin/linkedin")
                ? "bg-surrey-gold/20 text-surrey-gold font-bold"
                : "text-white/70 hover:bg-white/5 hover:text-white font-medium"
            }`}
          >
            <Rss size={18} /> LinkedIn Feed
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <form action={logout}>
            <button type="submit" className="flex items-center gap-3 text-white/50 hover:text-red-400 w-full px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer">
              <LogOut size={18} /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      {/* The ml-64 pushes the content over so it doesn't hide behind the fixed sidebar */}
      <div className="flex-1 ml-64">
        {children}
      </div>

    </div>
  );
}