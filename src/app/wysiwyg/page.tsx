"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import Link from 'next/link';
import styles from "./page.module.css";
import { Memo } from "@/types/memo";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// localStorageのキー
const EDITOR_CONTENT_KEY = 'wysiwyg-editor-content';
// 文字数制限（5000文字）
const CHARACTER_LIMIT = 5000;
// 保存のデバウンス時間（ミリ秒）
const SAVE_DEBOUNCE_TIME = 500;

// ResultBadgeViewコンポーネントの修正版 - NodeViewWrapperを使用
const ResultBadgeView = ({ node }) => {
  const result = node.attrs.result;

  return (
    <NodeViewWrapper as="span" className="inline-node-view-wrapper">
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
  // atom: trueを削除して通常のインライン要素として扱う
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

// エディタの文字数をカウントする関数
const countCharacters = (editor) => {
  return editor?.state.doc.textContent.length || 0;
};

export default function WysiwygPage() {
  const [memoStats, setMemoStats] = useState<Memo[]>([]);
  const [savedContent, setSavedContent, isClient] = useLocalStorage<string>(EDITOR_CONTENT_KEY, '');
  const [isOverLimit, setIsOverLimit] = useState(false);
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(false); // 統計情報の折りたたみ状態
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef<string>('');

  // エディタの内容を保存する関数（デバウンス処理付き）
  const saveContent = useCallback((content: string) => {
    // 最後に保存した内容と同じなら保存しない
    if (content === lastSavedContentRef.current) return;

    // 既存のタイマーがあればクリア
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // 新しいタイマーをセット
    saveTimerRef.current = setTimeout(() => {
      setSavedContent(content);
      lastSavedContentRef.current = content;
    }, SAVE_DEBOUNCE_TIME);
  }, [setSavedContent]);

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
    content: '',
    onUpdate: ({ editor }) => {
      const resultCounts = countResultBadges(editor);
      const currentCharCount = countCharacters(editor);

      // 文字数制限の確認
      setIsOverLimit(currentCharCount > CHARACTER_LIMIT);

      // 文字数制限を超えていなければlocalStorageに保存
      if (currentCharCount <= CHARACTER_LIMIT) {
        const content = editor.getHTML();
        saveContent(content);
      }

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

  // localStorageから保存された内容を読み込む
  useEffect(() => {
    if (editor && isClient && savedContent) {
      editor.commands.setContent(savedContent);
      lastSavedContentRef.current = savedContent;

      // 読み込み後の文字数制限を確認
      const currentCharCount = countCharacters(editor);
      setIsOverLimit(currentCharCount > CHARACTER_LIMIT);

      // 読み込み完了後に勝敗カウントを更新
      const resultCounts = countResultBadges(editor);
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
    }
  }, [editor, isClient, savedContent]);

  // コンポーネントがアンマウントされるときにタイマーをクリアする
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  // WIN/LOSEを挿入するハンドラー - スペースを追加して継続して入力できるように
  const handleInsertBadge = useCallback((result: Memo['result']) => {
    // 文字数制限を超えていたら挿入しない
    if (isOverLimit) {
      return;
    }

    editor?.chain().focus().insertContent({ type: 'resultBadge', attrs: { result } }).run();
    // カーソルを末尾に移動して入力を継続できるようにする
    editor?.chain().focus().run();
  }, [editor, isOverLimit]);

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
              disabled={isOverLimit}
            >
              WIN
            </button>
            <button
              className={styles.inputButton}
              onClick={() => handleInsertBadge('LOSE')}
              title="Insert LOSE"
              disabled={isOverLimit}
            >
              LOSE
            </button>
          </div>
        </div>

        <div className={styles.editorContent}>
          <EditorContent editor={editor} />
        </div>

        {/* 統計情報カードに折りたたみ機能を追加 */}
        <div className={styles.statsOverlay}>
          <div className={`${styles.statsCard} ${isStatsCollapsed ? styles.collapsed : ''}`}>
            <h3 onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}>
              Game Stats
              <span className={`${styles.collapseButton}`}>
                <span className={styles.collapseIcon}>▲</span>
              </span>
            </h3>
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
            {/* ホームへのリンクと著作表記を追加 */}
            <div className={styles.homeLink}>
              <Link href="/" title="Return to Home">← Home</Link>
              <div className={styles.copyright}>© GGMemo</div>
            </div>
          </div>
        </div>

        {/* 文字数制限を超えた場合の警告 - 必要ならこの部分は残す */}
        {isOverLimit && (
          <div className={styles.limitWarning}>
            Character limit reached! You cannot add more content.
          </div>
        )}
      </div>
    </div>
  );
}
