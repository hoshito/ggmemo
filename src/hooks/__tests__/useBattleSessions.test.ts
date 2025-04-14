// モジュールのモック
jest.mock("firebase/app");
jest.mock("firebase/auth");
jest.mock("firebase/firestore");
jest.mock("next-auth/react");
jest.mock("@/lib/services/battleSessionService");

import { renderHook, act } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { Timestamp } from "firebase/firestore";
import { useBattleSessions } from "../useBattleSessions";
import { ErrorCode } from "@/lib/errors/types";
import { BattleSessionError } from "@/lib/errors/CustomError";
import {
  createBattleSession,
  getBattleSessions,
} from "@/lib/services/battleSessionService";
import { waitForNextTick } from "@/lib/__tests__/helpers";

// テスト用のモックデータ
const mockSession = {
  data: {
    user: { email: "test@example.com" },
    firebaseUid: "test-uid",
  },
  status: "authenticated",
};

const mockTimestamp = Timestamp.fromDate(new Date("2024-01-01"));
const mockBattleSessions = [
  {
    id: "1",
    userId: "test-uid",
    title: "Test Session 1",
    memos: [],
    createdAt: mockTimestamp,
    updatedAt: mockTimestamp,
  },
];

describe("useBattleSessions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue(mockSession);
    (getBattleSessions as jest.Mock).mockResolvedValue({
      sessions: mockBattleSessions,
    });
  });

  it.skip("サインイン状態ではセッション一覧を取得する", async () => {
    // Arrange
    const { result } = renderHook(() => useBattleSessions());

    // Act
    await act(async () => {
      await waitForNextTick();
    });

    // Assert
    expect(result.current.sessions).toEqual(mockBattleSessions);
  });

  it("非サインイン状態では空の配列を返す", async () => {
    // Arrange
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    // Act
    const { result } = renderHook(() => useBattleSessions());
    await act(async () => {
      await waitForNextTick();
    });

    // Assert
    expect(result.current.sessions).toEqual([]);
  });

  it.skip("セッションを新規作成できる", async () => {
    // Arrange
    const { result } = renderHook(() => useBattleSessions());
    const newSessionId = "new-session-id";
    (createBattleSession as jest.Mock).mockResolvedValue(newSessionId);

    // Act & Assert
    await act(async () => {
      const id = await result.current.createSession({
        title: "New Session",
        memos: [],
      });
      expect(id).toBe(newSessionId);
    });
  });

  it("非サインイン状態での操作はエラーになる", async () => {
    // Arrange
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });
    const { result } = renderHook(() => useBattleSessions());

    // Act & Assert
    await expect(
      result.current.createSession({
        title: "New Session",
        memos: [],
      })
    ).rejects.toThrow(BattleSessionError);
  });

  it("セッション作成失敗時は適切なエラーを投げる", async () => {
    // Arrange
    const { result } = renderHook(() => useBattleSessions());
    const createError = new BattleSessionError(
      ErrorCode.SESSION_CREATE_FAILED,
      "Failed to create session"
    );
    (createBattleSession as jest.Mock).mockRejectedValue(createError);

    // Act & Assert
    await expect(
      result.current.createSession({
        title: "New Session",
        memos: [],
      })
    ).rejects.toThrow(BattleSessionError);
  });
});
