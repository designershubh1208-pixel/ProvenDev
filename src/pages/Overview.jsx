// src/pages/Overview.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function Overview({ userName }) {
    const [stats, setStats] = useState({
        total: 0,
        verified: 0,
        minted: 0,
        rate: 0
    });

    useEffect(() => {
        const q = query(collection(db, "skills"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => doc.data());
            const total = docs.length;
            const verified = docs.filter(s => s.status === 'Verified').length;
            const minted = docs.filter(s => s.status === 'Minted').length;

            // Calculate real rate (Verified / Total) or 0 if no skills
            const rate = total > 0 ? ((verified / total) * 100).toFixed(1) : 0;

            setStats({ total, verified, minted, rate });
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="p-2 space-y-8 animate-in fade-in duration-1000">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter capitalize">
                Good morning, {userName}!
            </h1>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-9 grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Total Skills" value={stats.total} icon={<Zap className="text-indigo-500" />} />
                    <StatCard label="Verified" value={stats.verified} icon={<ShieldCheck className="text-emerald-500" />} />
                    <StatCard label="On-Chain" value={stats.minted} icon={<Zap className="text-purple-500" />} />
                    <StatCard label="Score" value={`${stats.rate}%`} icon={<TrendingUp className="text-amber-500" />} />

                    <div className="col-span-4 bg-white rounded-[3rem] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-white/50 relative overflow-hidden">
                        <h3 className="font-bold text-xl mb-10">Skill Growth Progress</h3>
                        <div className="h-60 flex items-end justify-between gap-6 px-4">
                            {[40, 70, 45, stats.rate > 0 ? stats.rate : 20, 65, 85, 30].map((h, i) => (
                                <motion.div
                                    initial={{ height: 0 }} animate={{ height: `${h}%` }}
                                    key={i} className={`flex-1 rounded-2xl ${i === 3 ? 'bg-indigo-600 shadow-xl shadow-indigo-200' : 'bg-indigo-50 hover:bg-indigo-100 transition-colors'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-3 space-y-8">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-8 text-white shadow-2xl shadow-indigo-500/20">
                        <h4 className="font-bold mb-2 text-indigo-100">Success Rate</h4>
                        <div className="text-5xl font-black mb-4 tracking-tighter">{stats.rate}%</div>
                        <p className="text-indigo-100 text-sm mb-6">
                            {stats.total > 0 ? `You have successfully verified ${stats.verified} projects.` : "Add your first project to see your success rate!"}
                        </p>
                        <button className="w-full bg-white text-indigo-600 font-black py-4 rounded-2xl hover:scale-[1.03] transition-transform shadow-lg">View Status</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon }) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-white flex flex-col items-start gap-4 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">{icon}</div>
            <div>
                <div className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{value}</div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            </div>
        </div>
    );
}