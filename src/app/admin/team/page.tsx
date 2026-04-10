"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } from "@/actions/team";
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
  Loader2,
  X,
  Save,
  Briefcase,
  MapPin,
  Quote
} from "lucide-react";

// Default blank form state
const EMPTY_FORM = {
    firstName: "",
    lastName: "",
    role: "",
    department: "EQUITY_RESEARCH" as DepartmentType,
    email: "",
    linkedinUrl: "",
    status: "ACTIVE" as MemberStatus,
    isLeadership: false,
    classYear: "",
    currentRole: "",
    currentCompany: "",
    location: "",
    alumniQuote: "",
};

export default function TeamManagementPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Edit State
    const [editingId, setEditingId] = useState<string | null>(null);

    // Dynamic State
    const [team, setTeam] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State (shared for add + edit)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState(EMPTY_FORM);

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

    const resetForm = () => {
        setFormData(EMPTY_FORM);
        setSelectedFile(null);
        setEditingId(null);
        setIsAddOpen(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    // --- OPEN EDIT FORM ---
    const handleEditClick = (member: any) => {
        // Close add panel if open
        setIsAddOpen(false);
        setEditingId(member.id);
        setSelectedFile(null);
        setFormData({
            firstName: member.firstName || "",
            lastName: member.lastName || "",
            role: member.role || "",
            department: member.department || "EQUITY_RESEARCH",
            email: member.email || "",
            linkedinUrl: member.linkedinUrl || "",
            status: member.status || "ACTIVE",
            isLeadership: member.isLeadership || false,
            classYear: member.classYear || "",
            currentRole: member.currentRole || "",
            currentCompany: member.currentCompany || "",
            location: member.location || "",
            alumniQuote: member.alumniQuote || "",
        });
    };

    // --- ADD SUBMIT ---
    const handleAddSubmit = async (e: React.FormEvent) => {
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
                classYear: formData.classYear || null,
                currentRole: formData.currentRole || null,
                currentCompany: formData.currentCompany || null,
                location: formData.location || null,
                alumniQuote: formData.alumniQuote || null,
            };

            const result = await addTeamMember(payload);
            if (!result.success) {
                alert(result.error);
                return;
            }

            if (result.data) {
                setTeam([result.data, ...team]); 
                resetForm();
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- EDIT SUBMIT ---
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId) return;
        setIsSubmitting(true);

        try {
            let imageUrl: string | undefined = undefined;
            if (selectedFile) {
                imageUrl = await uploadImageToStorage(selectedFile) || undefined;
            }

            const payload: any = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                role: formData.role,
                department: formData.department,
                email: formData.email,
                linkedinUrl: formData.linkedinUrl || undefined,
                status: formData.status,
                isLeadership: formData.isLeadership,
                classYear: formData.classYear || null,
                currentRole: formData.currentRole || null,
                currentCompany: formData.currentCompany || null,
                location: formData.location || null,
                alumniQuote: formData.alumniQuote || null,
            };

            // Only include imageUrl if a new file was uploaded
            if (imageUrl) {
                payload.imageUrl = imageUrl;
            }

            const result = await updateTeamMember(editingId, payload);
            if (!result.success) {
                alert(result.error);
                return;
            }

            if (result.data) {
                setTeam(team.map(m => m.id === editingId ? result.data : m));
                resetForm();
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
            if (editingId === id) resetForm();
        } else {
            alert(result.error || "Failed to delete.");
        }
    };

    const filteredTeam = team.filter(m => 
        m.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Check if we're showing the form (add or edit)
    const isFormOpen = isAddOpen || editingId !== null;
    const isEditMode = editingId !== null;

    // Current member being edited (for showing existing photo)
    const editingMember = isEditMode ? team.find(m => m.id === editingId) : null;

    return (
        <main className="p-8 lg:p-12">

            <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surrey-blue">Team Directory</h1>
                    <p className="text-text-muted mt-1">Manage current analysts, leadership, and alumni profiles.</p>
                </div>
                <button
                    onClick={() => {
                        if (isAddOpen) {
                            resetForm();
                        } else {
                            resetForm();
                            setIsAddOpen(true);
                        }
                    }}
                    className="bg-surrey-gold text-surrey-light px-6 py-2.5 rounded-lg font-bold hover:bg-surrey-gold/90 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                    {isAddOpen ? "Cancel" : <><UserPlus size={18} /> Add Member</>}
                </button>
            </header>

            {/* ── ADD / EDIT FORM (Shared Layout) ── */}
            {isFormOpen && (
                <div className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm mb-10 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-surrey-blue flex items-center gap-2">
                            {isEditMode ? (
                                <><Edit className="text-surrey-gold" /> Edit Team Member</>
                            ) : (
                                <><UserPlus className="text-surrey-gold" /> Add New Team Member</>
                            )}
                        </h2>
                        <button
                            onClick={resetForm}
                            className="p-2 text-text-muted hover:text-surrey-blue hover:bg-surrey-light rounded-md transition-colors"
                            title="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={isEditMode ? handleEditSubmit : handleAddSubmit} className="grid md:grid-cols-3 gap-8">
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
                                    <Image src={URL.createObjectURL(selectedFile)} alt="Preview" fill sizes="128px" className="object-cover" />
                                ) : isEditMode && editingMember?.imageUrl ? (
                                    <Image src={editingMember.imageUrl} alt="Current" fill sizes="128px" className="object-cover opacity-80" />
                                ) : (
                                    <>
                                        <Upload className="text-surrey-blue/50 group-hover:text-surrey-blue mb-2 transition-colors" size={24} />
                                        <span className="text-xs font-bold text-surrey-blue/70">Upload Photo</span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-text-muted text-center px-4">
                                {isEditMode && editingMember?.imageUrl && !selectedFile 
                                    ? "Click to replace current photo" 
                                    : "Square image recommended. Max 2MB."
                                }
                            </p>
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
                                        <option value="MERGERS_ACQUISITIONS">Mergers &amp; Acquisitions</option>
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
                                    <label htmlFor="leadership" className="text-sm font-medium text-surrey-blue">Display in &quot;Leadership Team&quot; section</label>
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

                            {/* ── ALUMNI FIELDS (shown when status is ALUMNI) ── */}
                            {formData.status === "ALUMNI" && (
                                <div className="mt-4 pt-4 border-t border-surrey-grey/30">
                                    <h3 className="text-sm font-bold text-surrey-blue mb-3 flex items-center gap-2">
                                        <GraduationCap size={16} className="text-surrey-gold" />
                                        Alumni Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-surrey-blue mb-1.5">Class Year</label>
                                            <input 
                                                type="text" 
                                                value={formData.classYear}
                                                onChange={(e) => setFormData({...formData, classYear: e.target.value})}
                                                className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" 
                                                placeholder="e.g., 2024" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-surrey-blue mb-1.5 flex items-center gap-1.5">
                                                <Briefcase size={13} className="text-text-muted" /> Current Role
                                            </label>
                                            <input 
                                                type="text" 
                                                value={formData.currentRole}
                                                onChange={(e) => setFormData({...formData, currentRole: e.target.value})}
                                                className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" 
                                                placeholder="e.g., Analyst at Goldman Sachs" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-surrey-blue mb-1.5">Current Company</label>
                                            <input 
                                                type="text" 
                                                value={formData.currentCompany}
                                                onChange={(e) => setFormData({...formData, currentCompany: e.target.value})}
                                                className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" 
                                                placeholder="e.g., J.P. Morgan" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-surrey-blue mb-1.5 flex items-center gap-1.5">
                                                <MapPin size={13} className="text-text-muted" /> Location
                                            </label>
                                            <input 
                                                type="text" 
                                                value={formData.location}
                                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                                className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all" 
                                                placeholder="e.g., London, UK" 
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-bold text-surrey-blue mb-1.5 flex items-center gap-1.5">
                                            <Quote size={13} className="text-text-muted" /> Alumni Quote
                                        </label>
                                        <textarea 
                                            value={formData.alumniQuote}
                                            onChange={(e) => setFormData({...formData, alumniQuote: e.target.value})}
                                            rows={2}
                                            className="w-full bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all resize-none" 
                                            placeholder="A short testimonial or reflection on their time at SCR..." 
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 rounded-lg font-bold text-text-muted hover:text-surrey-blue hover:bg-surrey-light transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="bg-surrey-blue text-surrey-light px-8 py-3 rounded-lg font-bold hover:bg-surrey-blue/90 transition-colors flex items-center gap-2 disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <><Loader2 size={16} className="animate-spin" /> Saving...</>
                                    ) : isEditMode ? (
                                        <><Save size={16} /> Update Profile</>
                                    ) : (
                                        "Save Profile"
                                    )}
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
                                <th className="py-4 px-6 font-bold text-sm text-surrey-blue uppercase tracking-wider">Role &amp; Dept</th>
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
                                    <tr 
                                        key={member.id} 
                                        className={`hover:bg-surrey-light/50 transition-colors group ${editingId === member.id ? 'bg-surrey-gold/5 ring-1 ring-inset ring-surrey-gold/30' : ''}`}
                                    >
                                        <td className="py-4 px-6 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-surrey-grey/20 overflow-hidden relative border border-surrey-grey/40 shrink-0">
                                                <Image src={member.imageUrl || "/headshot-placeholder.jpg"} alt={member.firstName} fill sizes="40px" className="object-cover" />
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
                                                    onClick={() => handleEditClick(member)}
                                                    className="p-2 text-text-muted hover:text-surrey-gold hover:bg-surrey-gold/10 rounded-md transition-colors" 
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
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