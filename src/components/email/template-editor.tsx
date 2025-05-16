import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Bold, Italic, Link as LinkIcon, Image as ImageIcon, Variable } from 'lucide-react';
import Button from '../ui/button';
import Input from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const VARIABLES = [
  { key: 'child_name', description: 'Child\'s name' },
  { key: 'parent_name', description: 'Parent\'s name' },
  { key: 'birthdate', description: 'Child\'s birthdate' },
  { key: 'event_name', description: 'Event name' },
  { key: 'business_name', description: 'Business name' },
  { key: 'coupon_code', description: 'Coupon code (if available)' },
];

interface TemplateEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  onTestSend?: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  initialContent = '',
  onChange,
  onTestSend,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your email content here...',
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  const insertVariable = (variable: string) => {
    editor?.commands.insertContent(`[${variable}]`);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={editor.isActive('bold') ? 'primary' : 'outline'}
            onClick={() => editor.chain().focus().toggleBold().run()}
            size="sm"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('italic') ? 'primary' : 'outline'}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            size="sm"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('link') ? 'primary' : 'outline'}
            onClick={() => {
              const url = window.prompt('URL');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            size="sm"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const url = window.prompt('Image URL');
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
            size="sm"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Variable className="h-4 w-4" />}
          >
            Insert Variable
          </Button>
          {onTestSend && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onTestSend}
            >
              Send Test Email
            </Button>
          )}
        </div>
      </div>

      <div className="min-h-[400px] border border-gray-200 rounded-lg">
        <EditorContent editor={editor} className="prose max-w-none p-4" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Available Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {VARIABLES.map((variable) => (
              <button
                key={variable.key}
                onClick={() => insertVariable(variable.key)}
                className="flex items-center gap-2 p-2 text-sm text-left hover:bg-gray-50 rounded-md"
              >
                <Variable className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="font-medium">[{variable.key}]</div>
                  <div className="text-xs text-gray-500">{variable.description}</div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateEditor;