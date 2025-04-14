import { ErrorCode, ErrorSeverity, ErrorContext } from "./types";

/**
 * アプリケーション固有のエラーの基底クラス
 */
export class CustomError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly message: string,
    public readonly severity: ErrorSeverity = ErrorSeverity.ERROR,
    public readonly context: ErrorContext = {},
    public readonly cause?: Error
  ) {
    super(message);
    this.name = this.constructor.name;

    // Errorクラスのプロトタイプチェーンを正しく設定
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  /**
   * エラー情報をログ出力用のオブジェクトに変換
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      severity: this.severity,
      context: this.context,
      cause: this.cause?.message,
      stack: this.stack,
    };
  }

  /**
   * エラーメッセージをユーザーフレンドリーな形式で取得
   */
  getUserMessage(): string {
    return this.message;
  }
}

/**
 * バトルセッション関連のエラー
 */
export class BattleSessionError extends CustomError {
  constructor(
    code: ErrorCode,
    message: string,
    severity?: ErrorSeverity,
    context?: ErrorContext,
    cause?: Error
  ) {
    super(code, message, severity, context, cause);
    Object.setPrototypeOf(this, BattleSessionError.prototype);
  }
}

/**
 * メモ関連のエラー
 */
export class MemoError extends CustomError {
  constructor(
    code: ErrorCode,
    message: string,
    severity?: ErrorSeverity,
    context?: ErrorContext,
    cause?: Error
  ) {
    super(code, message, severity, context, cause);
    Object.setPrototypeOf(this, MemoError.prototype);
  }
}

/**
 * ストレージ関連のエラー
 */
export class StorageError extends CustomError {
  constructor(
    code: ErrorCode,
    message: string,
    severity?: ErrorSeverity,
    context?: ErrorContext,
    cause?: Error
  ) {
    super(code, message, severity, context, cause);
    Object.setPrototypeOf(this, StorageError.prototype);
  }
}
