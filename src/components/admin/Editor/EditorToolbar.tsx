import React from 'react';
import { Editor } from '@tiptap/react';
import {
    Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2,
    Quote, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Video,
    Undo, Redo
} from 'lucide-react';

interface EditorToolbarProps {
    editor: Editor | null;
    addImage: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor, addImage }) => {
    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 bg-[#1a2232] border-b border-white/10 rounded-t-lg sticky top-0 z-10">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors ${editor.isActive('bold') ? 'text-primary bg-primary/10' : ''}`}
                title="Bold"
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors ${editor.isActive('italic') ? 'text-primary bg-primary/10' : ''}`}
                title="Italic"
            >
                <Italic size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors ${editor.isActive('underline') ? 'text-primary bg-primary/10' : ''}`}
                title="Underline"
            >
                <UnderlineIcon size={18} />
            </button>

            <div className="w-px h-6 bg-white/10 mx-1 self-center" />

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors ${editor.isActive('heading', { level: 2 }) ? 'text-primary bg-primary/10' : ''}`}
                title="Heading 2"
            >
                <Heading1 size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors ${editor.isActive('heading', { level: 3 }) ? 'text-primary bg-primary/10' : ''}`}
                title="Heading 3"
            >
                <Heading2 size={18} />
            </button>

            <div className="w-px h-6 bg-white/10 mx-1 self-center" />

            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors ${editor.isActive('blockquote') ? 'text-primary bg-primary/10' : ''}`}
                title="Quote"
            >
                <Quote size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors ${editor.isActive('bulletList') ? 'text-primary bg-primary/10' : ''}`}
                title="Bullet List"
            >
                <List size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors ${editor.isActive('orderedList') ? 'text-primary bg-primary/10' : ''}`}
                title="Ordered List"
            >
                <ListOrdered size={18} />
            </button>

            <div className="w-px h-6 bg-white/10 mx-1 self-center" />

            <button
                onClick={setLink}
                className={`p-2 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors ${editor.isActive('link') ? 'text-primary bg-primary/10' : ''}`}
                title="Link"
            >
                <LinkIcon size={18} />
            </button>
            <button
                onClick={addImage}
                className={`p-2 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors`}
                title="Image"
            >
                <ImageIcon size={18} />
            </button>
             {/* Placeholder for Video if requested later, keeping Icon for visual match to screenshot */}
             <button
                onClick={() => alert("Video embedding not configured yet.")}
                className={`p-2 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors`}
                title="Video"
            >
                <Video size={18} />
            </button>
        </div>
    );
};

export default EditorToolbar;
