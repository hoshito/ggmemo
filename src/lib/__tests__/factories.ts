/**
 * テストデータを生成するためのファクトリー関数
 */
import { Memo, MemoFormData } from "@/types/memo";
import { BattleSession } from "@/types/battleSession";

/**
 * メモデータを作成するファクトリー
 * @param overrides 上書きするプロパティ
 * @returns 作成されたMemoオブジェクト
 */
export const createMemo = (overrides?: Partial<Memo>): Memo => ({
  id: "test-memo-id",
  title: "Test Title",
  result: "WIN",
  rating: 5,
  memo: "Test memo content",
  createdAt: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

/**
 * 複数のメモデータを作成するファクトリー
 * @param count 作成するメモの数
 * @param overridesFn 各メモに対する上書き関数
 * @returns 作成されたMemoオブジェクトの配列
 */
export const createMemos = (
  count: number,
  overridesFn?: (index: number) => Partial<Memo>
): Memo[] => {
  return Array.from({ length: count }, (_, i) => {
    const overrides = overridesFn ? overridesFn(i) : {};
    return createMemo({
      id: `test-memo-id-${i + 1}`,
      title: `Test Title ${i + 1}`,
      memo: `Test memo content ${i + 1}`,
      ...overrides,
    });
  });
};

/**
 * メモフォームデータを作成するファクトリー
 * @param overrides 上書きするプロパティ
 * @returns 作成されたMemoFormDataオブジェクト
 */
export const createMemoFormData = (
  overrides?: Partial<MemoFormData>
): MemoFormData => ({
  title: "Test Title",
  result: "WIN",
  rating: 5,
  memo: "Test memo content",
  ...overrides,
});

/**
 * バトルセッションを作成するファクトリー
 * @param overrides 上書きするプロパティ
 * @returns 作成されたBattleSessionオブジェクト
 */
export const createBattleSession = (
  overrides?: Partial<BattleSession>
): BattleSession => ({
  id: "test-session-id",
  title: "Test Battle Session",
  createdAt: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

/**
 * 複数のバトルセッションを作成するファクトリー
 * @param count 作成するセッションの数
 * @param overridesFn 各セッションに対する上書き関数
 * @returns 作成されたBattleSessionオブジェクトの配列
 */
export const createBattleSessions = (
  count: number,
  overridesFn?: (index: number) => Partial<BattleSession>
): BattleSession[] => {
  return Array.from({ length: count }, (_, i) => {
    const overrides = overridesFn ? overridesFn(i) : {};
    return createBattleSession({
      id: `test-session-id-${i + 1}`,
      title: `Test Battle Session ${i + 1}`,
      ...overrides,
    });
  });
};
