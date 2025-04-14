import { renderHook, act } from "@testing-library/react";
import { useSessionMemos } from "../useSessionMemos";
import { db } from "@/lib/firebase/config";

// Firestoreのモック設定
jest.mock("@/lib/firebase/config", () => ({
  db: {},
}));

// Firestore関数のモック
const mockFirestore = {
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(),
};

jest.mock("firebase/firestore", () => ({
  collection: (...args: unknown[]) => mockFirestore.collection(...args),
  query: (...args: unknown[]) => mockFirestore.query(...args),
  orderBy: (...args: unknown[]) => mockFirestore.orderBy(...args),
  onSnapshot: (...args: unknown[]) => mockFirestore.onSnapshot(...args),
}));

describe("useSessionMemos", () => {
  const mockMemos = [
    { id: "1", content: "test1", createdAt: new Date() },
    { id: "2", content: "test2", createdAt: new Date() },
  ];

  // モックドキュメントの生成を補助する関数
  const createMockSnapshot = (memos: typeof mockMemos) => ({
    docs: memos.map((memo) => ({
      data: () => memo,
      id: memo.id,
    })),
    size: memos.length,
    docChanges: () => [],
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("空のsessionIdの場合、空の配列を返す", () => {
    const { result } = renderHook(() => useSessionMemos(""));

    expect(result.current.memos).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.memosCount).toBe(0);
    expect(mockFirestore.onSnapshot).not.toHaveBeenCalled();
  });

  it("セッションからメモのリストを取得できる", async () => {
    mockFirestore.onSnapshot.mockImplementation((_, callback) => {
      callback(createMockSnapshot(mockMemos));
      return () => {};
    });

    const { result } = renderHook(() => useSessionMemos("test-session"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.memos).toEqual(mockMemos);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.memosCount).toBe(2);
    expect(mockFirestore.collection).toHaveBeenCalledWith(
      db,
      "battleSessions",
      "test-session",
      "memos"
    );
  });

  it("Firestoreエラー時にエラー状態を設定する", async () => {
    const testError = new Error("Firestore error");
    mockFirestore.onSnapshot.mockImplementation((_, __, onError) => {
      onError(testError);
      return () => {};
    });

    const { result } = renderHook(() => useSessionMemos("test-session"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.memos).toEqual([]);
    expect(result.current.error).toBe(testError);
  });

  it("アンマウントとセッションID変更時にリスナーをクリーンアップする", () => {
    const unsubscribe = jest.fn();
    mockFirestore.onSnapshot.mockReturnValue(unsubscribe);

    // アンマウントのテスト
    const { unmount, rerender } = renderHook(
      ({ sessionId }) => useSessionMemos(sessionId),
      {
        initialProps: { sessionId: "session1" },
      }
    );

    // セッションIDの変更テスト
    rerender({ sessionId: "session2" });
    expect(unsubscribe).toHaveBeenCalled();
    expect(mockFirestore.collection).toHaveBeenCalledTimes(2);

    // アンマウント
    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});
