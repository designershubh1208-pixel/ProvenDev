import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { Toaster } from 'react-hot-toast';

// Import Pages
import DashboardLayout from './DashboardLayout';
import Auth from './Auth'; // Assuming your auth component is here
import LandingPage from './pages/LandingPage';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f9]">
        <div className="animate-pulse font-black text-indigo-300 text-xl">Loading ProvenDev...</div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* 1. Landing Page (Public) */}
        <Route path="/" element={<LandingPage user={user} />} />

        {/* 2. Authentication Page */}
        {/* If user is already logged in, redirect to Dashboard. If not, show Auth. */}
        <Route
          path="/auth"
          element={user ? <Navigate to="/dashboard" replace /> : <Auth />}
        />

        {/* 3. Dashboard (Protected) */}
        {/* If user is logged in, show Dashboard. If not, redirect to Auth. */}
        <Route
          path="/dashboard"
          element={user ? <DashboardLayout user={user} /> : <Navigate to="/auth" replace />}
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}