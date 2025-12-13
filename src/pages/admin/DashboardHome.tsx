import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FileText, Image as ImageIcon, Layers, TrendingUp } from 'lucide-react';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        portfolio: 0,
        blog: 0,
        services: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [portfolio, blog, services] = await Promise.all([
                    supabase.from('portfolio').select('*', { count: 'exact', head: true }),
                    supabase.from('blog').select('*', { count: 'exact', head: true }),
                    supabase.from('services').select('*', { count: 'exact', head: true })
                ]);

                setStats({
                    portfolio: portfolio.count || 0,
                    blog: blog.count || 0,
                    services: services.count || 0
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const data = [
        { name: 'Portfolio', count: stats.portfolio, color: '#3b82f6' },
        { name: 'Blog Posts', count: stats.blog, color: '#10b981' },
        { name: 'Services', count: stats.services, color: '#8b5cf6' },
    ];

    const StatCard = ({ title, count, icon: Icon, color }: any) => (
        <div className="bg-white dark:bg-[#1a2232] p-6 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-white`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            <div>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wide">{title}</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{loading ? '...' : count}</h3>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Dashboard</h1>
                <p className="text-slate-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Portfolio Items"
                    count={stats.portfolio}
                    icon={ImageIcon}
                    color="text-blue-500 bg-blue-500"
                />
                <StatCard
                    title="Blog Posts"
                    count={stats.blog}
                    icon={FileText}
                    color="text-emerald-500 bg-emerald-500"
                />
                <StatCard
                    title="Active Services"
                    count={stats.services}
                    icon={Layers}
                    color="text-purple-500 bg-purple-500"
                />
            </div>

            {/* Chart Section */}
            <div className="bg-white dark:bg-[#1a2232] p-6 md:p-8 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="text-primary" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Content Overview</h3>
                </div>

                <div className="h-[300px] w-full">
                    {loading ? (
                        <div className="h-full flex items-center justify-center text-slate-400">Loading data...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{fill: 'transparent'}}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
