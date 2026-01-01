import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import {
    Bold,
    Heading1,
    Heading2,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Quote,
    Redo,
    Strikethrough,
    Undo,
} from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
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

        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
    };

    return (
        <div className="flex flex-wrap gap-1 border-b border-input bg-transparent p-1">
            <Toggle
                size="sm"
                pressed={editor.isActive('heading', { level: 2 })}
                onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                aria-label="Toggle h2"
            >
                <Heading1 className="size-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('heading', { level: 3 })}
                onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                aria-label="Toggle h3"
            >
                <Heading2 className="size-4" />
            </Toggle>
            <div className="mx-1 h-6 w-px self-center bg-input" />
            <Toggle
                size="sm"
                pressed={editor.isActive('bold')}
                onPressedChange={() =>
                    editor.chain().focus().toggleBold().run()
                }
                aria-label="Toggle bold"
            >
                <Bold className="size-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('italic')}
                onPressedChange={() =>
                    editor.chain().focus().toggleItalic().run()
                }
                aria-label="Toggle italic"
            >
                <Italic className="size-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('strike')}
                onPressedChange={() =>
                    editor.chain().focus().toggleStrike().run()
                }
                aria-label="Toggle strikethrough"
            >
                <Strikethrough className="size-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('link')}
                onPressedChange={setLink}
                aria-label="Toggle link"
            >
                <LinkIcon className="size-4" />
            </Toggle>
            <div className="mx-1 h-6 w-px self-center bg-input" />
            <Toggle
                size="sm"
                pressed={editor.isActive('bulletList')}
                onPressedChange={() =>
                    editor.chain().focus().toggleBulletList().run()
                }
                aria-label="Toggle bullet list"
            >
                <List className="size-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('orderedList')}
                onPressedChange={() =>
                    editor.chain().focus().toggleOrderedList().run()
                }
                aria-label="Toggle ordered list"
            >
                <ListOrdered className="size-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('blockquote')}
                onPressedChange={() =>
                    editor.chain().focus().toggleBlockquote().run()
                }
                aria-label="Toggle blockquote"
            >
                <Quote className="size-4" />
            </Toggle>
            <div className="mx-1 h-6 w-px self-center bg-input" />
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="h-9 px-2.5"
            >
                <Undo className="size-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="h-9 px-2.5"
            >
                <Redo className="size-4" />
            </Button>
        </div>
    );
};

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-purple-600 underline hover:text-purple-800',
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none p-4 focus:outline-none min-h-[150px]',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Update content if value changes externally (and editor isn't focused/dirty logic could be better but sufficient for simplified CRUD)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            // Check if content is actually different to avoid cursor jumping loops,
            // though simplistic check here. In robust apps we verify "isFocused".
            if (editor.getText() === '' && value === '') return;
           // editor.commands.setContent(value);
        }
    }, [value, editor]);

    return (
        <div className="overflow-hidden rounded-md border border-input bg-transparent shadow-sm focus-within:ring-1 focus-within:ring-ring">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
