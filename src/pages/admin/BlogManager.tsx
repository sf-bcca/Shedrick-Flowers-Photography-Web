import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../../services/supabaseClient';
import { Plus, Edit, Trash2, Search, X, ChevronLeft } from 'lucide-react';

const BlogManager = () => {
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

    useEffect(() => {
        if (view === 'list') fetchItems();
    }, [view]);

    const fetchItems = async () => {
        setLoading(true);
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
        setView('editor');
    };

    const handleCreate = () => {
        setEditItem(null);
        setTitle('');
        setCategory('');
        setDate(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
        setImage('');
        setExcerpt('');
        setContent('');
        setView('editor');
    };

    const handleSave = async () => {
        const itemData = {
            title,
            category,
            date,
            image,
            excerpt,
            content
        };

        if (editItem?.id) {
            await supabase.from('blog').update(itemData).eq('id', editItem.id);
        } else {
            await supabase.from('blog').insert([itemData]);
        }
        setView('list');
    };

    const filteredItems = items.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['link', 'image'],
            ['clean']
        ],
    };

    if (view === 'editor') {
        return (
            <div className="space-y-6 max-w-4xl mx-auto animate-fade-in-up">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setView('list')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <ChevronLeft size={20} /> Back to List
                    </button>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">{editItem ? 'Edit Post' : 'New Post'}</h1>
                    <button
                        onClick={handleSave}
                        className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-primary/20"
                    >
                        Save Post
                    </button>
                </div>

                <div className="bg-white dark:bg-[#1a2232] rounded-xl border border-slate-200 dark:border-white/5 p-6 space-y-6 shadow-sm">
                    {/* Meta Data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Title</label>
                                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm dark:text-white font-bold" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                                <input value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm dark:text-white" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Date</label>
                                <input value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Featured Image URL</label>
                                <input value={image} onChange={e => setImage(e.target.value)} className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm dark:text-white" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Excerpt (Short Summary)</label>
                        <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2} className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm dark:text-white resize-none" />
                    </div>

                    {/* WYSIWYG Editor */}
                    <div className="prose-editor">
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Content</label>
                        <div className="bg-white text-slate-900 rounded-lg overflow-hidden border border-slate-200">
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                modules={modules}
                                className="h-64"
                            />
                        </div>
                    </div>
                </div>
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
                    <Plus size={20} /> New Post
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
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-primary/50"
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
                                <div className="w-full md:w-24 h-16 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0 text-center md:text-left">
                                    <h3 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h3>
                                    <div className="flex items-center justify-center md:justify-start gap-3 text-xs text-slate-500 mt-1">
                                        <span className="font-bold text-primary uppercase">{item.category}</span>
                                        <span>•</span>
                                        <span>{item.date}</span>
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
