import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';

/**
 * Authentication Context Interface
 * Describes the shape of the authentication context exposed to consumers.
 */
interface AuthContextType {
    /** The currently authenticated Supabase user, or null if not logged in. */
    user: User | null;
    /** Indicates if the current user is the authorized admin. */
    isAdmin: boolean;
    /** Indicates if the initial session check is still in progress. */
    loading: boolean;
    /** Function to sign out the current user. */
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 *
 * Wraps the application to provide global authentication state.
 * Manages the Supabase session and listens for auth state changes (login, logout, refresh).
 *
 * @param children - The child components that require access to auth state.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // 🛡️ Security: Enforce Allowlist for Admin Access
    // We strictly check the email against the environment variable to prevent unauthorized
    // users (e.g. from random Google logins) from accessing admin features.
    //
    // NOTE: The fallback to 'shedrick@shedrickflowers.com' is maintained to prevent
    // locking out the site owner during the migration if the environment variable
    // is not yet set in production. In a strict environment, this fallback should be removed.
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'shedrick@shedrickflowers.com';
    const isAdmin = !!user?.email && user.email === adminEmail;

    useEffect(() => {
        // Check for existing session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        setLoading(true);
        try {
            await supabase.auth.signOut();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to access the authentication context.
 *
 * Usage:
 * const { user, isAdmin, loading, signOut } = useAuth();
 *
 * @throws {Error} If used outside of an AuthProvider.
 * @returns {AuthContextType} The current auth context values.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
