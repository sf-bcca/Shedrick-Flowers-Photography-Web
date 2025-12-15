import React from 'react';
import { ChevronDown, Calendar, Loader2 } from 'lucide-react';

interface PublishCardProps {
    status: 'Draft' | 'Published';
    setStatus: (status: 'Draft' | 'Published') => void;
    date: string;
    setDate: (date: string) => void;
    onSave: () => void;
    onPublish: () => void;
    saving: boolean;
}

const PublishCard: React.FC<PublishCardProps> = ({
    status, setStatus, date, setDate, onSave, onPublish, saving
}) => {
    return (
        <div className="bg-[#1a2232] rounded-xl border border-white/10 p-4 space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-white">Publishing</h3>
                <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${status === 'Published' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    {status}
                </span>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Status</label>
                    <div className="relative">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as 'Draft' | 'Published')}
                            className="w-full bg-[#111722] border border-white/10 rounded-lg p-2.5 text-sm text-white appearance-none cursor-pointer hover:border-white/20 transition-colors"
                        >
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Visibility</label>
                    <div className="relative">
                        <select
                            className="w-full bg-[#111722] border border-white/10 rounded-lg p-2.5 text-sm text-white appearance-none cursor-pointer hover:border-white/20 transition-colors"
                            defaultValue="Public"
                        >
                            <option value="Public">Public</option>
                            <option value="Private">Private</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Publish Date</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            placeholder="MMM DD, YYYY"
                            className="w-full bg-[#111722] border border-white/10 rounded-lg p-2.5 text-sm text-white"
                        />
                         <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                        onClick={onSave}
                        disabled={saving}
                        className="bg-[#111722] hover:bg-white/5 border border-white/10 text-white py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button
                        onClick={onPublish}
                        disabled={saving}
                        className="bg-primary hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                         {saving && <Loader2 className="animate-spin" size={16} />}
                         Publish
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublishCard;
