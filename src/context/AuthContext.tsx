import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string) => Promise<void>; // Simple simulation for demo if mock
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sessionUser, setSessionUser] = useState<User | null>(null);
    const [mockUser, setMockUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Derived state: Real user takes precedence, but fall back to mock
    const user = sessionUser ?? mockUser;

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSessionUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSessionUser(session?.user ?? null);
            
            // Critical: Only clear loading if we aren't already using a valid mock user
            // or if this event actually established a session.
            // But usually, we just want to update the session user.
            // If session is null, we might still have a mock user, so we don't necessarily stay "loading".
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string) => {
        setLoading(true);
        
        try {
            // This method is primarily used for the mock admin fallback.
            // We set the mock user directly.
            setMockUser({ id: 'mock-admin', email } as User);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await supabase.auth.signOut();
            setSessionUser(null);
            setMockUser(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
