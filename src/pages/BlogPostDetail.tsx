import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogCard } from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchPostById, fetchRelatedPosts } from '../services/supabaseClient';
import { BlogPost } from '../types';
import { sanitizeHtml } from '../utils/sanitize';

const BlogPostDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const loadData = async () => {
            setLoading(true);
            const postData = await fetchPostById(id);
            if (postData) {
                setPost(postData);
                const related = await fetchRelatedPosts(postData.id!, postData.category);
                setRelatedPosts(related);
            }
            setLoading(false);
        };

        loadData();

        // Scroll to top when ID changes (e.g. clicking related post)
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <LoadingSpinner fullScreen className="min-h-screen" label="Loading post details..." />
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center gap-4">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Post not found</h1>
                <Link to="/blog" className="text-primary hover:underline">Return to Blog</Link>
            </div>
        );
    }

    return (
        <>
            {/* Article Header */}
            <article className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                <div className="mb-8 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                        {post.category}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <div className="text-slate-500 dark:text-slate-400 font-medium">
                        {new Date(post.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>

                {/* Featured Image */}
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl mb-12">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div className="prose prose-lg md:prose-xl dark:prose-invert mx-auto max-w-none">
                    {/* Render HTML content safely if it contains HTML tags from rich text editor,
                        or just text if plain text. Assuming HTML for now as is common with blogs. */}
                    {post.content ? (
                        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
                    ) : (
                        <p>{post.excerpt}</p>
                    )}
                </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="bg-gray-50 dark:bg-gray-900 py-16">
                    <div className="max-w-7xl mx-auto px-4 md:px-10">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">
                            Related Posts
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedPosts.map((item) => (
                                <Link key={item.id} to={`/blog/${item.id}`}>
                                    <BlogCard post={item} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default BlogPostDetail;
