import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Zap, ShieldCheck, TrendingUp } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';

export default function Overview({ userName }) {
    const adminEmail = "devshubh1208@gmail.com";

    const [stats, setStats] = useState({ total: 0, verified: 0, onChain: 0, score: 0 });
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [greeting, setGreeting] = useState("Good Morning"); // Default

    // 1. Calculate Greeting based on IST
    useEffect(() => {
        const getGreeting = () => {
            // Get current hour in IST (Indian Standard Time)
            const hour = parseInt(new Date().toLocaleTimeString("en-US", {
                timeZone: "Asia/Kolkata",
                hour12: false,
                hour: "numeric"
            }));

            if (hour >= 5 && hour < 12) return "Good Morning";
            if (hour >= 12 && hour < 17) return "Good Afternoon";
            return "Good Evening";
        };
        setGreeting(getGreeting());
    }, []);

    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsubAuth();
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        let q;
        const isAdmin = currentUser.email === adminEmail;

        if (isAdmin) {
            q = query(collection(db, "skills"));
        } else {
            q = query(collection(db, "skills"), where("userId", "==", currentUser.uid));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => doc.data());

            const total = docs.length;
            const verified = docs.filter(d => d.status === 'Verified').length;
            const onChain = docs.filter(d => d.blockchainHash).length;
            const score = total > 0 ? Math.round((verified / total) * 100) : 0;

            setStats({ total, verified, onChain, score });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    if (loading) return <div className="p-10 text-slate-400 font-bold animate-pulse">Loading Dashboard...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">

            {/* HEADER WITH DYNAMIC GREETING */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                    {greeting}, {userName || "Developer"}!
                </h1>
                <p className="text-slate-500 font-medium mt-1">
                    {currentUser?.email === adminEmail ? "System Overview & Global Stats" : "Here is your skill verification progress."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-40">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                        <Zap size={20} />
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-slate-900">{stats.total}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Skills</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-40">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-slate-900">{stats.verified}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-40">
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                        <Zap size={20} />
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-slate-900">{stats.onChain}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">On-Chain</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-40">
                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-slate-900">{stats.score}%</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Score</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[300px]">
                    <h3 className="text-lg font-black text-slate-800">Skill Growth Progress</h3>
                    <div className="mt-10 flex items-end justify-between h-40 gap-4 opacity-50">
                        {[40, 60, 30, 80, 50, 90, 20].map((h, i) => (
                            <div key={i} className="w-full bg-indigo-50 rounded-t-xl hover:bg-indigo-600 transition-colors" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200 flex flex-col justify-center">
                    <p className="text-indigo-200 font-bold text-sm">Success Rate</p>
                    <h2 className="text-6xl font-black mt-2 tracking-tighter">{stats.score}%</h2>
                    <p className="text-indigo-100 mt-4 text-sm font-medium">
                        You have successfully verified {stats.verified} projects.
                    </p>
                    <button className="mt-8 bg-white text-indigo-700 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform">
                        View Status
                    </button>
                </div>

            </div>
        </div>
    );
}