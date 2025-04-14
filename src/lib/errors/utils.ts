import {
  CustomError,
  BattleSessionError,
  MemoError,
  StorageError,
} from "./CustomError";
import { ErrorCode, ErrorSeverity, ErrorContext } from "./types";

/**
 * エラーログの記録
 * Note: 本番環境では適切なロギングサービスに置き換えることを想定
 */
export function logError(error: Error) {
  if (error instanceof CustomError) {
    console.error(JSON.stringify(error.toJSON(), null, 2));
  } else {
    console.error({
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  }
}

/**
 * 一般的なErrorをCustomErrorに変換
 */
export function toCustomError(
  error: Error,
  code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  context: ErrorContext = {}
): CustomError {
  if (error instanceof CustomError) {
    return error;
  }
  return new CustomError(code, error.message, severity, context, error);
}

/**
 * バトルセッション関連のエラー生成
 */
export function createBattleSessionError(
  code: ErrorCode,
  message: string,
  severity?: ErrorSeverity,
  context?: ErrorContext,
  cause?: Error
): BattleSessionError {
  return new BattleSessionError(code, message, severity, context, cause);
}

/**
 * メモ関連のエラー生成
 */
export function createMemoError(
  code: ErrorCode,
  message: string,
  severity?: ErrorSeverity,
  context?: ErrorContext,
  cause?: Error
): MemoError {
  return new MemoError(code, message, severity, context, cause);
}

/**
 * ストレージ関連のエラー生成
 */
export function createStorageError(
  code: ErrorCode,
  message: string,
  severity?: ErrorSeverity,
  context?: ErrorContext,
  cause?: Error
): StorageError {
  return new StorageError(code, message, severity, context, cause);
}

/**
 * エラーメッセージを開発者向けに整形
 */
export function formatErrorForDevelopers(error: Error): string {
  if (error instanceof CustomError) {
    const { code, message, severity, context, cause } = error;
    return (
      `[${code}][${severity}] ${message}\n` +
      `Context: ${JSON.stringify(context)}\n` +
      (cause ? `Cause: ${cause.message}` : "")
    );
  }
  return `[UNKNOWN] ${error.message}\n${error.stack || ""}`;
}

/**
 * エラーの重大度を判定
 */
export function isErrorCritical(error: Error): boolean {
  if (error instanceof CustomError) {
    return error.severity === ErrorSeverity.CRITICAL;
  }
  return false;
}
