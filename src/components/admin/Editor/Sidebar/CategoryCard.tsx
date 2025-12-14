import React from 'react';
import { Plus } from 'lucide-react';

interface CategoryCardProps {
    category: string;
    setCategory: (category: string) => void;
}

// Temporary: In a real app, this would be fetched from DB
const PRESET_CATEGORIES = [
    'Portraits', 'Travel', 'Gear Reviews', 'Weddings', 'Tutorials', 'Landscape'
];

const CategoryCard: React.FC<CategoryCardProps> = ({ category, setCategory }) => {
    const handleCheck = (cat: string) => {
        // Since the current schema only supports one category string, we just set it.
        // If we want to simulate multi-select UI but single select logic:
        setCategory(cat === category ? '' : cat);
    };

    return (
        <div className="bg-[#1a2232] rounded-xl border border-white/10 p-4 space-y-4">
             <h3 className="font-bold text-white">Categories</h3>

             <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {PRESET_CATEGORIES.map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${category === cat ? 'bg-primary border-primary' : 'border-slate-500 group-hover:border-white'}`}>
                            {category === cat && <div className="w-2 h-2 bg-white rounded-sm" />}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={category === cat}
                            onChange={() => handleCheck(cat)}
                        />
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{cat}</span>
                    </label>
                ))}
             </div>

             <button className="flex items-center gap-1 text-primary text-sm hover:underline">
                <Plus size={14} /> Add New Category
             </button>

             {/* Fallback input if they want something custom not in the list */}
             <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Or type custom..."
                className="w-full bg-[#111722] border border-white/10 rounded-lg p-2 text-sm text-white mt-2 placeholder:text-slate-600"
             />
        </div>
    );
};

export default CategoryCard;
