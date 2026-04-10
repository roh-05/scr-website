"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getTeamMembers, addTeamMember, deleteTeamMember } from "@/actions/team";
import { uploadImageToStorage } from "@/lib/supabase";
import { DepartmentType, MemberStatus } from "@prisma/client";
import { 
  Search,
  Filter,
  Edit,
  Trash2,
  UserPlus,
  Upload,
  Shield,
  GraduationCap,
  Loader2
} from "lucide-react";

export default function TeamManagementPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Dynamic State
    const [team, setTeam] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        role: "",
        department: "EQUITY_RESEARCH" as DepartmentType,
        email: "",
        linkedinUrl: "",
        status: "ACTIVE" as MemberStatus,
        isLeadership: false,
    });

    useEffect(() => {
        async function loadTeam() {
            const result = await getTeamMembers();
            if (result.success && result.data) {
                setTeam(result.data);
            }
            setIsLoading(false);
        }
        loadTeam();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let imageUrl = undefined;
            if (selectedFile) {
                imageUrl = await uploadImageToStorage(selectedFile) || undefined;
            }

            const payload = {
                ...formData,
                linkedinUrl: formData.linkedinUrl || undefined,
                imageUrl,
            };

            const result = await addTeamMember(payload);
            if (!result.success) {
                alert(result.error);
                return;
            }

            if (result.data) {
                // Prepend to top
                setTeam([result.data, ...team]); 
                setIsAddOpen(false);
                setSelectedFile(null);
                setFormData({
                    firstName: "",
                    lastName: "",
                    role: "",
                    department: "EQUITY_RESEARCH",
                    email: "",
                    linkedinUrl: "",
                    status: "ACTIVE",
                    isLeadership: false,
                });
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently remove this profile?")) return;
        const result = await deleteTeamMember(id);
        if (result.success) {
            setTeam(team.filter(m => m.id !== id));
        } else {
            alert(result.error || "Failed to delete.");
        }
    };

    const filteredTeam = team.filter(m => 
        m.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

                    <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
                        {/* Profile Picture Upload */}
                        <div className="col-span-1 flex flex-col items-center">
                            <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-surrey-grey/60 bg-surrey-light/50 flex flex-col items-center justify-center text-center hover:bg-surrey-beige/30 hover:border-surrey-gold/50 transition-colors cursor-pointer group mb-4 overflow-hidden">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                {selectedFile ? (
                                    <Image src={URL.createObjectURL(selectedFile)} alt="Preview" fill className="object-cover" />
                                ) : (
                                    <>
                                        <Upload className="text-surrey-blue/50 group-hover:text-surrey-blue mb-2 transition-colors" size={24} />
                                        <span className="text-xs font-bold text-surrey-blue/70">Upload Photo</span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-text-muted text-center px-4">Square image recommended. Max 2MB.</p>
                        </div>

                        {/* Member Details Form */}
                        <div className="col-span-2 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-surrey-blue mb-1.5">First Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-surrey-blue mb-1.5">Last Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-surrey-blue mb-1.5">Role / Title</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.role}
                                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                                        className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" 
                                        placeholder="e.g., Equity Analyst" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-surrey-blue mb-1.5">Department</label>
                                    <select 
                                        value={formData.department}
                                        onChange={(e) => setFormData({...formData, department: e.target.value as DepartmentType})}
                                        className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all appearance-none"
                                    >
                                        <option value="EQUITY_RESEARCH">Equity Research</option>
                                        <option value="MERGERS_ACQUISITIONS">Mergers & Acquisitions</option>
                                        <option value="QUANTITATIVE_FINANCE">Quantitative Finance</option>
                                        <option value="ECONOMIC_RESEARCH">Economic Research</option>
                                        <option value="EXECUTIVE">Executive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-surrey-blue mb-1.5">Email Address</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-surrey-blue mb-1.5">LinkedIn URL</label>
                                    <input 
                                        type="url" 
                                        value={formData.linkedinUrl}
                                        onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                                        className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" 
                                        placeholder="https://linkedin.com/in/..." 
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="checkbox" 
                                        id="leadership" 
                                        checked={formData.isLeadership}
                                        onChange={(e) => setFormData({...formData, isLeadership: e.target.checked})}
                                        className="w-4 h-4 rounded border-surrey-grey/60 text-surrey-gold focus:ring-surrey-gold/50" 
                                    />
                                    <label htmlFor="leadership" className="text-sm font-medium text-surrey-blue">Display in "Leadership Team" section</label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="text-sm font-medium text-surrey-blue">Status:</label>
                                    <select 
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value as MemberStatus})}
                                        className="bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-surrey-gold"
                                    >
                                        <option value="ACTIVE">Active Member</option>
                                        <option value="ALUMNI">Alumni</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="bg-surrey-blue text-surrey-light px-8 py-3 rounded-lg font-bold hover:bg-surrey-blue/90 transition-colors flex items-center gap-2 disabled:opacity-70"
                                >
                                    {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save Profile"}
                                </button>
                            </div>
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
                        placeholder="Search team by name or role..."
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
                                <th className="py-4 px-6 font-bold text-sm text-surrey-blue uppercase tracking-wider">Member</th>
                                <th className="py-4 px-6 font-bold text-sm text-surrey-blue uppercase tracking-wider">Role & Dept</th>
                                <th className="py-4 px-6 font-bold text-sm text-surrey-blue uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6 font-bold text-sm text-surrey-blue uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surrey-grey/20">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-text-muted">Loading directory...</td>
                                </tr>
                            ) : filteredTeam.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-text-muted">No members found.</td>
                                </tr>
                            ) : (
                                filteredTeam.map((member) => (
                                    <tr key={member.id} className="hover:bg-surrey-light/50 transition-colors group">
                                        <td className="py-4 px-6 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-surrey-grey/20 overflow-hidden relative border border-surrey-grey/40 shrink-0">
                                                <Image src={member.imageUrl || "/headshot-placeholder.jpg"} alt={member.firstName} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-surrey-blue flex items-center gap-2">
                                                    {member.firstName} {member.lastName}
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
                                            <p className="text-xs text-text-muted mt-0.5">{member.department.replace('_', ' ')}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            {member.status === "ACTIVE" ? (
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
                                                <button 
                                                    onClick={() => handleDelete(member.id)}
                                                    className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" 
                                                    title="Remove"
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