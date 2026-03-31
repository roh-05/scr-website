// src/app/admin/enquiries/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getEnquiries, toggleEnquiryReadStatus } from "@/actions/enquiries";
import { 
  Inbox, 
  MailWarning, 
  Calendar, 
  User, 
  MessageSquareQuote,
  Loader2,
  CheckCircle2,
  Circle
} from "lucide-react";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string | Date;
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      const result = await getEnquiries();
      if (result.success && result.data) {
        setEnquiries(result.data as Enquiry[]);
      } else {
        setError("error" in result ? result.error : "Failed to load enquiries.");
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    // Optimistic UI update
    setEnquiries((prev) => 
      prev.map(enq => enq.id === id ? { ...enq, isRead: !currentStatus } : enq)
    );

    const result = await toggleEnquiryReadStatus(id, currentStatus);
    
    if (!result.success) {
      // Revert if API fails
      setEnquiries((prev) => 
        prev.map(enq => enq.id === id ? { ...enq, isRead: currentStatus } : enq)
      );
      alert("Failed to update the read status.");
    }
  };

  if (isLoading) {
    return (
      <main className="p-8 lg:p-12 max-w-7xl flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-3 text-surrey-blue font-bold">
          <Loader2 className="animate-spin text-surrey-gold" size={24} />
          Loading Inbox...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8 lg:p-12 max-w-7xl">
        <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200 flex items-start gap-3">
          <MailWarning className="shrink-0 text-red-600 mt-1" />
          <div>
            <h3 className="font-bold mb-1">Error Loading Enquiries</h3>
            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  const unreadCount = enquiries.filter(enq => !enq.isRead).length;

  return (
    <main className="p-8 lg:p-12 max-w-7xl flex flex-col min-h-screen">
      
      <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surrey-blue flex items-center gap-3">
            <Inbox className="text-surrey-gold" size={28} />
            Enquiries Inbox
            {unreadCount > 0 && (
              <span className="ml-2 text-sm bg-red-500 text-white rounded-full px-3 py-1 font-bold shadow-sm">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-text-muted mt-1">Review contact form submissions from website visitors.</p>
        </div>
      </header>

      {enquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surrey-grey/40 p-16 text-center text-text-muted flex flex-col items-center">
          <Inbox size={48} className="text-surrey-grey/80 mb-4" />
          <h3 className="text-xl font-bold text-surrey-blue mb-2">No Enquiries Yet</h3>
          <p>When visitors contact you via the website form, their messages will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {enquiries.map((enq) => (
            <div 
              key={enq.id} 
              className={`rounded-2xl border shadow-sm p-6 lg:p-8 flex flex-col gap-6 transition-colors ${
                enq.isRead ? "bg-white border-surrey-grey/40 shrink-0 opacity-80" : "bg-surrey-light/30 border-surrey-gold shadow-md"
              }`}
            >
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-surrey-grey/30 pb-6">
                <div className="space-y-1 text-surrey-blue w-full max-w-3xl">
                  <div className="flex items-center gap-3">
                    {!enq.isRead && <span className="w-3 h-3 rounded-full bg-surrey-gold shrink-0 mt-1 shadow-sm animate-pulse"></span>}
                    <h2 className={`text-xl font-bold flex items-center gap-2 ${enq.isRead ? 'text-text-muted' : 'text-surrey-blue'}`}>
                      <MessageSquareQuote size={20} className={enq.isRead ? 'text-surrey-grey' : 'text-surrey-gold'} />
                      {enq.subject}
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-muted mt-2 ml-6 select-all">
                    <span className="flex items-center gap-1.5 font-medium"><User size={14} /> {enq.name}</span>
                    <a href={`mailto:${enq.email}`} className="flex items-center gap-1.5 text-surrey-blue hover:text-surrey-gold transition-colors font-medium">
                      <MailWarning size={14} /> {enq.email}
                    </a>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-3 shrink-0">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted bg-white px-3 py-1.5 rounded-lg border border-surrey-grey/60">
                    <Calendar size={14} />
                    {new Date(enq.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                  </div>
                  
                  <button
                    onClick={() => handleToggleRead(enq.id, enq.isRead)}
                    className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${
                      enq.isRead 
                        ? 'bg-surrey-light hover:bg-surrey-grey/20 text-text-muted border-surrey-grey/30' 
                        : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                    }`}
                  >
                    {enq.isRead ? (
                      <><Circle size={14} /> Mark as Unread</>
                    ) : (
                      <><CheckCircle2 size={14} /> Mark as Read</>
                    )}
                  </button>
                </div>
              </div>

              <div className={`rounded-xl p-5 border text-surrey-blue ${enq.isRead ? 'bg-surrey-light/50 border-surrey-grey/20' : 'bg-white border-surrey-gold/20'}`}>
                <p className="whitespace-pre-wrap leading-relaxed selection:bg-surrey-gold/30">{enq.message}</p>
              </div>

            </div>
          ))}
        </div>
      )}

    </main>
  );
}
