import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  getMemos,
  addMemo,
  updateMemo,
  deleteMemo,
} from "../memoFirestoreService";
import { MemoFormData, MAX_MEMO_LENGTH } from "@/types/memo";
import { ErrorCode } from "../../errors/types";
import { MemoError } from "../../errors/CustomError";
import { setupTest } from "@/lib/__tests__/helpers";

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn().mockReturnValue({}),
  orderBy: jest.fn().mockReturnValue({}),
}));

jest.mock("../../firebase/config", () => ({
  db: {},
}));

describe("memoFirestoreService", () => {
  const mockSessionId = "test-session-id";
  const mockMemoId = "test-memo-id";
  const mockDate = "2024-04-08T02:30:05.000Z";
  let dateMock: jest.SpyInstance;
  let cleanup: () => void;

  beforeEach(() => {
    // 共通のテストセットアップ
    const testSetup = setupTest();
    cleanup = testSetup.cleanup;

    jest.clearAllMocks();
    dateMock = jest
      .spyOn(global.Date.prototype, "toISOString")
      .mockReturnValue(mockDate);
  });

  afterEach(() => {
    dateMock.mockRestore();
    cleanup();
  });

  describe("getMemos", () => {
    it("メモの一覧を取得できる", async () => {
      // Arrange
      const mockMemos = [
        {
          id: "1",
          title: "Test Memo 1",
          memo: "memo1",
          result: "WIN",
          rating: 5,
          createdAt: mockDate,
        },
      ];

      const queryRef = {};
      (query as jest.Mock).mockReturnValue(queryRef);
      (orderBy as jest.Mock).mockReturnValue(queryRef);
      (getDocs as jest.Mock).mockResolvedValue({
        docs: mockMemos.map((memo) => ({
          id: memo.id,
          data: () => ({ ...memo }),
        })),
      });

      // Act
      const result = await getMemos(mockSessionId);

      // Assert
      expect(result).toEqual(mockMemos);
      expect(collection).toHaveBeenCalledWith(
        db,
        "battleSessions",
        mockSessionId,
        "memos"
      );
    });
  });

  describe("addMemo", () => {
    beforeEach(() => {
      (getDocs as jest.Mock).mockResolvedValue({
        docs: [],
      });
    });

    it("メモを追加できる", async () => {
      // Arrange
      const mockMemoData: MemoFormData = {
        title: "Test Memo",
        memo: "test memo content",
        rating: 5,
        result: "WIN",
      };

      (doc as jest.Mock).mockReturnValue({ id: mockMemoId });
      (setDoc as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await addMemo(mockSessionId, mockMemoData);

      // Assert
      const expectedMemo = {
        ...mockMemoData,
        id: mockMemoId,
        createdAt: mockDate,
      };

      expect(result).toEqual(expectedMemo);
      expect(setDoc).toHaveBeenCalled();
    });

    it("メモ数制限を超えた場合にエラーになる", async () => {
      // Arrange
      const mockMemos = Array(100).fill({
        id: "test-id",
        data: () => ({
          title: "Test",
          memo: "content",
          rating: 5,
          result: "WIN",
          createdAt: mockDate,
        }),
      });

      (getDocs as jest.Mock).mockResolvedValue({
        docs: mockMemos,
      });

      const mockMemoData: MemoFormData = {
        title: "Test Memo",
        memo: "test content",
        rating: 5,
        result: "WIN",
      };

      // Act & Assert
      await expect(addMemo(mockSessionId, mockMemoData)).rejects.toThrow(
        MemoError
      );
      await expect(addMemo(mockSessionId, mockMemoData)).rejects.toMatchObject({
        code: ErrorCode.SESSION_LIMIT_EXCEEDED,
      });
      expect(setDoc).not.toHaveBeenCalled();
    });

    it("文字数制限を超えるメモを追加しようとするとエラーになる", async () => {
      // Arrange
      const mockMemoData: MemoFormData = {
        title: "Test Memo",
        memo: "a".repeat(MAX_MEMO_LENGTH + 1),
        rating: 5,
        result: "WIN",
      };

      // Act & Assert
      await expect(addMemo(mockSessionId, mockMemoData)).rejects.toThrow(
        `Memo cannot exceed ${MAX_MEMO_LENGTH} characters`
      );
      expect(setDoc).not.toHaveBeenCalled();
    });
  });

  describe("updateMemo", () => {
    it("メモを更新できる", async () => {
      // Arrange
      const mockMemoData: MemoFormData = {
        title: "Updated Memo",
        memo: "updated memo content",
        rating: 4,
        result: "LOSE",
      };

      (doc as jest.Mock).mockReturnValue({});
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      // Act
      await updateMemo(mockSessionId, mockMemoId, mockMemoData);

      // Assert
      expect(collection).toHaveBeenCalledWith(
        db,
        "battleSessions",
        mockSessionId,
        "memos"
      );
      expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), mockMemoData);
    });

    it("文字数制限を超えるメモを更新しようとするとエラーになる", async () => {
      // Arrange
      const mockMemoData: MemoFormData = {
        title: "Updated Memo",
        memo: "a".repeat(MAX_MEMO_LENGTH + 1),
        rating: 4,
        result: "LOSE",
      };

      // Act & Assert
      await expect(
        updateMemo(mockSessionId, mockMemoId, mockMemoData)
      ).rejects.toThrow(`Memo cannot exceed ${MAX_MEMO_LENGTH} characters`);
      expect(updateDoc).not.toHaveBeenCalled();
    });
  });

  describe("deleteMemo", () => {
    it("メモを削除できる", async () => {
      // Arrange
      (doc as jest.Mock).mockReturnValue({});
      (deleteDoc as jest.Mock).mockResolvedValue(undefined);

      // Act
      await deleteMemo(mockSessionId, mockMemoId);

      // Assert
      expect(collection).toHaveBeenCalledWith(
        db,
        "battleSessions",
        mockSessionId,
        "memos"
      );
      expect(deleteDoc).toHaveBeenCalled();
    });
  });
});
