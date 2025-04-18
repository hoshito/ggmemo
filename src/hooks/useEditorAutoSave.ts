import { useRef, useCallback, useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface UseEditorAutoSaveOptions {
  /**
   * エディタの内容を保存するローカルストレージのキー
   */
  storageKey: string;

  /**
   * 保存する前の遅延時間（ミリ秒）
   */
  debounceTime?: number;

  /**
   * 文字数制限
   */
  characterLimit?: number;
}

interface UseEditorAutoSaveResult {
  /**
   * 保存されたコンテンツ
   */
  savedContent: string;

  /**
   * クライアントサイドでレンダリングされているかどうか
   */
  isClient: boolean;

  /**
   * 文字数制限を超えているかどうか
   */
  isOverLimit: boolean;

  /**
   * 初期読み込みが完了したかどうか
   */
  initialLoadDone: boolean;

  /**
   * エディターの更新時に呼び出すハンドラー
   */
  handleEditorUpdate: (editor: Editor | null) => void;

  /**
   * エディターに保存されたコンテンツを読み込む
   */
  loadSavedContent: (editor: Editor | null) => void;

  /**
   * エディターの文字数を取得
   */
  countCharacters: (editor: Editor | null) => number;
}

/**
 * TipTapエディタの内容を自動保存するカスタムフック
 */
export const useEditorAutoSave = ({
  storageKey,
  debounceTime = 500,
  characterLimit = 5000,
}: UseEditorAutoSaveOptions): UseEditorAutoSaveResult => {
  const [savedContent, setSavedContent, isClient] = useLocalStorage<string>(
    storageKey,
    ""
  );
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef<string>("");
  const initialLoadDoneRef = useRef<boolean>(false);
  const [isOverLimit, setIsOverLimit] = useState(false);

  // エディターの内容を保存する関数（デバウンス処理付き）
  const saveContent = useCallback(
    (content: string) => {
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
      }, debounceTime);
    },
    [setSavedContent, debounceTime]
  );

  // エディターの文字数をカウントする関数
  const countCharacters = useCallback((editor: Editor | null) => {
    return editor?.state.doc.textContent.length || 0;
  }, []);

  // エディター更新時のハンドラー
  const handleEditorUpdate = useCallback(
    (editor: Editor | null) => {
      if (!editor) return;

      const currentCharCount = countCharacters(editor);
      setIsOverLimit(currentCharCount > characterLimit);

      // 文字数制限を超えていなければlocalStorageに保存
      if (currentCharCount <= characterLimit) {
        const content = editor.getHTML();
        saveContent(content);
      }
    },
    [countCharacters, characterLimit, saveContent]
  );

  // 保存されたコンテンツをエディターにロードする関数
  const loadSavedContent = useCallback(
    (editor: Editor | null) => {
      if (editor && isClient && savedContent && !initialLoadDoneRef.current) {
        editor.commands.setContent(savedContent);
        lastSavedContentRef.current = savedContent;
        initialLoadDoneRef.current = true;

        // 読み込み後の文字数制限を確認
        const currentCharCount = countCharacters(editor);
        setIsOverLimit(currentCharCount > characterLimit);
      }
    },
    [isClient, savedContent, countCharacters, characterLimit]
  );

  // コンポーネントがアンマウントされるときにタイマーをクリアする
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  return {
    savedContent,
    isClient,
    isOverLimit,
    initialLoadDone: initialLoadDoneRef.current,
    handleEditorUpdate,
    loadSavedContent,
    countCharacters,
  };
};
