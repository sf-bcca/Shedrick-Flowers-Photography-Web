import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchData, createItem, updateItem, deleteItem } from '../services/supabaseClient';
import { PageLayout } from '../components/Layout';

type Tab = 'portfolio' | 'blog' | 'services';

const AdminDashboard = () => {
    const { user, loading, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('portfolio');
    const [data, setData] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [editItem, setEditItem] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !user) navigate('/login');
    }, [user, loading, navigate]);

    // Fetch data when tab changes
    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setIsFetching(true);
        const result = await fetchData(activeTab);
        setData(result || []);
        setIsFetching(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const values = Object.fromEntries(formData.entries());

        // Basic boolean conversion for checkboxes (specific to portfolio)
        if (activeTab === 'portfolio') {
             // @ts-ignore
             values.marginTop = formData.get('marginTop') === 'on';
             // @ts-ignore
             values.marginTopInverse = formData.get('marginTopInverse') === 'on';
        }

        if (editItem?.id) {
            await updateItem(activeTab, editItem.id, values);
        } else {
            await createItem(activeTab, values);
        }

        setIsModalOpen(false);
        setEditItem(null);
        loadData();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            await deleteItem(activeTab, id);
            loadData();
        }
    };

    const openModal = (item: any = null) => {
        setEditItem(item);
        setIsModalOpen(true);
    };

    if (loading) return <div className="min-h-screen bg-background-dark flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
            <nav className="bg-surface-dark border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                    <h1 className="font-bold text-lg text-white">CMS Dashboard</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-400 hidden md:block">{user?.email}</span>
                    <button onClick={() => signOut()} className="text-sm text-white hover:text-red-400 transition-colors">Sign Out</button>
                </div>
            </nav>

            <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
                {/* Sidebar */}
                <aside className="w-full md:w-64 bg-surface-light dark:bg-[#1a2232] border-r border-slate-200 dark:border-white/5 p-6 flex flex-col gap-2">
                    <button 
                        onClick={() => setActiveTab('portfolio')} 
                        className={`text-left px-4 py-3 rounded-lg font-bold transition-all flex items-center gap-3 ${activeTab === 'portfolio' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                    >
                        <span className="material-symbols-outlined">photo_library</span> Portfolio
                    </button>
                    <button 
                        onClick={() => setActiveTab('blog')} 
                        className={`text-left px-4 py-3 rounded-lg font-bold transition-all flex items-center gap-3 ${activeTab === 'blog' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                    >
                        <span className="material-symbols-outlined">article</span> Blog Posts
                    </button>
                    <button 
                        onClick={() => setActiveTab('services')} 
                        className={`text-left px-4 py-3 rounded-lg font-bold transition-all flex items-center gap-3 ${activeTab === 'services' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                    >
                        <span className="material-symbols-outlined">payments</span> Services
                    </button>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-black capitalize">{activeTab} Manager</h2>
                        <button onClick={() => openModal()} className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined">add</span>
                            Add New
                        </button>
                    </div>

                    {isFetching ? (
                        <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {data.map((item: any) => (
                                <div key={item.id} className="group bg-white dark:bg-[#1a2232] rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all relative">
                                    <div className="aspect-[3/2] bg-gray-100 relative overflow-hidden">
                                        <img 
                                            src={item.image} 
                                            alt={item.title} 
                                            loading="lazy"
                                            className="w-full h-full object-cover" 
                                        />
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openModal(item)} className="p-2 bg-white/90 text-slate-900 rounded-full hover:text-primary shadow-lg"><span className="material-symbols-outlined text-sm">edit</span></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/90 text-slate-900 rounded-full hover:text-red-500 shadow-lg"><span className="material-symbols-outlined text-sm">delete</span></button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg mb-1 truncate">{item.title}</h3>
                                        <p className="text-xs font-bold text-primary uppercase tracking-wider">{item.category || item.price}</p>
                                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">{item.description || item.excerpt || 'No description'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
                    <div className="bg-white dark:bg-[#1e283a] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold">{editItem ? 'Edit Item' : 'Create New Item'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Title</label>
                                    <input name="title" defaultValue={editItem?.title} required className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{activeTab === 'services' ? 'Price' : 'Category'}</label>
                                    <input name={activeTab === 'services' ? 'price' : 'category'} defaultValue={editItem?.category || editItem?.price} required className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Image URL</label>
                                <input name="image" defaultValue={editItem?.image} required className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm" />
                            </div>

                            {activeTab !== 'portfolio' && (
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{activeTab === 'blog' ? 'Excerpt' : 'Description'}</label>
                                    <textarea name={activeTab === 'blog' ? 'excerpt' : 'description'} defaultValue={editItem?.excerpt || editItem?.description} rows={3} className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm resize-none" />
                                </div>
                            )}

                            {activeTab === 'blog' && (
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Date</label>
                                    <input name="date" defaultValue={editItem?.date} placeholder="Oct 24, 2023" className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm" />
                                </div>
                            )}

                            {activeTab === 'portfolio' && (
                                <div className="flex gap-4 pt-2">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" name="marginTop" defaultChecked={editItem?.marginTop} className="rounded bg-slate-700 border-white/10 text-primary focus:ring-primary" />
                                        Offset Top
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" name="marginTopInverse" defaultChecked={editItem?.marginTopInverse} className="rounded bg-slate-700 border-white/10 text-primary focus:ring-primary" />
                                        Offset Negative
                                    </label>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2 rounded-lg bg-primary hover:bg-blue-600 text-white font-bold shadow-lg shadow-primary/20">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
