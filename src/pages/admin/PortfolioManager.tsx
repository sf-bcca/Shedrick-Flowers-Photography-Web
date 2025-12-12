import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';

const PortfolioManager = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<any | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('portfolio')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setItems(data || []);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This cannot be undone.')) return;
        await supabase.from('portfolio').delete().eq('id', id);
        fetchItems();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const values = Object.fromEntries(formData.entries());

        // @ts-ignore
        values.marginTop = formData.get('marginTop') === 'on';
        // @ts-ignore
        values.marginTopInverse = formData.get('marginTopInverse') === 'on';

        if (editItem?.id) {
            await supabase.from('portfolio').update(values).eq('id', editItem.id);
        } else {
            await supabase.from('portfolio').insert([values]);
        }

        setIsModalOpen(false);
        setEditItem(null);
        fetchItems();
    };

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Portfolio</h1>
                <button
                    onClick={() => { setEditItem(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={20} /> Add New Item
                </button>
            </div>

            <div className="bg-white dark:bg-[#1a2232] border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200 dark:border-white/5 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search portfolio..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-[#111722] text-slate-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {loading ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
                            ) : filteredItems.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No items found.</td></tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="w-16 h-12 rounded bg-slate-200 overflow-hidden">
                                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 font-bold text-slate-900 dark:text-white">{item.title}</td>
                                        <td className="px-6 py-3 text-slate-500">{item.category}</td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => { setEditItem(item); setIsModalOpen(true); }}
                                                    className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1e283a] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold dark:text-white">{editItem ? 'Edit Item' : 'New Portfolio Item'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Title</label>
                                <input name="title" defaultValue={editItem?.title} required className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                                <input name="category" defaultValue={editItem?.category} required className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Image URL</label>
                                <input name="image" defaultValue={editItem?.image} required className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm dark:text-white" />
                                <p className="text-xs text-slate-400 mt-1">Tip: Use the Media Library to copy an image URL.</p>
                            </div>
                            <div className="flex gap-6 pt-2">
                                <label className="flex items-center gap-2 text-sm text-slate-300">
                                    <input type="checkbox" name="marginTop" defaultChecked={editItem?.marginTop} className="rounded bg-slate-700 border-white/10 text-primary focus:ring-primary" />
                                    Offset Top
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-300">
                                    <input type="checkbox" name="marginTopInverse" defaultChecked={editItem?.marginTopInverse} className="rounded bg-slate-700 border-white/10 text-primary focus:ring-primary" />
                                    Offset Negative
                                </label>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2 rounded-lg bg-primary hover:bg-blue-600 text-white font-bold shadow-lg shadow-primary/20">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortfolioManager;
