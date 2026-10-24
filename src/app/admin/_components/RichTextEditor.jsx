'use client';

import { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading2, Heading3, List, ListOrdered, Quote, Link2, Link2Off, Undo2, Redo2,
} from 'lucide-react';
import { cx } from '@/app/utils/cx';
import { label as labelCls } from './formStyles';

// TipTap serializes an empty document as a single empty paragraph; treat that as
// "no content" so an untouched editor doesn't persist a stray <p></p>.
const EMPTY = '<p></p>';

/** One toolbar button. preventDefault on mousedown keeps the editor selection. */
function Btn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active || undefined}
      className={cx(
        'inline-flex h-8 w-8 items-center justify-center rounded-md border transition',
        'disabled:cursor-not-allowed disabled:opacity-40',
        active
          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-500/60 dark:bg-emerald-500/15 dark:text-emerald-300'
          : 'border-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-5 w-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />;
}

/**
 * Reusable WYSIWYG editor (TipTap). Emits sanitized-on-save HTML via `onChange`.
 * Controlled by `value` for the initial document; the editor owns its state after
 * mount, and `value` changes only re-sync when they differ (e.g. a programmatic
 * reset), so typing never fights the cursor.
 *
 * @param {{
 *   value?: string,
 *   onChange?: (html: string) => void,
 *   label?: string,
 *   help?: string,
 *   minHeight?: number,
 * }} props
 */
export default function RichTextEditor({ value = '', onChange, label, help, minHeight = 160 }) {
  const editor = useEditor({
    immediatelyRender: false, // required under Next SSR to avoid hydration mismatch
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
        },
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'richtext focus:outline-none',
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html === EMPTY ? '' : html);
    },
  });

  // Re-sync when the parent resets `value` externally. Guarded so it never fires
  // on the editor's own keystrokes (which would reset the cursor to the start).
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || '';
    if (next !== current && !(next === '' && current === EMPTY)) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link')?.href || '';
    const url = window.prompt('Link URL (leave empty to remove)', prev);
    if (url === null) return; // cancelled
    const chain = editor.chain().focus().extendMarkRange('link');
    if (url.trim() === '') chain.unsetLink().run();
    else chain.setLink({ href: url.trim() }).run();
  }, [editor]);

  return (
    <div>
      {label ? <span className={labelCls}>{label}</span> : null}
      <div className="rounded-md border border-slate-300 bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/30 dark:border-slate-600 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 p-1.5 dark:border-slate-700">
          {editor ? (
            <>
              <Btn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
                <Bold className="h-4 w-4" />
              </Btn>
              <Btn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
                <Italic className="h-4 w-4" />
              </Btn>
              <Btn title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
                <UnderlineIcon className="h-4 w-4" />
              </Btn>
              <Btn title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
                <Strikethrough className="h-4 w-4" />
              </Btn>
              <Divider />
              <Btn title="Heading" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                <Heading2 className="h-4 w-4" />
              </Btn>
              <Btn title="Subheading" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                <Heading3 className="h-4 w-4" />
              </Btn>
              <Divider />
              <Btn title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <List className="h-4 w-4" />
              </Btn>
              <Btn title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                <ListOrdered className="h-4 w-4" />
              </Btn>
              <Btn title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                <Quote className="h-4 w-4" />
              </Btn>
              <Divider />
              <Btn title="Add / edit link" active={editor.isActive('link')} onClick={setLink}>
                <Link2 className="h-4 w-4" />
              </Btn>
              <Btn title="Remove link" disabled={!editor.isActive('link')} onClick={() => editor.chain().focus().unsetLink().run()}>
                <Link2Off className="h-4 w-4" />
              </Btn>
              <Divider />
              <Btn title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
                <Undo2 className="h-4 w-4" />
              </Btn>
              <Btn title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
                <Redo2 className="h-4 w-4" />
              </Btn>
            </>
          ) : (
            <span className="px-1 text-xs text-slate-400">Loading editor…</span>
          )}
        </div>
        <div className="px-3 py-2 text-slate-900 dark:text-slate-100">
          <EditorContent editor={editor} />
        </div>
      </div>
      {help ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{help}</p> : null}
    </div>
  );
}
