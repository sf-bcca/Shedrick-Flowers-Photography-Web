import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';

/**
 * Authentication Context Interface
 * Describes the shape of the authentication context exposed to consumers.
 */
interface AuthContextType {
    /** The currently authenticated Supabase user, or null if not logged in. */
    user: User | null;
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

    const signOut = useCallback(async () => {
        setLoading(true);
        try {
            await supabase.auth.signOut();
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Memoize the context value to prevent unnecessary re-renders of consumers
    // when AuthProvider re-renders but the actual auth state hasn't changed.
    const value = useMemo(() => ({ user, loading, signOut }), [user, loading, signOut]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to access the authentication context.
 *
 * Usage:
 * const { user, loading, signOut } = useAuth();
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
