import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { PageLayout } from '../components/Layout';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            
            navigate('/admin');
        } catch (err: any) {
            // Security: Log the actual error for debugging but show a generic message to the user
            console.error("Login failed:", err);

            // Check for network errors vs auth errors
            if (err.message === 'Network request failed' || err.message?.includes('network')) {
                setError('Network error. Please check your connection.');
            } else {
                // Generic error to prevent user enumeration
                setError('Authentication failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/admin`
                }
            });
            if (error) throw error;
        } catch (err: any) {
            console.error("Google Login failed:", err);
            setError('Failed to initiate login. Please try again.');
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
                        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm" role="alert">
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
                                placeholder="shedrick@shedrickflowers.com"
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

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-white/10"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-[#1a2232] text-slate-500">Or continue with</span></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 py-3 bg-white dark:bg-[#111722] border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-white font-bold rounded-lg transition-all"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </PageLayout>
    );
};

export default LoginPage;
