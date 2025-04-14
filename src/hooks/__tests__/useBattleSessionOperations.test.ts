// モジュールのモック
jest.mock("next-auth/react");
jest.mock("@/lib/services/battleSessionService");
jest.mock("@/contexts/AuthContext");

import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/contexts/AuthContext";
import { Timestamp } from "firebase/firestore";
import {
  createBattleSession,
  getBattleSessions,
  updateBattleSession,
  deleteBattleSession,
} from "@/lib/services/battleSessionService";
import { useBattleSessionOperations } from "../useBattleSessionOperations";
import { BattleSession } from "@/types/battleSession";
import { BattleSessionError } from "@/lib/errors/CustomError";
import { ErrorCode } from "@/lib/errors/types";

// モックサービスの設定
const mockServices = {
  getBattleSessions: getBattleSessions as jest.MockedFunction<
    typeof getBattleSessions
  >,
  createBattleSession: createBattleSession as jest.MockedFunction<
    typeof createBattleSession
  >,
  updateBattleSession: updateBattleSession as jest.MockedFunction<
    typeof updateBattleSession
  >,
  deleteBattleSession: deleteBattleSession as jest.MockedFunction<
    typeof deleteBattleSession
  >,
};

describe("useBattleSessionOperations", () => {
  // テスト用のモックデータ
  const mockTimestamp = Timestamp.fromDate(new Date("2024-01-01"));
  const mockSessions: BattleSession[] = [
    {
      id: "1",
      userId: "test-uid",
      title: "Test Session 1",
      memos: [],
      updatedAt: mockTimestamp,
    },
  ];

  const mockState = {
    sessions: [],
    isLoading: false,
    error: null,
    setSessions: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    resetState: jest.fn(),
  };

  // テスト前の共通設定
  beforeEach(() => {
    jest.clearAllMocks();

    // 認証済みユーザーの設定
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "test-uid" },
      loading: false,
    });

    // サービス関数のモック設定
    mockServices.getBattleSessions.mockResolvedValue({
      sessions: mockSessions,
    });
    mockServices.createBattleSession.mockResolvedValue("new-session-id");
    mockServices.updateBattleSession.mockResolvedValue(undefined);
    mockServices.deleteBattleSession.mockResolvedValue(undefined);
  });

  // 1. セッション取得のテスト
  describe("fetchSessions", () => {
    it("認証済みユーザーはセッション一覧を取得できる", async () => {
      const { result } = renderHook(() =>
        useBattleSessionOperations({ state: mockState })
      );

      await act(async () => {
        const success = await result.current.fetchSessions();
        expect(success).toBe(true);
      });
      expect(mockServices.getBattleSessions).toHaveBeenCalledWith("test-uid");
      expect(mockState.setSessions).toHaveBeenCalledWith(mockSessions);
      expect(mockState.setLoading).toHaveBeenCalledTimes(2);
      expect(mockState.setError).toHaveBeenCalledWith(null);
    });

    it("未認証ユーザーはセッション一覧を取得できない", async () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false,
      });

      const { result } = renderHook(() =>
        useBattleSessionOperations({ state: mockState })
      );

      await act(async () => {
        const success = await result.current.fetchSessions();
        expect(success).toBe(false);
      });
      expect(mockState.setSessions).toHaveBeenCalledWith([]);
      expect(mockServices.getBattleSessions).not.toHaveBeenCalled();
    });

    it("APIエラーが発生した場合はエラー状態になる", async () => {
      const testError = new Error("API error");
      mockServices.getBattleSessions.mockRejectedValueOnce(testError);

      const { result } = renderHook(() =>
        useBattleSessionOperations({ state: mockState })
      );

      await act(async () => {
        const success = await result.current.fetchSessions();
        expect(success).toBe(false);
      });
      expect(mockState.setError).toHaveBeenCalledWith(testError);
    });
  });

  // 2. セッション作成のテスト
  describe("createSession", () => {
    it("認証済みユーザーは新しいセッションを作成できる", async () => {
      const { result } = renderHook(() =>
        useBattleSessionOperations({ state: mockState })
      );

      const testData = { title: "New Session" };

      await act(async () => {
        const sessionId = await result.current.createSession(testData);
        expect(sessionId).toBe("new-session-id");
      });

      expect(mockServices.createBattleSession).toHaveBeenCalledWith({
        userId: "test-uid",
        title: "New Session",
        memos: [],
      });
      expect(mockState.setError).toHaveBeenCalledWith(null);
    });

    it("未認証ユーザーはセッションを作成できない", async () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false,
      });

      const { result } = renderHook(() =>
        useBattleSessionOperations({ state: mockState })
      );

      await expect(
        result.current.createSession({ title: "New Session" })
      ).rejects.toThrow(BattleSessionError);

      expect(mockServices.createBattleSession).not.toHaveBeenCalled();
    });
  });

  // 3. セッション更新のテスト
  describe("updateSession", () => {
    it("認証済みユーザーはセッションを更新できる", async () => {
      const { result } = renderHook(() =>
        useBattleSessionOperations({ state: mockState })
      );

      await act(async () => {
        await result.current.updateSession("1", "Updated Session");
      });

      expect(mockServices.updateBattleSession).toHaveBeenCalledWith("1", {
        title: "Updated Session",
        memos: [],
      });
      expect(mockState.setError).toHaveBeenCalledWith(null);
    });
  });

  // 4. セッション削除のテスト
  describe("deleteSession", () => {
    it("認証済みユーザーはセッションを削除できる", async () => {
      const { result } = renderHook(() =>
        useBattleSessionOperations({ state: mockState })
      );

      await act(async () => {
        await result.current.deleteSession("1");
      });

      expect(mockServices.deleteBattleSession).toHaveBeenCalledWith("1");
      expect(mockState.setError).toHaveBeenCalledWith(null);
    });
  });

  // 5. 未認証ユーザーのテスト（複数操作をまとめてテスト）
  describe("未認証ユーザー", () => {
    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false,
      });
    });

    it("未認証ユーザーは各操作でエラーを投げる", async () => {
      const { result } = renderHook(() =>
        useBattleSessionOperations({ state: mockState })
      );

      // 各操作でエラーを投げることをテスト
      await expect(
        result.current.createSession({ title: "New Session" })
      ).rejects.toThrow(BattleSessionError);
      await expect(
        result.current.updateSession("1", "Updated Session")
      ).rejects.toThrow(BattleSessionError);
      await expect(result.current.deleteSession("1")).rejects.toThrow(
        BattleSessionError
      );

      // エラーコードが正しいことを確認
      try {
        await result.current.createSession({ title: "New Session" });
      } catch (e) {
        expect((e as BattleSessionError).code).toBe(ErrorCode.UNAUTHORIZED);
      }
    });
  });
});
