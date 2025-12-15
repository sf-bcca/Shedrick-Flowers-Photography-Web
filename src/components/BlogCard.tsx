import React from 'react';
import { BlogPost } from '../types';

interface BlogCardProps {
    post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
    return (
        <article className="flex flex-col gap-5 group cursor-pointer h-full">
            <div className="w-full aspect-[3/2] overflow-hidden rounded-2xl bg-gray-100 dark:bg-surface-dark relative shadow-md group-hover:shadow-xl transition-all duration-300">
                <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>
            <div className="flex flex-col gap-3 flex-grow">
                <h3 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    {post.title}
                </h3>
                {post.excerpt && (
                    <p className="text-slate-600 dark:text-slate-300 line-clamp-3">
                        {post.excerpt}
                    </p>
                )}
            </div>
        </article>
    );
};
