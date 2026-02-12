import React from 'react';
import { Wallet, ShieldCheck, ExternalLink, Zap, Globe } from 'lucide-react';

export default function Portfolio() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 p-2">
            {/* Premium Web3 Hero */}
            <div className="bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#d946ef] rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                <div className="relative z-10 max-w-2xl">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/30 shadow-inner">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-5xl font-black mb-4 tracking-tighter">On-Chain Portfolio</h2>
                    <p className="text-indigo-50 text-xl font-medium leading-relaxed opacity-90">
                        Your skills are cryptographically secured on the Polygon network. Connect your wallet to view your unique NFT credentials.
                    </p>
                    <button className="mt-10 bg-white text-indigo-600 px-10 py-5 rounded-3xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                        <Wallet size={22} /> Connect Web3 Wallet
                    </button>
                </div>

                {/* Decorative Background Element */}
                <div className="absolute -bottom-20 -right-20 opacity-10 rotate-12">
                    <Globe size={500} />
                </div>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white border-4 border-dashed border-slate-100 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center group hover:border-indigo-200 transition-all duration-500">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-300 mb-6 group-hover:scale-110 group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-all">
                        <ExternalLink size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">No Minted Assets</h3>
                    <p className="text-slate-400 font-bold max-w-xs mt-3 leading-relaxed">
                        Register your projects in the Inventory first to begin the minting process.
                    </p>
                </div>
            </div>
        </div>
    );
}