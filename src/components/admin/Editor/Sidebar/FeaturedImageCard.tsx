import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import MediaPicker from '../../MediaPicker';

interface FeaturedImageCardProps {
    image: string;
    setImage: (url: string) => void;
}

const FeaturedImageCard: React.FC<FeaturedImageCardProps> = ({ image, setImage }) => {
    const [showPicker, setShowPicker] = useState(false);

    return (
        <>
            <div className="bg-[#1a2232] rounded-xl border border-white/10 p-4 space-y-4">
                <h3 className="font-bold text-white">Featured Image</h3>

                <button
                    onClick={() => setShowPicker(true)}
                    type="button"
                    aria-label={image ? "Change featured image" : "Select featured image"}
                    className="relative w-full aspect-video bg-[#111722] border-2 border-dashed border-white/10 rounded-lg overflow-hidden cursor-pointer hover:border-primary/50 transition-colors group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                    {image ? (
                        <>
                            <img src={image} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white font-bold flex items-center gap-2">
                                    <Upload size={16} /> Change Image
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 group-hover:text-primary group-focus-visible:text-primary transition-colors">
                            <Upload size={24} className="mb-2" />
                            <span className="text-xs font-bold uppercase">Select Image</span>
                        </div>
                    )}
                </button>
                {image && (
                    <button
                        onClick={() => setImage('')}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                        <X size={12} /> Remove Image
                    </button>
                )}
                <p className="text-xs text-slate-500 text-center">Recommended size: 1200x630px</p>
            </div>

            {showPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1a2232] w-full max-w-5xl h-[80vh] rounded-xl overflow-hidden shadow-2xl relative">
                        <MediaPicker
                            onSelect={(url) => {
                                setImage(url);
                                setShowPicker(false);
                            }}
                            onClose={() => setShowPicker(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default FeaturedImageCard;
