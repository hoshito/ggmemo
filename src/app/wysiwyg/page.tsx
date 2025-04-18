"use client";

import { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Memo } from '@/types/memo';
import { useResultBadges } from '@/hooks/useResultBadges';
import { useEditorAutoSave } from '@/hooks/useEditorAutoSave';
import styles from './page.module.css';
import ResultBadgeExtension from '@/components/WysiwygEditor/ResultBadgeView/ResultBadgeExtension';
import EditorStats from '@/components/WysiwygEditor/EditorStats';
import WysiwygResultButton from '@/components/WysiwygEditor/ResultButton';

// Constants
const CHARACTER_LIMIT = 5000;
const STORAGE_KEY = 'wysiwyg-editor-content';
const EDITOR_PLACEHOLDER = 'Write your game notes here...';

/**
 * WYSIWYGエディター（What You See Is What You Get）のページ
 * リッチテキストエディターでゲームのメモを記録できる
 */
export default function WysiwygPage() {
  // カスタムフックを使用して勝敗バッジ関連のロジックを分離
  const { memoStats, updateMemoStats, insertBadge } = useResultBadges();

  // エディタの自動保存ロジックをカスタムフックに分離
  const {
    isOverLimit,
    isClient,
    handleEditorUpdate,
    loadSavedContent
  } = useEditorAutoSave({
    storageKey: STORAGE_KEY,
    debounceTime: 500,
    characterLimit: CHARACTER_LIMIT,
  });

  // エディタの初期化
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: EDITOR_PLACEHOLDER,
      }),
      ResultBadgeExtension,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      // エディタ更新時のハンドラーを呼び出し
      handleEditorUpdate(editor);

      // 勝敗統計を更新
      updateMemoStats(editor);
    },
    immediatelyRender: false, // SSRのハイドレーションミスマッチを防ぐ
  });

  // localStorageから保存された内容を読み込む
  useEffect(() => {
    // エディタの内容をロード
    loadSavedContent(editor);

    // エディタのロード完了後に勝敗カウントを更新
    if (editor && isClient) {
      updateMemoStats(editor);
    }
  }, [editor, isClient, loadSavedContent, updateMemoStats]);

  // WIN/LOSEを挿入するハンドラー
  const handleInsertBadge = useCallback((result: Memo['result']) => {
    insertBadge(editor, result, isOverLimit);
  }, [editor, isOverLimit, insertBadge]);

  return (
    <div className={`${styles.container} ${styles.editorPage}`}>
      <div className={styles.editorContainer}>
        <div className={styles.floatingControls}>
          <WysiwygResultButton
            onInsertBadge={handleInsertBadge}
            isDisabled={isOverLimit}
          />
        </div>

        <div className={styles.editorContent}>
          <EditorContent editor={editor} />
        </div>

        {/* 統計情報表示 */}
        <EditorStats memoStats={memoStats} />

        {/* 文字数制限を超えた場合の警告 */}
        {isOverLimit && (
          <div className={styles.limitWarning}>
            Character limit reached! You cannot add more content.
          </div>
        )}
      </div>
    </div>
  );
}
