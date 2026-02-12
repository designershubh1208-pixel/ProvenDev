import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, where, addDoc } from 'firebase/firestore';
import { Plus, Cpu, ShieldCheck, Clock, MessageSquare, X, Github, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserInventory({ user }) {
    const [mySkills, setMySkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', tech: '', repo: '' });

    useEffect(() => {
        if (!user?.uid) return;
        const q = query(collection(db, "skills"), where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMySkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.tech) return toast.error("Please fill in required fields");

        const tid = toast.loading("Submitting project...");
        try {
            // 1. Submit Skill
            await addDoc(collection(db, "skills"), {
                userId: user.uid,
                userEmail: user.email,
                name: formData.name,
                tech: formData.tech,
                repo: formData.repo,
                status: "Pending",
                createdAt: new Date()
            });

            // 2. Notify Admin
            await addDoc(collection(db, "notifications"), {
                recipient: "ADMIN",
                title: "New Project Submitted",
                message: `${user.email} submitted "${formData.name}".`,
                read: false,
                createdAt: new Date()
            });

            toast.success("Project submitted!", { id: tid });
            setIsModalOpen(false);
            setFormData({ name: '', tech: '', repo: '' });
        } catch (err) {
            toast.error("Submission failed", { id: tid });
        }
    };

    if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading Inventory...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 p-2 relative">
            <div className="flex justify-between items-end px-2">
                <div><h2 className="text-4xl font-black text-slate-900 tracking-tighter">My Inventory</h2><p className="text-slate-500 font-medium text-lg mt-1">Manage your technical achievements.</p></div>
                <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 transition-transform active:scale-95"><Plus size={20} /> Add New Skill</button>
            </div>

            <div className="bg-white rounded-[3.5rem] border border-white shadow-xl p-10 space-y-6">
                <table className="w-full text-left">
                    <thead><tr className="border-b border-slate-50"><th className="pb-6 px-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Project</th><th className="pb-6 px-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Stack</th><th className="pb-6 px-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th></tr></thead>
                    <tbody className="divide-y divide-slate-50">
                        {mySkills.map((skill) => (
                            <tr key={skill.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-8 px-4"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shrink-0"><Cpu size={20} /></div><div><span className="font-black text-slate-800 text-lg block">{skill.name}</span>{skill.repo && (<a href={skill.repo} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1 mt-1"><Github size={12} /> View Repo <ExternalLink size={10} /></a>)}</div></div></td>
                                <td className="py-8 px-4"><span className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 uppercase">{skill.tech}</span></td>
                                <td className="py-8 px-4 text-center"><div className="flex flex-col items-center gap-2"><div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-black text-[10px] uppercase tracking-widest ${skill.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{skill.status === 'Verified' ? <ShieldCheck size={14} /> : <Clock size={14} />}{skill.status || "Pending"}</div>{skill.feedback && (<div className="bg-indigo-50/50 px-3 py-1.5 rounded-lg border border-indigo-100 text-[11px] font-bold text-indigo-500 flex items-center gap-2"><MessageSquare size={12} /> {skill.feedback}</div>)}</div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {mySkills.length === 0 && <div className="text-center text-slate-400 font-bold py-10">You haven't added any skills yet.</div>}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 border border-white relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100"><X size={20} /></button>
                        <div className="mb-8"><h3 className="text-2xl font-black text-slate-800">Add New Project</h3><p className="text-slate-500 font-medium text-sm mt-1">Submit your work for verification.</p></div>
                        <form onSubmit={handleAddSkill} className="space-y-6">
                            <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Project Name</label><input required type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                            <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Tech Stack</label><input required type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none" value={formData.tech} onChange={(e) => setFormData({ ...formData, tech: e.target.value })} /></div>
                            <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2"><Github size={14} /> GitHub Repo URL</label><input type="url" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none" value={formData.repo} onChange={(e) => setFormData({ ...formData, repo: e.target.value })} /></div>
                            <div className="pt-4"><button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg">Submit for Verification</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}