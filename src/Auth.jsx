import React, { useState } from 'react';
import { auth, db, googleProvider } from './firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, ShieldCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // FUNCTION TO SAVE USER TO DATABASE
    const saveUserToDb = async (user) => {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            uid: user.uid,
            name: user.displayName || email.split('@')[0],
            email: user.email,
            role: "User", // Default role
            accountVerified: false,
            photoURL: user.photoURL || "",
            createdAt: serverTimestamp()
        }, { merge: true });
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success("Welcome back!");
            } else {
                const res = await createUserWithEmailAndPassword(auth, email, password);
                await saveUserToDb(res.user);
                toast.success("Account created successfully!");
            }
        } catch (err) {
            toast.error(err.message);
        }
        setLoading(false);
    };

    const handleGoogle = async () => {
        try {
            const res = await signInWithPopup(auth, googleProvider);
            await saveUserToDb(res.user);
            toast.success("Signed in with Google!");
        } catch (err) {
            toast.error("Google Sign-in failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f4f9] flex items-center justify-center p-4 font-sans">
            <motion.div layout className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-white">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <ShieldCheck size={32} />
                    </div>
                </div>
                <h2 className="text-3xl font-black text-center text-slate-800 mb-8 tracking-tighter">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <form onSubmit={handleAuth} className="space-y-4">
                    <input required type="email" placeholder="Email Address" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" onChange={(e) => setEmail(e.target.value)} />
                    <input required type="password" placeholder="Password" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95">
                        {loading ? <Loader2 className="animate-spin" /> : (isLogin ? <LogIn size={20} /> : <UserPlus size={20} />)}
                        {isLogin ? 'Sign In' : 'Get Started'}
                    </button>
                </form>
                <div className="relative my-8 text-center uppercase text-[10px] font-black text-slate-300 tracking-[0.2em]">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                    <span className="relative bg-white px-4">Or continue with</span>
                </div>
                <button onClick={handleGoogle} className="w-full border border-slate-200 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-slate-50 transition-all active:scale-95">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
                    Google Account
                </button>
                <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-8 text-indigo-600 font-bold text-sm hover:underline">
                    {isLogin ? "New here? Create account" : "Already have an account? Login"}
                </button>
            </motion.div>
        </div>
    );
}