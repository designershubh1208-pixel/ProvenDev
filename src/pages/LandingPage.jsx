import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap, Cpu, ArrowRight, LayoutDashboard, UserCircle, CheckCircle, Database } from 'lucide-react';

export default function LandingPage({ user }) {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleAuthNavigation = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/auth');
        }
    };

    return (
        <div className={`min-h-screen w-full bg-[#f8f9fc] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden scroll-smooth transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <style>{`
        html { scroll-behavior: smooth; }
        
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        
        .glass-text-dark {
          background: linear-gradient(
            110deg, 
            #0f172a 45%, 
            #94a3b8 50%, 
            #0f172a 55%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2.5s ease-out forwards;
        }

        .glass-text-light {
          background: linear-gradient(
            110deg, 
            #ffffff 45%, 
            #e2e8f0 50%, 
            #ffffff 55%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2.5s ease-out forwards;
        }
      `}</style>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <ShieldCheck size={24} />
                        </div>
                        <span className="text-xl font-black text-slate-800 tracking-tighter">ProvenDev</span>
                    </div>

                    <div className="flex items-center gap-6 md:gap-8 font-bold text-slate-500 text-sm">
                        <a href="#features" className="hidden md:block hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#how-it-works" className="hidden md:block hover:text-indigo-600 transition-colors">How it works</a>

                        {user ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center gap-3 pl-4 border-l border-slate-200 hover:opacity-80 transition-opacity"
                            >
                                <span className="hidden md:block text-right">
                                    <span className="block text-xs text-slate-400 font-medium">Welcome back</span>
                                    <span className="block text-slate-800">{user.displayName || user.email.split('@')[0]}</span>
                                </span>
                                <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-md overflow-hidden">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-indigo-600"><UserCircle size={24} /></div>
                                    )}
                                </div>
                            </button>
                        ) : (
                            <button onClick={() => navigate('/auth')} className="text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-5 py-2.5 rounded-full transition-colors">
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="max-w-7xl mx-auto px-6 pt-40 pb-32 text-center relative perspective-1000">
                <div
                    className="absolute top-20 left-1/2 w-[800px] h-[800px] bg-indigo-200/20 rounded-full blur-3xl -z-10 animate-pulse will-change-transform"
                    style={{ transform: `translate(-50%, ${scrollY * 0.5}px)` }}
                ></div>

                <div
                    className="will-change-transform"
                    style={{ transform: `translateY(${scrollY * 0.2}px)` }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 shadow-sm text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-forwards">
                        <Zap size={14} className="fill-indigo-600" /> New: Blockchain Verification Live
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.95] animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards">
                        <span className="glass-text-dark block">Verify Your Skills.</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-300% animate-gradient">Prove Your Worth.</span>
                    </h1>

                    {/* UPDATED SUBTITLE SIZE HERE */}
                    <p
                        className="text-base md:text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-forwards"
                    >
                        <span className="glass-text-dark" style={{ animationDelay: '0.3s' }}>
                            The first developer portfolio platform that uses AI analysis and Blockchain verification to turn your side projects into undeniable proof of competence.
                        </span>
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-forwards">
                        <button
                            onClick={handleAuthNavigation}
                            className="group px-8 py-4 bg-indigo-600 rounded-[2rem] font-bold text-lg shadow-xl shadow-indigo-200 hover:scale-105 hover:bg-indigo-700 transition-all flex items-center gap-3 active:scale-95"
                        >
                            <span className="glass-text-light flex items-center gap-2" style={{ animationDelay: '0.6s' }}>
                                Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-white" />
                            </span>
                        </button>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-8 py-4 bg-white border border-slate-200 rounded-[2rem] font-bold text-lg hover:border-indigo-200 hover:text-indigo-600 hover:shadow-lg transition-all flex items-center gap-3 active:scale-95"
                        >
                            <span className="glass-text-dark flex items-center gap-2" style={{ animationDelay: '0.6s' }}>
                                <LayoutDashboard size={20} /> Go to Dashboard
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* HOW IT WORKS SECTION */}
            <section id="how-it-works" className="py-24 bg-white relative overflow-hidden z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-forwards">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">How It Works</h2>
                        <p className="text-slate-500 font-medium">From code commit to on-chain asset in 3 steps.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700 fill-mode-forwards">
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gradient-to-r from-indigo-100 via-purple-100 to-indigo-100 -z-10"></div>

                        <div className="text-center group cursor-default">
                            <div className="w-24 h-24 mx-auto bg-white border-4 border-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 shadow-xl mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                                <Cpu size={40} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2">1. Submit & Analyze</h3>
                            <p className="text-slate-500 text-sm leading-relaxed px-4">
                                Paste your GitHub repo. Our AI agents extract the tech stack and summarize the architecture instantly.
                            </p>
                        </div>

                        <div className="text-center group cursor-default">
                            <div className="w-24 h-24 mx-auto bg-white border-4 border-purple-50 rounded-[2rem] flex items-center justify-center text-purple-600 shadow-xl mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2">2. Expert Verification</h3>
                            <p className="text-slate-500 text-sm leading-relaxed px-4">
                                Admins review the code quality. Once approved, your project earns the "Verified" status.
                            </p>
                        </div>

                        <div className="text-center group cursor-default">
                            <div className="w-24 h-24 mx-auto bg-white border-4 border-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 shadow-xl mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                                <Database size={40} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2">3. Mint to Blockchain</h3>
                            <p className="text-slate-500 text-sm leading-relaxed px-4">
                                Verified skills are minted as immutable assets on the Polygon network. Permanent proof of work.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="max-w-7xl mx-auto px-6 py-24 relative z-10">
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Everything You Need to Prove Your Skills</h2>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
                        A complete ecosystem designed to take you from "just another developer" to "verified expert."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                            <Cpu size={28} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-3">AI Powered</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Automated repository parsing ensures your portfolio is always up-to-date with your latest tech stack usage.
                        </p>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-purple-100 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
                        <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-3">Verified Credibility</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Recruiters trust ProvenDev because every "Verified" badge represents a manual code review by experts.
                        </p>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-1000">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-3">Web3 Native</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Your achievements aren't just rows in a database. They are on-chain assets that you own forever.
                        </p>
                    </div>
                </div>
            </section>

            <footer className="py-12 text-center border-t border-slate-100 bg-white relative z-10">
                <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
                    <ShieldCheck size={20} />
                    <span className="font-black text-slate-900 tracking-tighter">ProvenDev</span>
                </div>
                <p className="text-slate-400 font-bold text-sm">
                    &copy; {new Date().getFullYear()} ProvenDev. Building Trust in Code.
                </p>
            </footer>
        </div>
    );
}