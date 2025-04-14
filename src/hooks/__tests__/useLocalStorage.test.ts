import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../useLocalStorage";
import { mockConsoleError } from "@/lib/__tests__/helpers";

describe("useLocalStorage", () => {
  const key = "testKey";
  const initialValue = { test: "value" };

  beforeEach(() => {
    // テストの前にストレージをクリアし、モックをリセット
    window.localStorage.clear();
    jest.clearAllMocks();
    jest.spyOn(window.localStorage, "getItem").mockReturnValue(null);
  });

  describe("初期化と読み込み", () => {
    it("初期値が正しく設定される", () => {
      // Arrange & Act
      const { result } = renderHook(() => useLocalStorage(key, initialValue));

      // Assert
      expect(result.current[0]).toEqual(initialValue);
    });

    it("保存された値が正しく読み込まれる", () => {
      // Arrange
      const storedValue = { test: "stored" };
      jest
        .spyOn(window.localStorage, "getItem")
        .mockReturnValue(JSON.stringify(storedValue));

      // Act
      const { result } = renderHook(() => useLocalStorage(key, initialValue));

      // Assert
      expect(result.current[0]).toEqual(storedValue);
    });
  });

  describe("更新操作", () => {
    it("直接値を更新できる", () => {
      // Arrange
      const { result } = renderHook(() => useLocalStorage(key, initialValue));
      const newValue = { test: "updated" };

      // Act
      act(() => {
        result.current[1](newValue);
      });

      // Assert
      expect(result.current[0]).toEqual(newValue);
    });

    it("関数を使用して値を更新できる", () => {
      // Arrange
      const { result } = renderHook(() => useLocalStorage(key, initialValue));

      // Act
      act(() => {
        result.current[1]((prev) => ({ ...prev, additional: "field" }));
      });

      // Assert
      expect(result.current[0]).toEqual({
        test: "value",
        additional: "field",
      });
    });
  });

  describe("エラーハンドリング", () => {
    it("getItemエラーが適切に処理される", () => {
      // Arrange
      const consoleSpy = mockConsoleError();
      jest.spyOn(window.localStorage, "getItem").mockImplementation(() => {
        throw new Error("Storage error");
      });

      // Act
      const { result } = renderHook(() => useLocalStorage(key, initialValue));

      // Assert
      expect(result.current[0]).toEqual(initialValue);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("setItemエラーが適切に処理される", () => {
      // Arrange
      const consoleSpy = mockConsoleError();
      const { result } = renderHook(() => useLocalStorage(key, initialValue));
      jest.spyOn(window.localStorage, "setItem").mockImplementation(() => {
        throw new Error("Storage error");
      });

      // Act
      act(() => {
        result.current[1]({ test: "error" });
      });

      // Assert
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("クライアントサイドの検出", () => {
    it("isClientフラグが正しく設定される", () => {
      // Arrange & Act
      const { result } = renderHook(() => useLocalStorage(key, initialValue));

      // Assert
      expect(result.current[2]).toBe(true); // React Testing Library環境ではtrueになる
    });
  });
});
