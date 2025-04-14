import { createMemoService } from "../memoService";
import { IStorage } from "../../storage/types";
import {
  createMemo,
  createMemos,
  createMemoFormData,
} from "@/lib/__tests__/factories";
import { createMockStorage, setupTest } from "@/lib/__tests__/helpers";

describe("memoService", () => {
  let mockStorage: jest.Mocked<IStorage>;
  let memoService: ReturnType<typeof createMemoService>;
  let cleanup: () => void;

  beforeEach(() => {
    // 共通のセットアップを使用
    const testSetup = setupTest();
    cleanup = testSetup.cleanup;

    // ストレージのモック作成
    mockStorage = createMockStorage();

    // メモサービスの作成
    memoService = createMemoService(mockStorage);
  });

  afterEach(() => {
    cleanup();
  });

  describe("getMemos", () => {
    it("メモが存在する場合、すべてのメモを返す", async () => {
      // Arrange
      const mockMemos = createMemos(1);
      mockStorage.getItem.mockResolvedValue(mockMemos);

      // Act
      const result = await memoService.getMemos();

      // Assert
      expect(result).toEqual(mockMemos);
      expect(mockStorage.getItem).toHaveBeenCalledWith("memos");
    });

    it("メモが存在しない場合、空配列を返す", async () => {
      // Arrange
      mockStorage.getItem.mockResolvedValue(null);

      // Act
      const result = await memoService.getMemos();

      // Assert
      expect(result).toEqual([]);
      expect(mockStorage.getItem).toHaveBeenCalledWith("memos");
    });
  });

  describe("addMemo", () => {
    it("新しいメモを追加する", async () => {
      // Arrange
      const memoFormData = createMemoFormData();
      mockStorage.getItem.mockResolvedValue([]);

      // Act
      const result = await memoService.addMemo(memoFormData);

      // Assert
      expect(result).toEqual({
        ...memoFormData,
        id: "test-uuid",
        createdAt: "2024-01-01T00:00:00.000Z",
      });
      expect(mockStorage.setItem).toHaveBeenCalledWith("memos", [result]);
    });

    it("既存のメモがある場合、新しいメモを先頭に追加する", async () => {
      // Arrange
      const memoFormData = createMemoFormData();
      const existingMemo = createMemo({
        id: "existing-id",
        createdAt: "2023-12-31T00:00:00.000Z",
      });
      mockStorage.getItem.mockResolvedValue([existingMemo]);

      // Act
      const result = await memoService.addMemo(memoFormData);

      // Assert
      expect(mockStorage.setItem).toHaveBeenCalledWith("memos", [
        result,
        existingMemo,
      ]);
    });
  });

  describe("updateMemo", () => {
    it("既存のメモを更新する", async () => {
      // Arrange
      const memoFormData = createMemoFormData({
        title: "Updated Title",
        memo: "Updated memo",
      });
      const existingMemo = createMemo({
        id: "test-id",
        createdAt: "2023-12-31T00:00:00.000Z",
      });
      mockStorage.getItem.mockResolvedValue([existingMemo]);

      // Act
      await memoService.updateMemo("test-id", memoFormData);

      // Assert
      expect(mockStorage.setItem).toHaveBeenCalledWith("memos", [
        {
          ...memoFormData,
          id: "test-id",
          createdAt: "2023-12-31T00:00:00.000Z",
        },
      ]);
    });

    it("存在しないメモのIDが指定された場合、エラーをスローする", async () => {
      // Arrange
      const memoFormData = createMemoFormData();
      mockStorage.getItem.mockResolvedValue([]);

      // Act & Assert
      await expect(
        memoService.updateMemo("non-existent-id", memoFormData)
      ).rejects.toThrow("Memo with id non-existent-id not found");
    });
  });

  describe("deleteMemo", () => {
    it("指定されたIDのメモを削除する", async () => {
      // Arrange
      const mockMemos = createMemos(2, (i) => ({
        id: `test-id-${i + 1}`,
      }));
      mockStorage.getItem.mockResolvedValue(mockMemos);

      // Act
      await memoService.deleteMemo("test-id-1");

      // Assert
      expect(mockStorage.setItem).toHaveBeenCalledWith("memos", [mockMemos[1]]);
    });

    it("存在しないIDが指定された場合、何も変更せずに完了する", async () => {
      // Arrange
      const mockMemos = createMemos(1);
      mockStorage.getItem.mockResolvedValue(mockMemos);

      // Act
      await memoService.deleteMemo("non-existent-id");

      // Assert
      expect(mockStorage.setItem).toHaveBeenCalledWith("memos", mockMemos);
    });
  });

  describe("deleteAllMemos", () => {
    it("すべてのメモを削除する", async () => {
      // Act
      await memoService.deleteAllMemos();

      // Assert
      expect(mockStorage.setItem).toHaveBeenCalledWith("memos", []);
    });
  });

  describe("getTotalMemos", () => {
    it("メモの総数を返す", async () => {
      // Arrange
      const mockMemos = createMemos(2);
      mockStorage.getItem.mockResolvedValue(mockMemos);

      // Act
      const result = await memoService.getTotalMemos();

      // Assert
      expect(result).toBe(2);
    });

    it("メモが存在しない場合、0を返す", async () => {
      // Arrange
      mockStorage.getItem.mockResolvedValue(null);

      // Act
      const result = await memoService.getTotalMemos();

      // Assert
      expect(result).toBe(0);
    });
  });
});
