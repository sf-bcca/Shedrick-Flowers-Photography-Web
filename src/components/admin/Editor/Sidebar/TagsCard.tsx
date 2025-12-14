import React, { useState } from 'react';
import { X } from 'lucide-react';

const TagsCard: React.FC = () => {
    // Note: This is purely visual as requested by the user ("Can you do this?"),
    // since the database schema currently lacks a 'tags' column.
    // In a real implementation, we would need to migrate the DB or store this in a JSON column.
    const [tags, setTags] = useState<string[]>(['Iceland', 'Sony Alpha', 'Winter']);
    const [input, setInput] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            if (!tags.includes(input.trim())) {
                setTags([...tags, input.trim()]);
            }
            setInput('');
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    return (
        <div className="bg-[#1a2232] rounded-xl border border-white/10 p-4 space-y-4">
             <h3 className="font-bold text-white">Tags</h3>

             <div className="flex flex-wrap gap-2">
                 {tags.map(tag => (
                     <span key={tag} className="bg-[#3b82f6]/20 text-blue-400 text-xs px-2 py-1 rounded flex items-center gap-1 border border-blue-500/20">
                         {tag}
                         <button onClick={() => removeTag(tag)} className="hover:text-white"><X size={12} /></button>
                     </span>
                 ))}
             </div>

             <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Separate tags with commas..."
                className="w-full bg-[#111722] border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary/50 placeholder:text-slate-600"
             />
        </div>
    );
};

export default TagsCard;
