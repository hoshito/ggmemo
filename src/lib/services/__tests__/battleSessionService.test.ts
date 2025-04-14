import {
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  createBattleSession,
  deleteBattleSession,
  updateBattleSession,
} from "../battleSessionService";
import { CreateBattleSessionData } from "@/types/battleSession";
import { ErrorCode } from "@/lib/errors/types";
import { setupTest } from "@/lib/__tests__/helpers";

// モックを明示的に設定
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  Timestamp: {
    now: jest.fn().mockReturnValue(new Date("2024-01-01T00:00:00Z")),
  },
}));

jest.mock("../../firebase/config", () => ({
  db: {},
}));

jest.mock("../memoFirestoreService", () => ({
  deleteAllMemos: jest.fn().mockResolvedValue(undefined),
}));

describe("battleSessionService", () => {
  const mockUserId = "user123";
  const mockSessionId = "session123";
  let cleanup: () => void;

  beforeEach(() => {
    // 共通のテストセットアップ
    const testSetup = setupTest();
    cleanup = testSetup.cleanup;

    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("createBattleSession", () => {
    beforeEach(() => {
      // セッション数制限のチェックのためのモック
      getDocs.mockResolvedValue({
        docs: [],
      });
      query.mockReturnValue({});
      where.mockReturnValue({});
      orderBy.mockReturnValue({});
    });

    it("バトルセッションを作成できること", async () => {
      // Arrange
      const mockCreateData: CreateBattleSessionData = {
        userId: mockUserId,
        title: "Test Session",
        memos: [],
      };

      const docRef = { id: mockSessionId };
      collection.mockReturnValue({});
      doc.mockReturnValue(docRef);
      setDoc.mockResolvedValue(undefined);

      // Act
      const result = await createBattleSession(mockCreateData);

      // Assert
      expect(collection).toHaveBeenCalledWith(db, "battleSessions");
      expect(setDoc).toHaveBeenCalledWith(docRef, {
        ...mockCreateData,
        id: mockSessionId,
        updatedAt: expect.any(Object),
      });
      expect(result).toBe(mockSessionId);
    });

    it("タイトルが100文字を超える場合はエラーを投げること", async () => {
      // Arrange
      const longTitle = "a".repeat(101);
      const mockCreateData: CreateBattleSessionData = {
        userId: mockUserId,
        title: longTitle,
        memos: [],
      };

      // Act & Assert
      await expect(createBattleSession(mockCreateData)).rejects.toMatchObject({
        code: ErrorCode.SESSION_TITLE_TOO_LONG,
      });

      expect(setDoc).not.toHaveBeenCalled();
    });
  });

  describe("updateBattleSession", () => {
    it("タイトルが100文字を超える場合はエラーを投げること", async () => {
      // Arrange
      const longTitle = "a".repeat(101); // 101文字のタイトル
      const sessionId = "test-session-id";

      // Act & Assert
      await expect(
        updateBattleSession(sessionId, { title: longTitle })
      ).rejects.toMatchObject({
        code: ErrorCode.SESSION_TITLE_TOO_LONG,
      });

      expect(updateDoc).not.toHaveBeenCalled();
    });

    it("タイトルが100文字の場合は更新できること", async () => {
      // Arrange
      const title100chars = "a".repeat(100);
      const sessionId = "test-session-id";
      const docRef = {};

      doc.mockReturnValue(docRef);
      updateDoc.mockResolvedValue(undefined);

      // Act
      await updateBattleSession(sessionId, { title: title100chars });

      // Assert
      expect(doc).toHaveBeenCalledWith(db, "battleSessions", sessionId);
      expect(updateDoc).toHaveBeenCalledWith(docRef, {
        title: title100chars,
        updatedAt: expect.any(Object),
      });
    });

    it("タイトルが含まれていない場合は更新できること", async () => {
      // Arrange
      const sessionId = "test-session-id";
      const docRef = {};

      doc.mockReturnValue(docRef);
      updateDoc.mockResolvedValue(undefined);

      // Act
      await updateBattleSession(sessionId, { memos: [] });

      // Assert
      expect(doc).toHaveBeenCalledWith(db, "battleSessions", sessionId);
      expect(updateDoc).toHaveBeenCalledWith(docRef, {
        memos: [],
        updatedAt: expect.any(Object),
      });
    });
  });

  describe("deleteBattleSession", () => {
    it("バトルセッションを削除できること", async () => {
      // Arrange
      const docRef = { id: mockSessionId };
      doc.mockReturnValue(docRef);

      // Act
      await deleteBattleSession(mockSessionId);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, "battleSessions", mockSessionId);
      expect(deleteDoc).toHaveBeenCalledWith(docRef);
    });
  });
});
