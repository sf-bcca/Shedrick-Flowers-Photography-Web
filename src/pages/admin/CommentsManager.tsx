import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import { CheckCircle, XCircle, Trash2, Search, MessageSquare } from 'lucide-react';

const CommentsManager = () => {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setComments(data || []);
        setLoading(false);
    };

    const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
        const { error } = await supabase
            .from('comments')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            setComments(comments.map(c => c.id === id ? { ...c, status: newStatus } : c));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', id);

        if (!error) {
            setComments(comments.filter(c => c.id !== id));
        }
    };

    const filteredComments = comments
        .filter(c => filter === 'all' || c.status === filter)
        .filter(c =>
            c.author_name.toLowerCase().includes(search.toLowerCase()) ||
            c.content.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Comments</h1>
                <div className="flex bg-white dark:bg-[#1a2232] rounded-lg p-1 border border-slate-200 dark:border-white/10">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${filter === 'all' ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${filter === 'pending' ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${filter === 'approved' ? 'bg-green-100 text-green-700' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        Approved
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1a2232] border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-white/5">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
                        <input
                            type="text"
                            aria-label="Search comments"
                            placeholder="Search comments..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-white/5">
                    {loading ? (
                        <LoadingSpinner fullScreen={false} className="py-20" label="Loading comments..." />
                    ) : filteredComments.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
                            <MessageSquare size={32} className="opacity-20" />
                            <p>No comments found.</p>
                        </div>
                    ) : (
                        filteredComments.map((comment) => (
                            <div key={comment.id} className="p-6 flex flex-col md:flex-row gap-4 md:items-start hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-slate-900 dark:text-white">{comment.author_name}</h3>
                                        <span className="text-xs text-slate-500">{comment.author_email}</span>
                                        <span className="text-xs text-slate-400">• {new Date(comment.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{comment.content}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide
                                            ${comment.status === 'approved' ? 'bg-green-100 text-green-700' :
                                              comment.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                              'bg-amber-100 text-amber-700'}`
                                        }>
                                            {comment.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 md:pl-4 md:border-l border-slate-100 dark:border-white/5">
                                    {comment.status !== 'approved' && (
                                        <button
                                            onClick={() => handleStatusChange(comment.id, 'approved')}
                                            className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                            title="Approve"
                                        >
                                            <CheckCircle size={20} />
                                        </button>
                                    )}
                                    {comment.status !== 'rejected' && (
                                        <button
                                            onClick={() => handleStatusChange(comment.id, 'rejected')}
                                            className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                                            title="Reject (Hide)"
                                        >
                                            <XCircle size={20} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete Permanently"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentsManager;
