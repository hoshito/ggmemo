import { renderHook } from "@testing-library/react";
import { useMemoService } from "../useMemoService";
import { createMemoService } from "@/lib/services/memoService";

jest.mock("@/lib/services/memoService");

describe("useMemoService", () => {
  const mockMemoService = {
    getMemos: jest.fn(),
    addMemo: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createMemoService as jest.Mock).mockReturnValue(mockMemoService);
  });

  /**
   * テスト用ヘルパー関数：useMemoServiceフックをレンダリングする
   */
  const renderUseMemoService = () => {
    return renderHook(() => useMemoService());
  };

  describe("インスタンス生成", () => {
    it("必要なメモ操作メソッドを持つインスタンスを返す", () => {
      // Arrange & Act
      const { result } = renderUseMemoService();

      // Assert
      expect(result.current).toHaveProperty("getMemos");
      expect(result.current).toHaveProperty("addMemo");
    });
  });

  describe("メモ処理", () => {
    it("再レンダリング時に同じインスタンスを返す", () => {
      // Arrange
      const { result, rerender } = renderUseMemoService();
      const firstInstance = result.current;

      // Act
      rerender();
      const secondInstance = result.current;

      // Assert
      expect(firstInstance).toBe(secondInstance);
    });
  });
});
