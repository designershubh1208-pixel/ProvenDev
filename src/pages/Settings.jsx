import React, { useState, useEffect } from 'react';
import { User, Shield, Mail, ChevronDown, Bell, Moon, Fingerprint } from 'lucide-react';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function Settings({ user }) {
    const adminEmail = "devshubh1208@gmail.com"; // Your Locked Admin Email
    const [role, setRole] = useState("User");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.uid) return;

            // Forced Role Lock for your Email
            if (user.email === adminEmail) {
                setRole("Admin");
                return;
            }

            const docSnap = await getDoc(doc(db, "users", user.uid));
            if (docSnap.exists()) {
                setRole(docSnap.data().role || "User");
            }
        };
        fetchUserData();
    }, [user]);

    const handleRoleChange = async (newRole) => {
        // Prevent changing role if you are the master admin
        if (user.email === adminEmail) {
            toast.error("Master Admin role is locked.");
            return;
        }

        setRole(newRole);
        setLoading(true);
        const tid = toast.loading("Updating role...");
        try {
            await setDoc(doc(db, "users", user.uid), {
                role: newRole,
                email: user.email,
                uid: user.uid
            }, { merge: true });
            toast.success(`Role updated to ${newRole}`, { id: tid });
        } catch (err) {
            toast.error("Database update failed.", { id: tid });
        }
        setLoading(false);
    };

    return (
        <div className="space-y-10 p-2 animate-in fade-in duration-700">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Account Settings</h2>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-7 bg-white p-12 rounded-[3.5rem] border border-white shadow-xl shadow-slate-200/50 space-y-10">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-indigo-50 rounded-[2.2rem] flex items-center justify-center overflow-hidden border-4 border-white shadow-inner">
                            {user?.photoURL ? <img src={user.photoURL} referrerPolicy="no-referrer" alt="Profile" className="w-full h-full object-cover" /> : <User size={32} className="text-indigo-600" />}
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Identity Profile</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <SettingField label="Email Address" value={user?.email} icon={<Mail size={18} className="text-slate-300" />} />

                        <div className="space-y-3">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Account Role</p>
                            <div className="relative group">
                                <select
                                    value={role}
                                    disabled={loading || user.email === adminEmail}
                                    onChange={(e) => handleRoleChange(e.target.value)}
                                    className="w-full appearance-none p-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer disabled:opacity-70"
                                >
                                    {/* Logic to show/hide Admin option based on email */}
                                    {user.email === adminEmail ? (
                                        <option value="Admin">Admin</option>
                                    ) : (
                                        <>
                                            <option value="User">User</option>
                                            <option value="Designer">Designer</option>
                                            <option value="Developer">Developer</option>
                                        </>
                                    )}
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>

                        <SettingField label="Verification Status" value="Level 1 Verified" icon={<Shield size={18} className="text-slate-300" />} />
                        <SettingField label="Member Since" value="Feb 2026" icon={<Fingerprint size={18} className="text-slate-300" />} />
                    </div>
                </div>

                {/* Restore Notifications/Preferences UI */}
                <div className="col-span-12 lg:col-span-5 bg-white p-12 rounded-[3.5rem] border border-white shadow-xl shadow-slate-200/50 space-y-10">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <Bell className="text-indigo-500" /> Notifications
                    </h3>
                    <div className="space-y-6">
                        <ToggleOption label="Email Alerts" description="Get notified of successful mints" active={true} />
                        <ToggleOption label="Security Notifications" description="Critical account updates" active={true} />
                        <ToggleOption label="Dark Mode" description="Coming soon" active={false} icon={<Moon size={16} />} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper components remain the same
function SettingField({ label, value, icon }) {
    return (
        <div className="space-y-3">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">{label}</p>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-5 rounded-3xl font-bold text-slate-700">
                {icon} {value}
            </div>
        </div>
    );
}

function ToggleOption({ label, description, active, icon }) {
    return (
        <div className="flex items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem]">
            <div className="flex items-center gap-3">
                {icon && <span className="text-slate-400">{icon}</span>}
                <div><p className="font-bold text-slate-800">{label}</p><p className="text-xs text-slate-400 font-medium">{description}</p></div>
            </div>
            <div className={`w-14 h-8 rounded-full relative ${active ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-200'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${active ? 'right-1' : 'left-1'}`}></div>
            </div>
        </div>
    );
}