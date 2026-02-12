import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig'; // Import auth directly
import { onAuthStateChanged } from 'firebase/auth';
import UserInventory from './UserInventory';
import AdminInventory from './AdminInventory';

export default function Skills() { // Removed props dependency
    const adminEmail = "devshubh1208@gmail.com";
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Direct check: Ask Firebase who is logged in right now
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
            setLoading(false); // Stop loading whether user is found or not
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20 text-slate-400 font-bold animate-pulse">
                Verifying Identity...
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center p-20 text-red-400 font-bold">
                Please log in to view inventory.
            </div>
        );
    }

    // Switch Views based on email
    if (currentUser.email === adminEmail) {
        return <AdminInventory />;
    }

    return <UserInventory user={currentUser} />;
}