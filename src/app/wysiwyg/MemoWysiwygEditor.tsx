"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import { useEffect, useMemo } from 'react';
import styles from './MemoWysiwygEditor.module.css';

interface MemoWysiwygEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onSave: () => void;
}

const MemoWysiwygEditor = ({
  content,
  onContentChange,
  onSave,
}: MemoWysiwygEditorProps) => {
  // TipTapエディタの初期化
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: 'Write your memo here...',
      }),
      Color,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  // コンテンツが外部から更新された場合の処理
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // Define toolbar items with explicit callbacks
  const toolbarItems = useMemo(
    () => [
      {
        icon: <strong>B</strong>,
        format: 'bold',
        title: 'Bold',
        action: () => editor?.chain().focus().toggleBold().run(),
      },
      {
        icon: <em>I</em>,
        format: 'italic',
        title: 'Italic',
        action: () => editor?.chain().focus().toggleItalic().run(),
      },
      {
        icon: <u>U</u>,
        format: 'underline',
        title: 'Underline',
        action: () => editor?.chain().focus().toggleUnderline().run(),
      },
      {
        icon: <>• List</>,
        format: 'bulletList',
        title: 'Bullet List',
        action: () => editor?.chain().focus().toggleBulletList().run(),
      },
    ],
    [editor]
  );

  return (
    <div className={styles.memoEditor}>
      <div className={styles.toolbar}>
        {toolbarItems.map(item => (
          <button
            key={item.title}
            onClick={item.action}
            className={`${styles.toolbarButton} ${editor?.isActive(item.format) ? styles.isActive : ''}`}
            title={item.title}
          >
            {item.icon}
          </button>
        ))}
      </div>

      <div className={styles.editorContent}>
        <EditorContent editor={editor} className={styles.editor} />
      </div>

      <div className={styles.editorFooter}>
        <button className={styles.saveButton} onClick={onSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default MemoWysiwygEditor;
