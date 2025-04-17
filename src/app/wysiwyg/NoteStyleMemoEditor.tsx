"use client";

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useEffect, useMemo } from 'react';
import styles from './NoteStyleMemoEditor.module.css';
import { Memo } from '@/types/memo';
import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ResultBadgeView from './ResultBadgeView';

// WIN/LOSEボタンのための拡張
const ResultBadge = Node.create({
  name: 'resultBadge',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      result: {
        default: 'WIN',
        parseHTML: element => element.getAttribute('data-result'),
        renderHTML: attributes => {
          return {
            'data-result': attributes.result,
            'data-type': 'result-badge',
          }
        }
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="result-badge"]',
        getAttrs: element => {
          if (typeof element === 'string') {
            return false;
          }
          return {
            result: element.getAttribute('data-result') || 'WIN',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', { 'data-type': 'result-badge', ...HTMLAttributes }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResultBadgeView);
  },
});

// エディタ内のWIN/LOSEバッジをカウントする関数
const countResultBadges = (editor: Editor | null) => {
  if (!editor) return { win: 0, lose: 0 };

  let winCount = 0;
  let loseCount = 0;
  editor.state.doc.descendants(node => {
    if (node.type.name === 'resultBadge') {
      if (node.attrs.result === 'WIN') {
        winCount++;
      } else {
        loseCount++;
      }
    }
    return true;
  });
  return { win: winCount, lose: loseCount };
};

interface NoteStyleMemoEditorProps {
  content: string;
  onUpdate: (content: string, resultCounts: { win: number; lose: number }) => void;
}

const NoteStyleMemoEditor = ({ content, onUpdate }: NoteStyleMemoEditorProps) => {

  // TipTapエディタの初期化
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Write your game notes here...',
      }),
      ResultBadge,
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML(), countResultBadges(editor));
    },
    editorProps: {
      attributes: {
        class: styles.textEditor,
      },
    },
  });

  // エディタインスタンスの参照を更新
  useEffect(() => {
    if (editor) {
      // 初期ロード時にも結果をカウントして親に通知
      onUpdate(editor.getHTML(), countResultBadges(editor));
    }
  }, [editor, onUpdate]);

  // コンテンツが外部から更新された場合の処理
  useEffect(() => {
    if (editor && content) {
      // エディタが現在編集中でない場合のみコンテンツを更新
      if (!editor.isFocused) {
        editor.commands.setContent(content, false);
        onUpdate(editor.getHTML(), countResultBadges(editor));
      }
    }
  }, [editor, content, onUpdate]);

  // WIN/LOSEを挿入するハンドラー
  const handleInsertBadge = useCallback((result: Memo['result']) => {
    editor?.chain().focus().insertContent({ type: 'resultBadge', attrs: { result } }).run();
  }, [editor]);

  // テキストフォーマット用のボタン定義
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
        icon: <>H</>,
        format: 'heading',
        title: 'Heading',
        action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      },
    ],
    [editor]
  );

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          {(['WIN', 'LOSE'] as Memo['result'][]).map(status => (
            <button key={status} onClick={() => handleInsertBadge(status)} className={status === 'WIN' ? styles.winButton : styles.loseButton} title={`Insert ${status}`}>
              {status}
            </button>
          ))}
        </div>

        <div className={styles.toolbarDivider}></div>

        <div className={styles.toolbarGroup}>
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
      </div>

      <div className={styles.editorContent}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default NoteStyleMemoEditor;
