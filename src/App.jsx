import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Auth from './Auth';
import DashboardLayout from './DashboardLayout';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#f3f4f9]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
    </div>
  );

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} gutter={8} />
      {!user ? <Auth /> : <DashboardLayout user={user} />}
    </>
  );
}