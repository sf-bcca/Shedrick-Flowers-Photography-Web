import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/Layout';
import { BlogCard } from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchPublishedBlogPosts } from '../services/supabaseClient';
import { BlogPost } from '../types';

const BlogPage = () => {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            // Try to load from session cache first
            const cached = sessionStorage.getItem('blogPosts');
            if (cached) {
                try {
                    setBlogPosts(JSON.parse(cached));
                    setLoading(false);
                    return;
                } catch (e) {
                    console.warn('Invalid cached blog posts, fetching fresh...');
                    sessionStorage.removeItem('blogPosts');
                }
            }

            // Use the secure fetch function to get only published posts
            const data = await fetchPublishedBlogPosts();
            setBlogPosts(data);
            setLoading(false);
            sessionStorage.setItem('blogPosts', JSON.stringify(data));
        };

        loadPosts();
    }, []);

    return (
        <PageLayout>
            <section className="w-full px-4 md:px-10 lg:px-40 py-8 md:py-16">
                <div className="@container">
                    <div className="flex flex-col gap-8 md:gap-16 lg:flex-row items-center">
                        <div className="w-full lg:w-3/5 aspect-video md:aspect-[16/9] lg:aspect-[4/3] rounded-xl overflow-hidden shadow-2xl relative group cursor-pointer">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6dwKikfC342afi1MaVXiwZ0NcdwRthX9XaX-XeqTUmq19TtL9cuUn8i3bUdl6O1OpjLtGCMJU2VSy7e6MQ4NFK3dEz8P25bultf_M3ZJOn1geKTDaeHMN0n8Zbs8xQQe2iDspgYevSCg7k7XNtL9CVXHZP9RWRnYyfVmk5izk4qBQvKItg4w0pPakHP0U5epcpKlwbzReOM3Ls6Jxuy9djYvzP8S1jxHDykpmb1ZrzZywwQcJf6iJdjUup9_Bb4yA8p7sJ6rS7Cf-"
                                alt="Featured"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="w-full lg:w-2/5 flex flex-col gap-6 items-start text-left animate-fade-in-up">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-[-0.033em] text-slate-900 dark:text-white">Capturing the Silence of the North</h1>
                            <button className="flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-white text-base font-bold transition-all hover:bg-blue-600">Read Story</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 md:px-10 lg:px-40 py-16 max-w-[1440px] mx-auto">
                {loading ? (
                    <LoadingSpinner fullScreen={false} size="sm" label="Loading blog posts..." />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {blogPosts.map((item) => (
                            <Link key={item.id} to={`/blog/${item.id}`}>
                                <BlogCard post={item} />
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </PageLayout>
    );
};

export default BlogPage;
