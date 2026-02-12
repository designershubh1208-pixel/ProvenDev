import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { UserCircle, Trash2, ShieldAlert, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPanel() {
    const adminEmail = "devshubh1208@gmail.com";
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Reference the global users collection
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            // Map all documents into state
            const allUsers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(allUsers);
            setLoading(false);
        }, (error) => {
            // Log specific permission or connection errors found in console
            console.error("Firestore Error on Reload:", error);
            toast.error("Failed to sync user list. Check database permissions.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (userId, userEmail, userName) => {
        if (userEmail === adminEmail) {
            toast.error("Cannot delete the master admin account.");
            return;
        }
        if (window.confirm(`Are you sure you want to permanently delete ${userName}?`)) {
            const tid = toast.loading("Deleting user...");
            try {
                await deleteDoc(doc(db, "users", userId));
                toast.success("User removed from system", { id: tid });
            } catch (err) {
                toast.error("Deletion failed", { id: tid });
            }
        }
    };

    const toggleStatus = async (userId, userEmail, currentStatus) => {
        if (userEmail === adminEmail) {
            toast.error("Cannot suspend the master admin account.");
            return;
        }
        const newStatus = currentStatus === 'Suspended' ? 'Active' : 'Suspended';
        const tid = toast.loading(`Setting status to ${newStatus}...`);
        try {
            await updateDoc(doc(db, "users", userId), { accountStatus: newStatus });
            toast.success(`User is now ${newStatus}`, { id: tid });
        } catch (err) {
            toast.error("Status update failed", { id: tid });
        }
    };

    if (loading) return (
        <div className="p-20 text-center font-bold text-slate-400 animate-pulse">
            Syncing User Records...
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 p-2">
            <div className="px-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Admin Management</h2>
                <p className="text-slate-500 font-medium text-lg mt-1">Monitor and manage all system users.</p>
            </div>

            <div className="bg-white rounded-[3rem] border border-white shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">User Profile</th>
                                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Address</th>
                                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Role</th>
                                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.length > 0 ? users.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 overflow-hidden shadow-inner">
                                                {u.photoURL ? (
                                                    <img src={u.photoURL} referrerPolicy="no-referrer" alt="P" className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserCircle size={20} />
                                                )}
                                            </div>
                                            <span className="font-extrabold text-slate-800">{u.name || "User"}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 font-bold text-slate-500">{u.email}</td>
                                    <td className="px-10 py-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${u.email === adminEmail ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                            {u.email === adminEmail ? 'ADMIN' : (u.role || 'USER')}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                disabled={u.email === adminEmail}
                                                onClick={() => toggleStatus(u.id, u.email, u.accountStatus)}
                                                className={`p-2 rounded-xl transition-all disabled:opacity-20 ${u.accountStatus === 'Suspended' ? 'text-emerald-500 bg-emerald-50' : 'text-amber-500 bg-amber-50'}`}
                                            >
                                                {u.accountStatus === 'Suspended' ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
                                            </button>
                                            <button
                                                disabled={u.email === adminEmail}
                                                onClick={() => handleDelete(u.id, u.email, u.name)}
                                                className="p-2 text-red-500 bg-red-50 rounded-xl transition-all disabled:opacity-20"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center text-slate-300 font-bold italic">
                                        No registered users found in database.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}