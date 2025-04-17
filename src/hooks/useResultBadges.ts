// src/hooks/useResultBadges.ts
import { useState, useCallback } from "react";
import { Editor } from "@tiptap/react";
import { Memo } from "@/types/memo";

/**
 * エディター内のWIN/LOSEバッジを管理するカスタムフック
 */
export const useResultBadges = () => {
  const [memoStats, setMemoStats] = useState<Memo[]>([]);

  /**
   * エディタ内のWIN/LOSEバッジをカウントする関数
   */
  const countResultBadges = (editor: Editor | null) => {
    if (!editor) return { win: 0, lose: 0 };

    let winCount = 0;
    let loseCount = 0;
    editor.state.doc.descendants((node) => {
      if (node.type.name === "resultBadge") {
        if (node.attrs.result === "WIN") {
          winCount++;
        } else {
          loseCount++;
        }
      }
      return true;
    });
    return { win: winCount, lose: loseCount };
  };

  /**
   * 勝敗カウントからMemo配列を生成する関数
   */
  const generateMemoStats = (resultCounts: { win: number; lose: number }) => {
    const winMemos = Array.from({ length: resultCounts.win }, (_, i) => ({
      id: `win-${i}`,
      title: "Game",
      result: "WIN" as const,
      rating: 3,
      memo: "",
      createdAt: new Date().toISOString(),
    }));

    const loseMemos = Array.from({ length: resultCounts.lose }, (_, i) => ({
      id: `lose-${i}`,
      title: "Game",
      result: "LOSE" as const,
      rating: 3,
      memo: "",
      createdAt: new Date().toISOString(),
    }));

    return [...winMemos, ...loseMemos];
  };

  /**
   * エディタの状態が更新されたときに勝敗統計も更新する
   */
  const updateMemoStats = useCallback((editor: Editor | null) => {
    if (editor) {
      const resultCounts = countResultBadges(editor);
      setMemoStats(generateMemoStats(resultCounts));
    }
  }, []);

  /**
   * 勝敗バッジを挿入するハンドラー
   */
  const insertBadge = useCallback(
    (editor: Editor | null, result: Memo["result"], isOverLimit = false) => {
      if (!editor || isOverLimit) return;

      editor
        .chain()
        .focus()
        .insertContent({ type: "resultBadge", attrs: { result } })
        .run();

      // カーソルを末尾に移動して入力を継続できるようにする
      editor.chain().focus().run();
    },
    []
  );

  return {
    memoStats,
    countResultBadges,
    updateMemoStats,
    insertBadge,
  };
};
