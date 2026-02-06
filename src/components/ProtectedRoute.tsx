import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    // 🛡️ Security: Enforce strict admin access via environment variable
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

    useEffect(() => {
        if (!loading) {
            // 1. Authentication Check
            if (!user) {
                navigate('/login');
                return;
            }

            // 2. Authorization Check (Role Based Access Control)
            // Fail Closed: If VITE_ADMIN_EMAIL is not set, NO ONE is admin.
            if (!adminEmail) {
                console.error("CRITICAL: VITE_ADMIN_EMAIL is not configured. Admin access is disabled.");
                return;
            }

            // Strict Email Matching
            if (user.email !== adminEmail) {
                console.warn(`Unauthorized access attempt by ${user.email}`);
                navigate('/'); // Redirect to public home
            }
        }
    }, [user, loading, navigate, adminEmail]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background-dark text-white">Loading...</div>;

    // Fail Closed: Render blocking error if config is missing
    if (user && !adminEmail) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-900 p-8 text-center">
                <div>
                    <h1 className="text-2xl font-bold mb-4">Security Configuration Error</h1>
                    <p>The admin panel is currently disabled because <code>VITE_ADMIN_EMAIL</code> is not set.</p>
                    <p className="mt-2 text-sm">Please configure this environment variable to resume access.</p>
                </div>
            </div>
        );
    }

    // Authorization Check for Rendering
    // If authenticated but not authorized, render nothing (useEffect will redirect)
    if (user && adminEmail && user.email !== adminEmail) {
        return null;
    }

    return <>{user ? children : null}</>;
};

export default ProtectedRoute;
