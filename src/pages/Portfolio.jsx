import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, addDoc, orderBy } from 'firebase/firestore';
import { ShieldCheck, Link, Database, Trash2, ThumbsDown, X, MessageSquare, Cpu, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { recordSkillOnChain } from '../utils/blockchain';

export default function Portfolio() {
    const adminEmail = "devshubh1208@gmail.com";
    // We need to fetch the current user again or pass it down. 
    // Assuming auth is handled globally, but for Portfolio we need to know who is viewing.
    // Using a simplified auth check for this example component
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Data State
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Admin Action State
    const [selectedProject, setSelectedProject] = useState(null);
    const [feedbackText, setFeedbackText] = useState("");
    const [isMinting, setIsMinting] = useState(false);

    useEffect(() => {
        // Determine User (Mocking the auth check from parent for simplicity in this file scope)
        import('../firebaseConfig').then(({ auth }) => {
            auth.onAuthStateChanged((u) => {
                if (u) {
                    setUser(u);
                    setIsAdmin(u.email === adminEmail);
                }
            });
        });
    }, []);

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        let q;

        if (isAdmin) {
            // ADMIN VIEW: See ALL projects to Verify/Mint (Ordered by Pending first)
            q = query(collection(db, "skills"), orderBy("createdAt", "desc"));
        } else {
            // USER VIEW: See ONLY Verified projects (The "Portfolio")
            q = query(collection(db, "skills"), where("userId", "==", user.uid), where("status", "==", "Verified"));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user, isAdmin]);

    // --- ADMIN ACTIONS (Moved from Inventory) ---
    const handleDecision = async (decisionType) => {
        if (!selectedProject) return;

        let txHash = null;
        let finalStatus = decisionType === "Rejected" ? "Rejected" : "Verified";

        if (decisionType === "Mint") {
            setIsMinting(true);
            txHash = await recordSkillOnChain(selectedProject);
            if (!txHash) { setIsMinting(false); return; } // Blockchain cancelled
            finalStatus = "Verified";
        }

        const tid = toast.loading("Finalizing...");
        try {
            await updateDoc(doc(db, "skills", selectedProject.id), {
                status: finalStatus,
                feedback: feedbackText,
                blockchainHash: txHash || null
            });

            // Notify User
            await addDoc(collection(db, "notifications"), {
                recipient: selectedProject.userId,
                title: `Portfolio Update: ${finalStatus}`,
                message: `Your project "${selectedProject.name}" has been ${finalStatus}.`,
                read: false,
                createdAt: new Date()
            });

            toast.success("Processed successfully", { id: tid });
            setSelectedProject(null);
            setIsMinting(false);
        } catch (err) {
            toast.error("Error updating", { id: tid });
            setIsMinting(false);
        }
    };

    if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading Portfolio Data...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 p-2">
            <div className="px-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                    {isAdmin ? "Verification Center" : "On-Chain Portfolio"}
                </h2>
                <p className="text-slate-500 font-medium text-lg mt-1">
                    {isAdmin ? "Verify user projects and mint them to the blockchain." : "Your cryptographically secured verified achievements."}
                </p>
            </div>

            {/* --- USER VIEW: DISPLAY VERIFIED ASSETS --- */}
            {!isAdmin && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white hover:shadow-2xl transition-all group">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800">{item.name}</h3>
                            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wide">{item.tech}</p>

                            <div className="mt-6 pt-6 border-t border-slate-50 space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
                                    <ShieldCheck size={12} /> VERIFIED ASSET
                                </div>
                                {item.blockchainHash && (
                                    <a href={`https://polygonscan.com/tx/${item.blockchainHash}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors break-all">
                                        <Link size={12} /> {item.blockchainHash.slice(0, 20)}...
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && <div className="col-span-full py-20 text-center text-slate-400 font-bold">No verified assets yet. Check your inventory status.</div>}
                </div>
            )}

            {/* --- ADMIN VIEW: VERIFICATION LIST --- */}
            {isAdmin && (
                <div className="bg-white rounded-[3.5rem] border border-white shadow-xl p-10">
                    <table className="w-full text-left">
                        <thead><tr className="border-b border-slate-50"><th className="pb-6 px-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Project</th><th className="pb-6 px-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Current Status</th><th className="pb-6 px-4 text-[11px] font-black text-indigo-500 uppercase tracking-widest text-center">Action</th></tr></thead>
                        <tbody className="divide-y divide-slate-50">
                            {items.map((skill) => (
                                <tr key={skill.id} className="hover:bg-slate-50/50">
                                    <td className="py-6 px-4"><span className="font-black text-slate-800 block">{skill.name}</span><span className="text-xs text-slate-400 font-bold">{skill.tech}</span></td>
                                    <td className="py-6 px-4 text-center"><span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${skill.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{skill.status || "Pending"}</span></td>
                                    <td className="py-6 px-4 text-center">
                                        <button onClick={() => setSelectedProject(skill)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:scale-105 transition-transform text-sm">
                                            {skill.status === 'Verified' ? 'Re-Verify' : 'Process'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- ADMIN MODAL: MINTING PROCESS --- */}
            {isAdmin && selectedProject && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 border border-white relative">
                        <button onClick={() => setSelectedProject(null)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100"><X size={20} /></button>
                        <div className="mb-6"><h3 className="text-2xl font-black text-slate-900">Verify & Mint</h3><p className="text-slate-500 text-sm font-medium">Record "{selectedProject.name}" on the blockchain.</p></div>

                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-xs font-bold text-slate-400 uppercase">Tech Stack</p><p className="font-bold text-slate-800">{selectedProject.tech}</p></div>
                            <textarea className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-medium text-slate-700 h-24 resize-none outline-none focus:border-indigo-500" placeholder="Verification notes..." value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)}></textarea>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <button onClick={() => handleDecision("Rejected")} disabled={isMinting} className="py-4 rounded-2xl font-bold text-red-500 bg-red-50 hover:bg-red-100 flex items-center justify-center gap-2"><ThumbsDown size={18} /> Reject</button>
                                <button onClick={() => handleDecision("Mint")} disabled={isMinting} className="py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg flex items-center justify-center gap-2">
                                    {isMinting ? "Minting..." : "Mint to Chain"} <Database size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}