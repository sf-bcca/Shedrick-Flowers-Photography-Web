import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';

const ServiceManager = () => {
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
            .from('services')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setItems(data || []);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        await supabase.from('services').delete().eq('id', id);
        fetchItems();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const values = Object.fromEntries(formData.entries());

        if (editItem?.id) {
            await supabase.from('services').update(values).eq('id', editItem.id);
        } else {
            await supabase.from('services').insert([values]);
        }

        setIsModalOpen(false);
        setEditItem(null);
        fetchItems();
    };

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Services</h1>
                <button
                    onClick={() => { setEditItem(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={20} /> Add Service
                </button>
            </div>

            <div className="bg-white dark:bg-[#1a2232] border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-white/5">
                     <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {loading ? (
                        <p className="text-slate-500">Loading...</p>
                    ) : filteredItems.length === 0 ? (
                        <p className="text-slate-500">No services found.</p>
                    ) : (
                        filteredItems.map((item) => (
                            <div key={item.id} className="group bg-slate-50 dark:bg-[#111722] rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 relative">
                                <div className="aspect-video bg-slate-200 relative">
                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditItem(item); setIsModalOpen(true); }} className="p-2 bg-white text-slate-900 rounded-full hover:text-primary shadow-sm"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-white text-slate-900 rounded-full hover:text-red-500 shadow-sm"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg dark:text-white">{item.title}</h3>
                                    <p className="text-primary font-bold text-sm mb-2">{item.price}</p>
                                    <p className="text-slate-500 text-sm line-clamp-2">{item.description}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1e283a] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold dark:text-white">{editItem ? 'Edit Service' : 'New Service'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Service Title</label>
                                <input name="title" defaultValue={editItem?.title} required className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm dark:text-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Price</label>
                                    <input name="price" defaultValue={editItem?.price} required className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Image URL</label>
                                    <input name="image" defaultValue={editItem?.image} required className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm dark:text-white" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
                                <textarea name="description" defaultValue={editItem?.description} required rows={4} className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm dark:text-white resize-none" />
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

export default ServiceManager;
