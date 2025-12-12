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
                                </div>
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors">{item.title}</h3>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </PageLayout>
    );
};

export default BlogPage;
