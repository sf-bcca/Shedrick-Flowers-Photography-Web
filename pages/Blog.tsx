import React, { useEffect, useState } from 'react';
import { PageLayout } from '../components/Layout';
import { fetchData } from '../services/supabaseClient';
import { BlogPost } from '../types';

const BlogPage = () => {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData('blog').then((data: any) => {
            setBlogPosts(data);
            setLoading(false);
        });
    }, []);

    return (
        <PageLayout>
            {/* Featured Section */}
            <section className="w-full px-4 md:px-10 lg:px-40 py-8 md:py-16">
                <div className="@container">
                    <div className="flex flex-col gap-8 md:gap-16 lg:flex-row items-center">
                        <div className="w-full lg:w-3/5 aspect-video md:aspect-[16/9] lg:aspect-[4/3] rounded-xl overflow-hidden shadow-2xl relative group cursor-pointer">
                            <img 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6dwKikfC342afi1MaVXiwZ0NcdwRthX9XaX-XeqTUmq19TtL9cuUn8i3bUdl6O1OpjLtGCMJU2VSy7e6MQ4NFK3dEz8P25bultf_M3ZJOn1geKTDaeHMN0n8Zbs8xQQe2iDspgYevSCg7k7XNtL9CVXHZP9RWRnYyfVmk5izk4qBQvKItg4w0pPakHP0U5epcpKlwbzReOM3Ls6Jxuy9djYvzP8S1jxHDykpmb1ZrzZywwQcJf6iJdjUup9_Bb4yA8p7sJ6rS7Cf-" 
                                alt="Icelandic Highlands Landscape"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-6 left-6 bg-primary/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">Featured Story</div>
                        </div>
                        <div className="w-full lg:w-2/5 flex flex-col gap-6 items-start text-left animate-fade-in-up">
                            <div className="flex items-center gap-2 text-sm text-primary font-bold uppercase tracking-wider">
                                <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                                Latest Release
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-[-0.033em] text-slate-900 dark:text-white">Capturing the Silence of the North</h1>
                            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                                A journey through the Icelandic highlands exploring the vast, untouched landscapes and the ethereal quality of light during the winter solstice.
                            </p>
                            <div className="flex items-center gap-6 pt-4">
                                <button className="flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-white text-base font-bold transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-1">Read Story</button>
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">5 min read</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky Search & Filters */}
            <section className="sticky top-20 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-[#243047] py-4 px-4 md:px-10 lg:px-40 transition-colors duration-300 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center w-full max-w-[1440px] mx-auto">
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto scrollbar-hide mask-fade">
                        <button className="flex h-10 shrink-0 items-center justify-center px-6 rounded-full bg-primary text-white text-sm font-bold transition-transform hover:scale-105 shadow-md shadow-primary/20">All</button>
                        {['Portraits', 'Travel', 'Gear', 'Tutorials'].map(filter => (
                            <button key={filter} className="flex h-10 shrink-0 items-center justify-center px-6 rounded-full bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap">
                                {filter}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-80 group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </div>
                        <input className="block w-full p-2.5 pl-10 text-sm text-slate-900 dark:text-white bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary placeholder-slate-400 transition-all outline-none" placeholder="Search articles..." type="text"/>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="px-4 md:px-10 lg:px-40 py-16 max-w-[1440px] mx-auto">
                {loading ? (
                    <div className="flex justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {blogPosts.map((item, idx) => (
                            <article key={idx} className="flex flex-col gap-5 group cursor-pointer">
                                <div className="w-full aspect-[3/2] overflow-hidden rounded-2xl bg-gray-100 dark:bg-surface-dark relative shadow-md group-hover:shadow-xl transition-all duration-300">
                                    <img 
                                        src={item.image} 
                                        alt={item.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Read More</div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-primary">
                                        <span>{item.category}</span>
                                        <span className="size-1 rounded-full bg-slate-400"></span>
                                        <span className="text-slate-500 dark:text-slate-400">{item.date}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{item.excerpt || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
                 <div className="flex justify-center pt-20">
                    <button className="group flex items-center gap-2 px-8 py-4 rounded-full border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-105">
                        Load More Stories
                        <span className="material-symbols-outlined text-[20px] group-hover:translate-y-1 transition-transform">expand_more</span>
                    </button>
                 </div>
            </section>
        </PageLayout>
    );
};

export default BlogPage;
