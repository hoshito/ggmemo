"use client";

import { useCallback, useState } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import styles from "./page.module.css";
import { Memo } from "@/types/memo";

// ResultBadgeViewコンポーネントの修正版 - NodeViewWrapperを使用
const ResultBadgeView = ({ node }) => {
  const result = node.attrs.result;

  return (
    <NodeViewWrapper>
      <span className={styles[result === 'WIN' ? 'winBadge' : 'loseBadge']}>
        {result}
      </span>
    </NodeViewWrapper>
  );
};

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
const countResultBadges = (editor) => {
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

export default function WysiwygPage() {
  const [memoStats, setMemoStats] = useState<Memo[]>([]);

  // エディタの初期化
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
    content: '<p>Write your game notes here...</p>',
    onUpdate: ({ editor }) => {
      const resultCounts = countResultBadges(editor);

      // Generate memo stats using functional array creation
      const winMemos = Array.from({ length: resultCounts.win }, (_, i) => ({
        id: `win-${i}`,
        title: 'Game',
        result: 'WIN' as const,
        memo: '',
        createdAt: new Date().toISOString(),
      }));
      const loseMemos = Array.from({ length: resultCounts.lose }, (_, i) => ({
        id: `lose-${i}`,
        title: 'Game',
        result: 'LOSE' as const,
        memo: '',
        createdAt: new Date().toISOString(),
      }));
      setMemoStats([...winMemos, ...loseMemos]);
    },
  });

  // WIN/LOSEを挿入するハンドラー
  const handleInsertBadge = useCallback((result: Memo['result']) => {
    editor?.chain().focus().insertContent({ type: 'resultBadge', attrs: { result } }).run();
  }, [editor]);

  return (
    <div className={styles.container}>
      <div className={styles.zenEditor}>
        <div className={styles.floatingControls}>
          {/* 入力用ボタングループのみ残す */}
          <div className={styles.controlsGroup}>
            <button
              className={styles.inputButton}
              onClick={() => handleInsertBadge('WIN')}
              title="Insert WIN"
            >
              WIN
            </button>
            <button
              className={styles.inputButton}
              onClick={() => handleInsertBadge('LOSE')}
              title="Insert LOSE"
            >
              LOSE
            </button>
          </div>
        </div>

        <div className={styles.editorContent}>
          <EditorContent editor={editor} />
        </div>

        {/* 統計情報は常に表示するため条件式を削除 */}
        <div className={styles.statsOverlay}>
          <div className={styles.statsCard}>
            <h3>Game Stats</h3>
            <div className={styles.statsFlex}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Wins:</span>
                <span className={styles.statValue}>{memoStats.filter(memo => memo.result === 'WIN').length}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Losses:</span>
                <span className={styles.statValue}>{memoStats.filter(memo => memo.result === 'LOSE').length}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Win Rate:</span>
                <span className={styles.statValue}>
                  {memoStats.length
                    ? `${Math.round((memoStats.filter(memo => memo.result === 'WIN').length / memoStats.length) * 100)}%`
                    : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
