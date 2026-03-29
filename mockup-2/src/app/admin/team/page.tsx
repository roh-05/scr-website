"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Search,
  Filter,
  Edit,
  Trash2,
  UserPlus,
  Upload,
  Shield,
  GraduationCap
} from "lucide-react";

// --- MOCK DATABASE ---
const MOCK_TEAM = [
    { id: 1, name: "John Doe", role: "President", department: "Executive", email: "j.doe@surreycapital.org", status: "Active", isLeadership: true },
    { id: 2, name: "Jane Smith", role: "Head of Equities", department: "Equity Research", email: "j.smith@surreycapital.org", status: "Active", isLeadership: true },
    { id: 3, name: "Michael Chen", role: "Senior Analyst", department: "Mergers & Acquisitions", email: "m.chen@surreycapital.org", status: "Active", isLeadership: false },
    { id: 4, name: "Sarah Williams", role: "Head of Quant", department: "Quantitative Finance", email: "s.williams@surreycapital.org", status: "Active", isLeadership: true },
    { id: 5, name: "Alexander Wright", role: "Investment Banking Analyst", department: "Mergers & Acquisitions", email: "alex@alumni.com", status: "Alumni", isLeadership: false },
];

export default function TeamManagementPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);

    return (
        <main className="p-8 lg:p-12">

            <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surrey-blue">Team Directory</h1>
                    <p className="text-text-muted mt-1">Manage current analysts, leadership, and alumni profiles.</p>
                </div>
                <button
                    onClick={() => setIsAddOpen(!isAddOpen)}
                    className="bg-surrey-gold text-surrey-light px-6 py-2.5 rounded-lg font-bold hover:bg-surrey-gold/90 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                    {isAddOpen ? "Cancel" : <><UserPlus size={18} /> Add Member</>}
                </button>
            </header>

            {/* ── ADD MEMBER MODAL/SECTION (Toggled) ── */}
            {isAddOpen && (
                <div className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm mb-10 animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold text-surrey-blue mb-6 flex items-center gap-2">
                        <UserPlus className="text-surrey-gold" /> Add New Team Member
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Profile Picture Upload */}
                        <div className="col-span-1 flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full border-2 border-dashed border-surrey-grey/60 bg-surrey-light/50 flex flex-col items-center justify-center text-center hover:bg-surrey-beige/30 hover:border-surrey-gold/50 transition-colors cursor-pointer group mb-4">
                                <Upload className="text-surrey-blue/50 group-hover:text-surrey-blue mb-2 transition-colors" size={24} />
                                <span className="text-xs font-bold text-surrey-blue/70">Upload Photo</span>
                            </div>
                            <p className="text-xs text-text-muted text-center px-4">Square image recommended. Max 2MB.</p>
                        </div>

                        {/* Member Details Form */}
                        <div className="col-span-2 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-surrey-blue mb-1.5">First Name</label>
                                    <input type="text" className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-surrey-blue mb-1.5">Last Name</label>
                                    <input type="text" className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-surrey-blue mb-1.5">Role / Title</label>
                                    <input type="text" className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" placeholder="e.g., Equity Analyst" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-surrey-blue mb-1.5">Department</label>
                                    <select className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all appearance-none">
                                        <option>Equity Research</option>
                                        <option>Mergers & Acquisitions</option>
                                        <option>Quantitative Finance</option>
                                        <option>Economic Research</option>
                                        <option>Executive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-surrey-blue mb-1.5">Email Address</label>
                                    <input type="email" className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-surrey-blue mb-1.5">LinkedIn URL</label>
                                    <input type="url" className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" placeholder="https://linkedin.com/in/..." />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input type="checkbox" id="leadership" className="w-4 h-4 rounded border-surrey-grey/60 text-surrey-gold focus:ring-surrey-gold/50" />
                                <label htmlFor="leadership" className="text-sm font-medium text-surrey-blue">Display in "Leadership Team" section on About page</label>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button className="bg-surrey-blue text-surrey-light px-8 py-3 rounded-lg font-bold hover:bg-surrey-blue/90 transition-colors">
                                    Save Profile
                                </button>
                            </div>
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
                        placeholder="Search team by name or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-surrey-grey/60 text-surrey-blue rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all"
                    />
                </div>
                <select className="bg-white border border-surrey-grey/60 text-surrey-blue px-4 py-2.5 rounded-lg font-medium outline-none focus:ring-2 focus:ring-surrey-gold/50 appearance-none min-w-[150px]">
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Alumni</option>
                </select>
                <button className="bg-white border border-surrey-grey/60 text-surrey-blue px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-surrey-beige transition-colors">
                    <Filter size={18} /> Dept
                </button>
            </div>

            {/* ── DATA TABLE ── */}
            <div className="bg-white rounded-2xl border border-surrey-grey/40 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surrey-light border-b border-surrey-grey/40">
                                <th className="py-4 px-6 font-bold text-sm text-surrey-blue uppercase tracking-wider">Member</th>
                                <th className="py-4 px-6 font-bold text-sm text-surrey-blue uppercase tracking-wider">Role & Dept</th>
                                <th className="py-4 px-6 font-bold text-sm text-surrey-blue uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6 font-bold text-sm text-surrey-blue uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surrey-grey/20">
                            {MOCK_TEAM.map((member) => (
                                <tr key={member.id} className="hover:bg-surrey-light/50 transition-colors group">
                                    <td className="py-4 px-6 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-surrey-grey/20 overflow-hidden relative border border-surrey-grey/40 shrink-0">
                                            <Image src="/headshot-placeholder.jpg" alt={member.name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-surrey-blue flex items-center gap-2">
                                                {member.name}
                                                {member.isLeadership && (
                                                    <span title="Leadership Team" className="flex items-center">
                                                        <Shield size={14} className="text-surrey-gold" />
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-sm text-text-muted mt-0.5">{member.email}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="font-medium text-surrey-blue text-sm">{member.role}</p>
                                        <p className="text-xs text-text-muted mt-0.5">{member.department}</p>
                                    </td>
                                    <td className="py-4 px-6">
                                        {member.status === "Active" ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide bg-green-100 text-green-700">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide bg-surrey-blue/10 text-surrey-blue">
                                                <GraduationCap size={12} /> Alumni
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-text-muted hover:text-surrey-blue hover:bg-surrey-grey/20 rounded-md transition-colors" title="Edit Profile">
                                                <Edit size={18} />
                                            </button>
                                            <button className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Remove">
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
                    <span>Showing 1 to 5 of 42 members</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-surrey-grey/40 rounded hover:bg-surrey-grey/20 disabled:opacity-50">Prev</button>
                        <button className="px-3 py-1 border border-surrey-grey/40 rounded hover:bg-surrey-grey/20">Next</button>
                    </div>
                </div>
            </div>

        </main>
    );
}