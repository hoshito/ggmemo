import { CustomError } from "../CustomError";
import { ErrorCode, ErrorSeverity } from "../types";
import { setupTest } from "@/lib/__tests__/helpers";

describe("CustomError", () => {
  let cleanup: () => void;

  beforeEach(() => {
    // 共通のテストセットアップ
    const testSetup = setupTest();
    cleanup = testSetup.cleanup;
  });

  afterEach(() => {
    cleanup();
  });

  it("基本的なエラー情報を保持できる", () => {
    // Arrange
    const errorCode = ErrorCode.UNKNOWN_ERROR;
    const errorMessage = "Test error message";

    // Act
    const error = new CustomError(errorCode, errorMessage);

    // Assert
    expect(error.code).toBe(errorCode);
    expect(error.message).toBe(errorMessage);
    expect(error.severity).toBe(ErrorSeverity.ERROR);
    expect(error.context).toEqual({});
    expect(error.cause).toBeUndefined();
    expect(error).toBeInstanceOf(Error);
  });

  it("追加情報を含めることができる", () => {
    // Arrange
    const cause = new Error("Original error");
    const context = { userId: "123" };

    // Act
    const error = new CustomError(
      ErrorCode.INVALID_INPUT,
      "Invalid input error",
      ErrorSeverity.WARNING,
      context,
      cause
    );

    // Assert
    expect(error.code).toBe(ErrorCode.INVALID_INPUT);
    expect(error.message).toBe("Invalid input error");
    expect(error.severity).toBe(ErrorSeverity.WARNING);
    expect(error.context).toEqual(context);
    expect(error.cause).toBe(cause);
  });

  it("JSONフォーマットで出力できる", () => {
    // Arrange
    const error = new CustomError(ErrorCode.UNKNOWN_ERROR, "Test error");

    // Act
    const json = error.toJSON();

    // Assert
    expect(json).toEqual({
      name: "CustomError",
      code: ErrorCode.UNKNOWN_ERROR,
      message: "Test error",
      severity: ErrorSeverity.ERROR,
      context: {},
      cause: undefined,
      stack: error.stack,
    });
  });

  it("ユーザー向けメッセージを取得できる", () => {
    // Arrange
    const error = new CustomError(
      ErrorCode.UNKNOWN_ERROR,
      "User friendly message"
    );

    // Act
    const userMessage = error.getUserMessage();

    // Assert
    expect(userMessage).toBe("User friendly message");
  });
});
