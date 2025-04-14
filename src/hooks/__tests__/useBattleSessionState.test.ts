import { renderHook, act } from "@testing-library/react";
import { useBattleSessionState } from "../useBattleSessionState";
import { BattleSession } from "@/types/battleSession";
import { Timestamp } from "firebase/firestore";

describe("useBattleSessionState", () => {
  const mockTimestamp = Timestamp.fromDate(new Date("2024-01-01"));
  const mockSessions: BattleSession[] = [
    {
      id: "1",
      userId: "test@example.com",
      title: "Test Session 1",
      memos: [],
      updatedAt: mockTimestamp,
    },
  ];

  it("初期状態が正しく設定される", () => {
    const { result } = renderHook(() => useBattleSessionState());

    expect(result.current.sessions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("状態を更新および初期化できる", () => {
    const { result } = renderHook(() => useBattleSessionState());
    const mockError = new Error("Test error");

    // 各状態を更新
    act(() => {
      result.current.setSessions(mockSessions);
      result.current.setLoading(true);
      result.current.setError(mockError);
    });

    // 更新された状態を確認
    expect(result.current.sessions).toEqual(mockSessions);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(mockError);

    // 状態をリセット
    act(() => {
      result.current.resetState();
    });

    // 初期状態に戻っていることを確認
    expect(result.current.sessions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
