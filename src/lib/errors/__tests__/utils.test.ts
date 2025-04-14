import { CustomError } from "../CustomError";
import { ErrorCode, ErrorSeverity } from "../types";
import {
  toCustomError,
  formatErrorForDevelopers,
  isErrorCritical,
} from "../utils";
import { setupTest } from "@/lib/__tests__/helpers";

describe("エラーユーティリティ", () => {
  let cleanup: () => void;

  beforeEach(() => {
    // 共通のテストセットアップ
    const testSetup = setupTest();
    cleanup = testSetup.cleanup;
  });

  afterEach(() => {
    cleanup();
  });

  describe("toCustomError", () => {
    it("通常のエラーをCustomErrorに変換できる", () => {
      // Arrange
      const error = new Error("テストエラー");
      const code = ErrorCode.INVALID_INPUT;
      const severity = ErrorSeverity.WARNING;
      const context = { userId: "123" };

      // Act
      const customError = toCustomError(error, code, severity, context);

      // Assert
      expect(customError).toBeInstanceOf(CustomError);
      expect(customError.code).toBe(code);
      expect(customError.message).toBe("テストエラー");
      expect(customError.severity).toBe(severity);
      expect(customError.context).toEqual(context);
      expect(customError.cause).toBe(error);
    });

    it("既存のCustomErrorはそのまま返す", () => {
      // Arrange
      const originalError = new CustomError(
        ErrorCode.INVALID_INPUT,
        "既存のエラー"
      );

      // Act
      const result = toCustomError(originalError);

      // Assert
      expect(result).toBe(originalError);
    });
  });

  describe("formatErrorForDevelopers", () => {
    it("開発者向けのエラーメッセージをフォーマットできる", () => {
      // Arrange
      const cause = new Error("元のエラー");
      const error = new CustomError(
        ErrorCode.INVALID_INPUT,
        "不正な入力です",
        ErrorSeverity.ERROR,
        { param: "test" },
        cause
      );

      // Act
      const formattedError = formatErrorForDevelopers(error);

      // Assert
      expect(formattedError).toBe(
        `[INVALID_INPUT][ERROR] 不正な入力です\n` +
          `Context: {"param":"test"}\n` +
          `Cause: 元のエラー`
      );
    });

    it("通常のエラーをフォーマットできる", () => {
      // Arrange
      const error = new Error("テストエラー");

      // Act
      const formattedError = formatErrorForDevelopers(error);

      // Assert
      expect(formattedError).toBe(`[UNKNOWN] テストエラー\n${error.stack}`);
    });
  });

  describe("isErrorCritical", () => {
    it("重大度に基づいてエラーの重要度を判定できる", () => {
      // Arrange
      const criticalError = new CustomError(
        ErrorCode.INVALID_INPUT,
        "重大なエラー",
        ErrorSeverity.CRITICAL
      );
      const normalError = new CustomError(
        ErrorCode.INVALID_INPUT,
        "通常のエラー",
        ErrorSeverity.ERROR
      );
      const standardError = new Error("通常のエラー");

      // Act & Assert
      expect(isErrorCritical(criticalError)).toBe(true);
      expect(isErrorCritical(normalError)).toBe(false);
      expect(isErrorCritical(standardError)).toBe(false);
    });
  });
});
