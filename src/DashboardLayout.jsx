import React, { useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot, updateDoc } from 'firebase/firestore';
import { LogOut, Bell, X } from 'lucide-react';
import Overview from './pages/Overview';
import Skills from './pages/Skills';
import Portfolio from './pages/Portfolio';
import Settings from './pages/Settings';
import AdminPanel from './pages/AdminPanel';

export default function DashboardLayout({ user }) {
    const adminEmail = "devshubh1208@gmail.com";
    const isAdmin = user?.email === adminEmail;

    const [activePage, setActivePage] = useState('dashboard');
    const [userData, setUserData] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showNotifs, setShowNotifs] = useState(false);

    const finalName = user?.displayName || userData?.name || user?.email?.split('@')[0];
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const fetchUser = async () => {
            if (!user?.uid) return;
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) setUserData(docSnap.data());
        };
        fetchUser();

        // NOTIFICATION LISTENER
        if (user) {
            const target = isAdmin ? "ADMIN" : user.uid;
            // Removed orderBy to prevent index errors
            const q = query(collection(db, "notifications"), where("recipient", "==", target));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const rawData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Client-side sort: Newest first
                const sortedData = rawData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                setNotifications(sortedData);
            });
            return () => unsubscribe();
        }
    }, [user, isAdmin]);

    const handleOpenNotifs = () => {
        setShowNotifs(!showNotifs);
        if (!showNotifs && unreadCount > 0) {
            notifications.forEach(async (n) => {
                if (!n.read) await updateDoc(doc(db, "notifications", n.id), { read: true });
            });
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#f3f4f9] font-sans text-slate-800 p-6 flex flex-col">
            <nav className="max-w-[1440px] mx-auto w-full bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] px-8 py-4 flex items-center justify-between shadow-sm mb-8 relative z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center"><span className="text-2xl font-black text-indigo-600 tracking-tighter">ProvenDev</span></div>
                    <div className="flex items-center gap-1 bg-[#f8f9fe] p-1.5 rounded-2xl border border-slate-100">
                        <NavTab label="Dashboard" active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
                        <NavTab label="Inventory" active={activePage === 'inventory'} onClick={() => setActivePage('inventory')} />
                        <NavTab label="Portfolio" active={activePage === 'portfolio'} onClick={() => setActivePage('portfolio')} />
                        <NavTab label="Settings" active={activePage === 'settings'} onClick={() => setActivePage('settings')} />
                        {isAdmin && <NavTab label="Admin Panel" active={activePage === 'admin'} onClick={() => setActivePage('admin')} />}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* NOTIFICATION UI */}
                    <div className="relative">
                        <button onClick={handleOpenNotifs} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
                            <Bell size={20} />
                            {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                        </button>

                        {showNotifs && (
                            <div className="absolute top-12 right-0 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-4 animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-center mb-4 px-2">
                                    <h4 className="font-black text-slate-800">Notifications</h4>
                                    <button onClick={() => setShowNotifs(false)}><X size={16} className="text-slate-400" /></button>
                                </div>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <p className="text-xs text-slate-400 text-center py-4">No new notifications</p>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.id} className={`p-3 rounded-2xl text-sm ${n.read ? 'bg-slate-50 opacity-60' : 'bg-indigo-50 border border-indigo-100'}`}>
                                                <p className="font-bold text-slate-700">{n.title}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                                                <p className="text-[10px] text-slate-400 mt-2 text-right">{n.createdAt?.toDate ? n.createdAt.toDate().toLocaleDateString() : 'Just now'}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <button onClick={() => signOut(auth)} className="text-slate-400 hover:text-red-500 p-2"><LogOut size={20} /></button>
                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-indigo-100 flex items-center justify-center">
                        {user?.photoURL ? <img src={user.photoURL} referrerPolicy="no-referrer" alt="Profile" className="w-full h-full object-cover" /> : <span className="text-indigo-700 font-bold uppercase">{finalName[0]}</span>}
                    </div>
                </div>
            </nav>

            <main className="max-w-[1440px] mx-auto w-full">
                {activePage === 'dashboard' && <Overview userName={finalName} />}
                {activePage === 'inventory' && <Skills />}
                {activePage === 'portfolio' && <Portfolio />}
                {activePage === 'settings' && <Settings user={user} />}
                {activePage === 'admin' && isAdmin && <AdminPanel />}
            </main>
        </div>
    );
}

function NavTab({ label, active, onClick }) {
    return <button onClick={onClick} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${active ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>{label}</button>;
}