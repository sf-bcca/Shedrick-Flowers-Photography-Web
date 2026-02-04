import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate('/login');
                return;
            }

            // Sentinel Security Check: Enforce Admin Email
            if (!adminEmail) {
                console.error('🚨 Sentinel Security: VITE_ADMIN_EMAIL is not set. Admin access is disabled.');
                navigate('/');
                return;
            }

            if (user.email !== adminEmail) {
                console.warn(`🛡️ Sentinel: Unauthorized admin access attempt by ${user.email}`);
                navigate('/');
            }
        }
    }, [user, loading, navigate, adminEmail]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background-dark text-white">Loading...</div>;

    // Render Protection: Only render children if verified
    const isAuthorized = user && adminEmail && user.email === adminEmail;

    return <>{isAuthorized ? children : null}</>;
};

export default ProtectedRoute;
