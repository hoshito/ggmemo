import { Memo, MemoFormData } from "@/types/memo";
import { IStorage } from "../storage/types";

const MEMOS_STORAGE_KEY = "memos" as const;

/**
 * メモ操作に関する関数群を提供するファクトリ関数
 */
export const createMemoService = (storage: IStorage) => ({
  /**
   * すべてのメモを取得
   */
  async getMemos(): Promise<Memo[]> {
    const memos = await storage.getItem<Memo[]>(MEMOS_STORAGE_KEY);
    return memos || [];
  },

  /**
   * 新しいメモを追加
   */
  async addMemo(data: MemoFormData): Promise<Memo> {
    const memos = await this.getMemos();

    const newMemo: Memo = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const updatedMemos = [newMemo, ...memos];
    await storage.setItem(MEMOS_STORAGE_KEY, updatedMemos);

    return newMemo;
  },

  /**
   * メモを更新
   */
  async updateMemo(id: string, data: MemoFormData): Promise<void> {
    const memos = await this.getMemos();
    const index = memos.findIndex((memo) => memo.id === id);

    if (index === -1) {
      throw new Error(`Memo with id ${id} not found`);
    }

    const updatedMemos = [...memos];
    updatedMemos[index] = {
      ...data,
      id,
      createdAt: memos[index].createdAt,
    };

    await storage.setItem(MEMOS_STORAGE_KEY, updatedMemos);
  },

  /**
   * メモを削除
   */
  async deleteMemo(id: string): Promise<void> {
    const memos = await this.getMemos();
    const updatedMemos = memos.filter((memo) => memo.id !== id);
    await storage.setItem(MEMOS_STORAGE_KEY, updatedMemos);
  },

  /**
   * すべてのメモを削除
   */
  async deleteAllMemos(): Promise<void> {
    await storage.setItem(MEMOS_STORAGE_KEY, []);
  },

  /**
   * メモの総数を取得
   */
  async getTotalMemos(): Promise<number> {
    const memos = await this.getMemos();
    return memos.length;
  },
});

export type MemoService = ReturnType<typeof createMemoService>;
