import { renderHook, act } from "@testing-library/react";
import { useMemoPagination } from "../useMemoPagination";
import { createMemos } from "@/lib/__tests__/factories";

describe("useMemoPagination", () => {
  describe("基本機能", () => {
    it("基本的なページネーション機能が正しく動作する", () => {
      // Arrange
      const items = createMemos(5);
      const { result } = renderHook(() =>
        useMemoPagination({ items, itemsPerPage: 2 })
      );

      // Assert - 初期状態の確認
      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(3);
      expect(result.current.currentItems).toEqual([items[0], items[1]]);

      // Act - 2ページ目に移動
      act(() => {
        result.current.goToPage(2);
      });
      // Assert
      expect(result.current.currentItems).toEqual([items[2], items[3]]);

      // Act - 最後のページ（3ページ目）に移動
      act(() => {
        result.current.goToPage(3);
      });
      // Assert
      expect(result.current.currentItems).toEqual([items[4]]);
    });
  });

  describe("エッジケース", () => {
    it("空の配列が適切に処理される", () => {
      // Arrange & Act
      const { result } = renderHook(() =>
        useMemoPagination({ items: [], itemsPerPage: 2 })
      );

      // Assert
      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.currentItems).toEqual([]);
    });

    it("範囲外のページ番号が適切に処理される", () => {
      // Arrange
      const items = createMemos(3);
      const { result } = renderHook(() =>
        useMemoPagination({ items, itemsPerPage: 2 })
      );

      // Act - 最大ページを超えるページに移動
      act(() => {
        result.current.goToPage(10);
      });
      // Assert
      expect(result.current.currentPage).toBe(2); // 最後のページに調整

      // Act - 最小ページを下回るページに移動
      act(() => {
        result.current.goToPage(0);
      });
      // Assert
      expect(result.current.currentPage).toBe(1); // 最初のページに調整
    });
  });

  describe("動的な更新", () => {
    it("アイテム数の変更に適切に対応する", () => {
      // Arrange
      const items = createMemos(5);
      const { result, rerender } = renderHook(
        ({ items, itemsPerPage }) => useMemoPagination({ items, itemsPerPage }),
        { initialProps: { items, itemsPerPage: 2 } }
      );

      // Act - 最後のページに移動
      act(() => {
        result.current.goToPage(3);
      });
      // Assert
      expect(result.current.currentPage).toBe(3);

      // Act - アイテム数を減らして再レンダリング
      rerender({ items: items.slice(0, 2), itemsPerPage: 2 });
      // Assert - ページが自動調整されることを確認
      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.currentItems).toHaveLength(2);
    });
  });
});
