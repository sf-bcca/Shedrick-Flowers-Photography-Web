import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import EditorToolbar from './EditorToolbar';
import MediaPicker from '../MediaPicker';
import { X } from 'lucide-react';

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange }) => {
    const [showMediaPicker, setShowMediaPicker] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                    HTMLAttributes: {
                        class: 'text-white font-bold',
                    },
                },
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc list-outside ml-4',
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal list-outside ml-4',
                    },
                },
                blockquote: {
                    HTMLAttributes: {
                        class: 'border-l-4 border-primary pl-4 italic text-slate-300',
                    },
                },
            }),
            Image,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 underline cursor-pointer hover:text-blue-400',
                    rel: 'noopener noreferrer',
                },
            }),
            Placeholder.configure({
                placeholder: 'Write your story...',
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-4 text-slate-300',
            },
        },
    });

    const addImage = () => {
        setShowMediaPicker(true);
    };

    const handleImageSelect = (url: string) => {
        if (editor) {
            editor.chain().focus().setImage({ src: url }).run();
        }
        setShowMediaPicker(false);
    };

    return (
        <div className="bg-[#1a2232] rounded-lg border border-white/10 flex flex-col min-h-[500px]">
            <EditorToolbar editor={editor} addImage={addImage} />
            <EditorContent editor={editor} className="flex-1" />

            {/* Media Picker Modal */}
            {showMediaPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1a2232] w-full max-w-5xl h-[80vh] rounded-xl overflow-hidden shadow-2xl relative">
                        <MediaPicker onSelect={handleImageSelect} onClose={() => setShowMediaPicker(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TiptapEditor;
