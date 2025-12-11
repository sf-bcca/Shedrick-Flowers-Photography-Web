import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { PageLayout } from '../components/Layout';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signIn } = useAuth(); // If we used custom sign in, but let's use direct supabase for real feel

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Attempt real login first
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                 // Fallback for Demo/Mock mode if real auth fails or isn't set up
                 if (email === 'admin@lensandlight.com' && password === 'admin') {
                     // Manually set mock user in context (this requires context to expose a setter, 
                     // or we rely on the `signIn` simulation method in AuthContext)
                     await signIn(email); 
                     navigate('/admin');
                     return;
                 }
                 throw error;
            }
            
            navigate('/admin');
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout>
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white dark:bg-[#1a2232] rounded-2xl shadow-xl border border-slate-200 dark:border-white/5 p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Admin Access</h1>
                        <p className="text-slate-500 text-sm mt-2">Sign in to manage your content</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="admin@lensandlight.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-400">Mock Creds: admin@lensandlight.com / admin</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default LoginPage;
