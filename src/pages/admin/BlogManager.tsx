import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Plus, Edit, Trash2, Search, ChevronLeft, Eye, Settings, X } from 'lucide-react';
import TiptapEditor from '../../components/admin/Editor/TiptapEditor';
import PublishCard from '../../components/admin/Editor/Sidebar/PublishCard';
import CategoryCard from '../../components/admin/Editor/Sidebar/CategoryCard';
import FeaturedImageCard from '../../components/admin/Editor/Sidebar/FeaturedImageCard';
import TagsCard from '../../components/admin/Editor/Sidebar/TagsCard';
import { BlogPost } from '../../types';
import { useAuth } from '../../context/AuthContext';

const BlogManager = () => {
    const { user } = useAuth();
    const [view, setView] = useState<'list' | 'editor'>('list');
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editItem, setEditItem] = useState<any | null>(null);
    const [search, setSearch] = useState('');

    // Editor State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [image, setImage] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [status, setStatus] = useState<'Draft' | 'Published'>('Draft');
    const [saving, setSaving] = useState(false);

    // Mobile Settings Drawer State
    const [showMobileSettings, setShowMobileSettings] = useState(false);

    useEffect(() => {
        if (view === 'list') fetchItems();
    }, [view]);

    const fetchItems = async () => {
        setLoading(true);
        // We'll fetch all and filter in UI for now, or add .eq('status', ...) later
        const { data, error } = await supabase.from('blog').select('*').order('created_at', { ascending: false });
        if (!error) setItems(data || []);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        await supabase.from('blog').delete().eq('id', id);
        fetchItems();
    };

    const handleEdit = (item: any) => {
        setEditItem(item);
        setTitle(item.title);
        setCategory(item.category);
        setDate(item.date);
        setImage(item.image);
        setExcerpt(item.excerpt || '');
        setContent(item.content || item.excerpt || '');
        setTags(item.tags || []);
        setStatus(item.status || 'Draft'); // Graceful fallback if status column missing
        setView('editor');
    };

    const handleCreate = () => {
        setEditItem(null);
        setTitle('');
        setCategory('');
        // Initialize with ISO date for better DB compatibility, though display might need formatting
        // Or if we want to keep the display as "MMM DD, YYYY", we must handle conversion before save.
        // For now, let's stick to the current format but ensure we convert it if needed or use a safe format.
        // Actually, the best way is to use YYYY-MM-DD for consistency.
        // But the UI expects a text string. Let's use ISO YYYY-MM-DD which is universally accepted.
        const today = new Date().toISOString().split('T')[0];
        setDate(today);
        setImage('');
        setExcerpt('');
        setContent('');
        setTags([]);
        setStatus('Draft');
        setView('editor');
    };

    const handleSave = async () => {
        setSaving(true);
        const itemData = {
            title,
            category,
            date, // Ensure this is valid DATE format (YYYY-MM-DD) or Postgres compatible string
            image,
            excerpt,
            content,
            tags,
            status
        };

        try {
            if (editItem?.id) {
                const { error } = await supabase.from('blog').update(itemData).eq('id', editItem.id);
                if (error) throw error;
            } else {
                const { data, error } = await supabase.from('blog').insert([itemData]).select().single();
                if (error) throw error;
                if (data) setEditItem(data);
            }
            // Optional: Don't exit editor immediately on save, just show success
            // setView('list');
            alert('Saved successfully!');
        } catch (error: any) {
            console.error(error);
            // Display the actual error message to help debugging
            alert(`Error saving post: ${error.message || 'Unknown error'}. \n\nIf the error mentions missing columns (status, tags, content), please run the migration scripts in Supabase.`);
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        setStatus('Published');
        const itemData = {
            title,
            category,
            date,
            image,
            excerpt,
            content,
            tags,
            status: 'Published'
        };

        setSaving(true);
        try {
             if (editItem?.id) {
                await supabase.from('blog').update(itemData).eq('id', editItem.id);
            } else {
                const { data, error } = await supabase.from('blog').insert([itemData]).select().single();
                if (error) throw error;
                if (data) setEditItem(data);
            }
            alert('Published successfully!');
            setView('list');
        } catch (error) {
             console.error(error);
             alert('Error publishing post. Please check database migrations.');
        } finally {
             setSaving(false);
        }
    };

    const handlePreview = () => {
        if (editItem?.id) {
            window.open(`/#/blog/${editItem.id}`, '_blank');
        } else {
            alert('Please save the draft first to preview.');
        }
    };

    const filteredItems = items.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));

    // Avatar Logic
    const userInitials = user?.email?.substring(0, 2).toUpperCase() || 'AD';
    const userAvatar = user?.user_metadata?.avatar_url;

    const renderSidebarContent = () => (
        <div className="space-y-6">
            <PublishCard
                status={status}
                setStatus={setStatus}
                date={date}
                setDate={setDate}
                onSave={handleSave}
                onPublish={handlePublish}
                saving={saving}
            />
            <CategoryCard category={category} setCategory={setCategory} />
            <TagsCard tags={tags} setTags={setTags} />
            <FeaturedImageCard image={image} setImage={setImage} />

            {/* Excerpt Card */}
            <div className="bg-[#1a2232] rounded-xl border border-white/10 p-4 space-y-4">
                 <h3 className="font-bold text-white">Excerpt</h3>
                 <textarea
                    value={excerpt}
                    onChange={e => setExcerpt(e.target.value)}
                    rows={4}
                    className="w-full bg-[#111722] border border-white/10 rounded-lg p-2.5 text-sm text-white resize-none placeholder:text-slate-600"
                    placeholder="Write a short summary..."
                />
            </div>
        </div>
    );

    if (view === 'editor') {
        return (
            <div className="flex flex-col h-[calc(100vh-100px)] relative">
                {/* Editor Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setView('list')}
                            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
                        >
                            <ChevronLeft size={20} /> <span className="hidden sm:inline">Back to Posts</span>
                        </button>
                        <h1 className="text-xl font-black text-white truncate">
                            {editItem ? 'Edit' : 'New'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="hidden sm:block text-sm text-slate-500">
                             Autosaved just now
                         </div>
                         <button
                            onClick={handlePreview}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors text-sm font-bold"
                         >
                             <Eye size={16} /> <span className="hidden sm:inline">Preview</span>
                         </button>

                         {/* Mobile Settings Button */}
                         <button
                            onClick={() => setShowMobileSettings(true)}
                            className="lg:hidden p-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
                         >
                             <Settings size={20} />
                         </button>

                         {userAvatar ? (
                             <img src={userAvatar} alt="User" className="w-8 h-8 rounded-full object-cover border border-white/10 hidden sm:block" />
                         ) : (
                             <div className="w-8 h-8 rounded-full bg-white text-black font-bold items-center justify-center text-xs hidden sm:flex">
                                 {userInitials}
                             </div>
                         )}
                    </div>
                </div>

                {/* Editor Layout: Main + Sidebar */}
                <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden relative">
                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-20">
                         {/* Title Input */}
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Post Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-transparent text-3xl sm:text-4xl font-black text-white placeholder:text-slate-600 border-none outline-none focus:ring-0 px-0"
                            />
                        </div>

                        {/* Editor */}
                        <TiptapEditor content={content} onChange={setContent} />

                        <div className="mt-6 text-slate-500 text-sm italic">
                             {content ? `${content.split(' ').length} words` : '0 words'}
                        </div>
                    </div>

                    {/* Sidebar (Desktop) */}
                    <div className="hidden lg:block w-80 flex-shrink-0 overflow-y-auto custom-scrollbar pb-20">
                        {renderSidebarContent()}
                    </div>
                </div>

                {/* Mobile Settings Drawer */}
                {showMobileSettings && (
                    <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-[#0f1523]">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#1a2232]">
                            <h2 className="text-xl font-bold text-white">Post Settings</h2>
                            <button
                                onClick={() => setShowMobileSettings(false)}
                                className="p-2 text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {renderSidebarContent()}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Blog Posts</h1>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={20} /> <span className="hidden sm:inline">New Post</span>
                </button>
            </div>

            <div className="bg-white dark:bg-[#1a2232] border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-white/5">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                        />
                    </div>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-white/5">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Loading...</div>
                    ) : filteredItems.length === 0 ? (
                         <div className="p-8 text-center text-slate-500">No posts found.</div>
                    ) : (
                        filteredItems.map((item) => (
                            <div key={item.id} className="p-4 flex flex-col md:flex-row gap-4 items-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <div className="w-full md:w-24 h-16 bg-slate-200 dark:bg-[#111722] rounded-lg overflow-hidden flex-shrink-0">
                                    {item.image ? (
                                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No Img</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 text-center md:text-left">
                                    <h3 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h3>
                                    <div className="flex items-center justify-center md:justify-start gap-3 text-xs text-slate-500 mt-1">
                                        <span className="font-bold text-primary uppercase">{item.category}</span>
                                        <span>•</span>
                                        <span>{item.date}</span>
                                        {item.status && (
                                            <>
                                                <span>•</span>
                                                <span className={`px-1.5 py-0.5 rounded ${item.status === 'Published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                    {item.status}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
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
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogManager;
