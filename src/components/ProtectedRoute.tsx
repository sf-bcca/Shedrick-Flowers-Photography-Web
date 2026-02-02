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
            } else if (adminEmail && user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
                console.warn(`Sentinel: Unauthorized access attempt to admin area by ${user.email}`);
                navigate('/');
            }
        }
    }, [user, loading, navigate, adminEmail]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background-dark text-white">Loading...</div>;

    // Fail securely: Do not render children if unauthorized, even before redirect happens
    if (adminEmail && user && user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
        return null;
    }

    return <>{user ? children : null}</>;
};

export default ProtectedRoute;
