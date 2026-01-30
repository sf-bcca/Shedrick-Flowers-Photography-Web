import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isAdmin, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                // Not logged in -> Redirect to Login
                navigate('/login');
            } else if (!isAdmin) {
                // Logged in but not Admin -> Redirect to Home
                // 🛡️ Security: Redirect unauthorized users (e.g. random Google logins) away from admin area
                console.warn(`🛡️ Security: Unauthorized access attempt to Admin Area by ${user.email}`);
                navigate('/');
            }
        }
    }, [user, isAdmin, loading, navigate]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background-dark text-white">Loading...</div>;

    // Only render children if user is logged in AND is admin
    return <>{(user && isAdmin) ? children : null}</>;
};

export default ProtectedRoute;
