import { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Memo } from '@/types/memo';
import { useResultBadges } from '@/hooks/useResultBadges';
import { useEditorAutoSave } from '@/hooks/useEditorAutoSave';
import styles from './WysiwygEditor.module.css';
import ResultBadgeExtension from './ResultBadgeExtension';
import EditorStats from './EditorStats';

// Constants
const CHARACTER_LIMIT = 5000;
const DEFAULT_STORAGE_KEY = 'wysiwyg-editor-content';
const DEFAULT_PLACEHOLDER = 'Write your game notes here...';

// propsの型定義
interface WysiwygEditorProps {
  storageKey?: string;
  placeholder?: string;
  fullScreen?: boolean;
}

/**
 * TipTapを使ったリッチテキストエディターコンポーネント
 * 勝敗を記録しながらゲームメモを書くための機能を提供
 */
const WysiwygEditor = ({
  storageKey = DEFAULT_STORAGE_KEY,
  placeholder = DEFAULT_PLACEHOLDER,
  fullScreen = false,
}: WysiwygEditorProps) => {
  // カスタムフックを使用して勝敗バッジ関連のロジックを分離
  const { memoStats, updateMemoStats, insertBadge } = useResultBadges();

  // エディタの自動保存ロジックをカスタムフックに分離
  const {
    isOverLimit,
    isClient,
    handleEditorUpdate,
    loadSavedContent
  } = useEditorAutoSave({
    storageKey,
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
        placeholder, // propsから受け取ったplaceholderを使用
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

  // コンテナスタイルに全画面表示のクラスを条件付きで追加
  const containerClassName = `${styles.container} ${fullScreen ? styles.fullScreen : ''}`;

  return (
    <div className={containerClassName}>
      <div className={styles.zenEditor}>
        <div className={styles.floatingControls}>
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
};

export default WysiwygEditor;
