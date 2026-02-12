import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { Cpu, Search, X, Github, ExternalLink, FileText, DownloadCloud, UserCircle } from 'lucide-react'; // Changed icons
import { generateProjectSummary } from '../utils/aiService';
import toast from 'react-hot-toast';

export default function AdminInventory() {
    const [allSkills, setAllSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedProject, setSelectedProject] = useState(null);
    const [submitterName, setSubmitterName] = useState("Loading...");
    const [readmeContent, setReadmeContent] = useState(""); // Renamed for clarity
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "skills"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setAllSkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Fetch Username when modal opens
    const openProjectDetails = async (project) => {
        setSelectedProject(project);
        setReadmeContent("");
        setSubmitterName("Fetching...");

        if (project.userId) {
            try {
                const userDoc = await getDoc(doc(db, "users", project.userId));
                if (userDoc.exists()) {
                    setSubmitterName(userDoc.data().name || "Unknown User");
                } else {
                    setSubmitterName("Unknown User");
                }
            } catch (err) {
                setSubmitterName("User Not Found");
            }
        }
    };

    const handleFetchReadme = async () => {
        setIsFetching(true);
        const content = await generateProjectSummary(selectedProject);
        setReadmeContent(content);
        setIsFetching(false);
        toast.success("README Fetched");
    };

    if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading Inventory...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 p-2">
            <div className="px-2"><h2 className="text-4xl font-black text-slate-900 tracking-tighter">Project Overview</h2><p className="text-slate-500 font-medium text-lg mt-1">Review user submissions.</p></div>

            <div className="bg-white rounded-[3.5rem] border border-white shadow-xl p-10 space-y-6">
                <div className="relative"><Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} /><input type="text" placeholder="Search projects..." className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] font-bold text-slate-700 outline-none" onChange={(e) => setSearchTerm(e.target.value)} /></div>
                <table className="w-full text-left">
                    <thead><tr className="border-b border-slate-50"><th className="pb-6 px-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Project</th><th className="pb-6 px-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Current Status</th><th className="pb-6 px-4 text-[11px] font-black text-indigo-500 uppercase tracking-widest text-center">View</th></tr></thead>
                    <tbody className="divide-y divide-slate-50">
                        {allSkills.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((skill) => (
                            <tr key={skill.id} onClick={() => openProjectDetails(skill)} className="hover:bg-slate-50/80 cursor-pointer transition-colors group">
                                <td className="py-8 px-4"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><Cpu size={20} /></div><div><span className="font-black text-slate-800 block text-lg">{skill.name}</span><span className="text-xs font-bold text-slate-400 uppercase">{skill.tech}</span></div></div></td>
                                <td className="py-8 px-4 text-center">
                                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${skill.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>{skill.status || "Pending"}</span>
                                </td>
                                <td className="py-8 px-4 text-center"><button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100"><ExternalLink size={20} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedProject && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 border border-white relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setSelectedProject(null)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100"><X size={20} /></button>

                        <div className="mb-8">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Project Details</h3>
                            <p className="text-slate-500 font-medium">Review repository content.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Name</p>
                                    <p className="font-bold text-slate-800 text-lg">{selectedProject.name}</p>
                                </div>
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tech Stack</p>
                                    <p className="font-bold text-slate-800 text-lg">{selectedProject.tech}</p>
                                </div>

                                {/* USER INFO: EMAIL + USERNAME */}
                                <div className="col-span-2 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                        <UserCircle size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Submitted By</p>
                                        <p className="font-bold text-slate-800 text-base">
                                            {selectedProject.userEmail} <span className="text-slate-500 font-medium">({submitterName})</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {selectedProject.repo && (
                                <a href={selectedProject.repo} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-600 font-bold bg-slate-50 p-4 rounded-2xl hover:bg-indigo-50 border border-slate-100 transition-colors">
                                    <Github size={20} /> {selectedProject.repo} <ExternalLink size={16} className="ml-auto opacity-50" />
                                </a>
                            )}

                            <div className="border-t border-slate-100 pt-6">
                                {!readmeContent ? (
                                    <button
                                        onClick={handleFetchReadme}
                                        disabled={isFetching}
                                        className="w-full py-5 rounded-2xl bg-slate-800 text-white font-black text-lg shadow-xl shadow-slate-200 flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                                    >
                                        {isFetching ? <span className="animate-pulse">Fetching Data...</span> : <><DownloadCloud size={22} /> Fetch Project README</>}
                                    </button>
                                ) : (
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2 text-slate-600 font-black uppercase tracking-widest text-xs">
                                                <FileText size={16} /> Repository Summary
                                            </div>
                                            <button onClick={handleFetchReadme} className="text-[10px] font-bold text-slate-400 hover:text-indigo-600">Refetch</button>
                                        </div>
                                        {/* Added scrolling and max-height for large READMEs */}
                                        <div className="prose prose-sm text-slate-600 whitespace-pre-wrap font-medium leading-relaxed max-h-80 overflow-y-auto p-2">
                                            {readmeContent}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}