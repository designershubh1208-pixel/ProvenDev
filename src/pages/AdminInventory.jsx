import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { Cpu, Trash2, CheckCircle, Clock, ShieldCheck, MessageSquare, Search, X, Github, ExternalLink, ThumbsDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminInventory() {
    const [allSkills, setAllSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedProject, setSelectedProject] = useState(null);
    const [feedbackText, setFeedbackText] = useState("");

    useEffect(() => {
        // Client-side sort to avoid index errors
        const q = query(collection(db, "skills"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const raw = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAllSkills(raw.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const openProjectDetails = (project) => {
        setSelectedProject(project);
        setFeedbackText(project.feedback || "");
    };

    const handleDecision = async (status) => {
        if (!selectedProject) return;
        const tid = toast.loading("Updating project...");
        try {
            // 1. Update Status
            await updateDoc(doc(db, "skills", selectedProject.id), { status: status, feedback: feedbackText });

            // 2. Notify User
            await addDoc(collection(db, "notifications"), {
                recipient: selectedProject.userId,
                title: `Project ${status}`,
                message: `Admin has marked "${selectedProject.name}" as ${status}. ${feedbackText ? `Note: ${feedbackText}` : ''}`,
                read: false,
                createdAt: new Date()
            });

            toast.success(`Project ${status}`, { id: tid });
            setSelectedProject(null);
        } catch (err) {
            toast.error("Update failed", { id: tid });
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        // No window.confirm as requested, assumes safe admin behavior or add custom modal later
        const tid = toast.loading("Deleting...");
        await deleteDoc(doc(db, "skills", id));
        toast.success("Deleted", { id: tid });
    }

    if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading Global Inventory...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 p-2">
            <div className="px-2"><h2 className="text-4xl font-black text-slate-900 tracking-tighter">Admin Control</h2><p className="text-slate-500 font-medium text-lg mt-1">Manage user submissions.</p></div>

            <div className="bg-white rounded-[3.5rem] border border-white shadow-xl p-10 space-y-6">
                <div className="relative"><Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} /><input type="text" placeholder="Search projects..." className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] font-bold text-slate-700 outline-none" onChange={(e) => setSearchTerm(e.target.value)} /></div>
                <table className="w-full text-left">
                    <thead><tr className="border-b border-slate-50"><th className="pb-6 px-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Project</th><th className="pb-6 px-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th><th className="pb-6 px-4 text-[11px] font-black text-indigo-500 uppercase tracking-widest text-center">Actions</th></tr></thead>
                    <tbody className="divide-y divide-slate-50">
                        {allSkills.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((skill) => (
                            <tr key={skill.id} onClick={() => openProjectDetails(skill)} className="hover:bg-slate-50/80 cursor-pointer transition-colors group">
                                <td className="py-8 px-4"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><Cpu size={20} /></div><div><span className="font-black text-slate-800 block text-lg">{skill.name}</span><span className="text-xs font-bold text-slate-400 uppercase">{skill.tech}</span></div></div></td>
                                <td className="py-8 px-4 text-center"><div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-black text-[10px] uppercase tracking-widest ${skill.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{skill.status === 'Verified' ? <ShieldCheck size={14} /> : <Clock size={14} />}{skill.status || "Pending"}</div>{skill.feedback && <div className="text-[10px] font-bold text-indigo-400 mt-2 flex justify-center gap-1"><MessageSquare size={12} /> Feedback Sent</div>}</td>
                                <td className="py-8 px-4"><div className="flex justify-center gap-2"><button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100"><ExternalLink size={20} /></button><button onClick={(e) => handleDelete(e, skill.id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100"><Trash2 size={20} /></button></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedProject && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 border border-white relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setSelectedProject(null)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100"><X size={20} /></button>
                        <div className="mb-8"><h3 className="text-3xl font-black text-slate-900 tracking-tighter">Project Review</h3><p className="text-slate-500 font-medium">Full summary for verification.</p></div>
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2"><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Project Name</p><div className="p-4 bg-slate-50 rounded-2xl font-bold text-slate-800 border border-slate-100">{selectedProject.name}</div></div>
                                <div className="space-y-2"><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Tech Stack</p><div className="p-4 bg-slate-50 rounded-2xl font-bold text-slate-800 border border-slate-100">{selectedProject.tech}</div></div>
                                <div className="space-y-2 col-span-2"><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Repository</p>{selectedProject.repo ? (<a href={selectedProject.repo} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors"><Github size={20} /> {selectedProject.repo} <ExternalLink size={16} className="ml-auto opacity-50" /></a>) : (<div className="p-4 bg-slate-50 rounded-2xl font-bold text-slate-400 border border-slate-100 italic">No Repo URL provided</div>)}</div>
                                <div className="space-y-2 col-span-2"><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Submitted By</p><div className="p-4 bg-slate-50 rounded-2xl font-bold text-slate-600 border border-slate-100">{selectedProject.userEmail || selectedProject.userId}</div></div>
                            </div>
                            <div className="space-y-2"><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MessageSquare size={14} /> Admin Feedback / Reason</p><textarea className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-medium text-slate-700 outline-none focus:border-indigo-500 transition-colors h-32 resize-none" placeholder="Why is this project being rejected or verified? Leave a note..." value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)}></textarea></div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                <button onClick={() => handleDecision("Rejected")} className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-red-500 bg-red-50 hover:bg-red-100"><ThumbsDown size={20} /> Reject</button>
                                <button onClick={() => handleDecision("Verified")} className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg"><ShieldCheck size={20} /> Approve</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}