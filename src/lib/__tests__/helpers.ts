/**
 * テスト用のヘルパー関数を提供します
 */

/**
 * 非同期処理の完了を待機するためのヘルパー関数
 * React18の自動バッチング対応や状態更新後のレンダリングを待つためのユーティリティ
 */
export const waitForNextTick = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 0));
};

/**
 * テスト日時を固定するためのヘルパー関数
 * @param isoString 固定するISO形式の日時文字列（デフォルトは "2024-01-01T00:00:00.000Z"）
 * @returns モックの解除関数
 */
export const mockDate = (
  isoString = "2024-01-01T00:00:00.000Z"
): jest.SpyInstance => {
  return jest.spyOn(Date.prototype, "toISOString").mockReturnValue(isoString);
};

/**
 * UUIDを固定するためのヘルパー関数
 * @param uuid 固定するUUID（デフォルトは "test-uuid"）
 * @returns モックの解除関数
 */
export const mockUUID = (uuid = "test-uuid"): jest.SpyInstance => {
  return jest.spyOn(crypto, "randomUUID").mockReturnValue(uuid);
};

/**
 * コンソールエラーをモック化するためのヘルパー関数
 * @returns モック化されたconsole.errorのSpyインスタンス
 */
export const mockConsoleError = (): jest.SpyInstance => {
  return jest.spyOn(console, "error").mockImplementation();
};

/**
 * モックストレージを作成するヘルパー関数
 * @returns モック化されたIStorageオブジェクト
 */
export const createMockStorage = (): jest.Mocked<{
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}> => {
  return {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
};

/**
 * ブラウザのlocalStorageをモック化するヘルパー関数
 * @returns モックを解除するためのクリーンアップ関数
 */
export const mockLocalStorage = (): {
  mockLocalStorage: {
    getItem: jest.Mock;
    setItem: jest.Mock;
    removeItem: jest.Mock;
    clear: jest.Mock;
  };
  cleanup: () => void;
} => {
  const originalLocalStorage = window.localStorage;

  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage,
    writable: true,
  });

  return {
    mockLocalStorage,
    cleanup: () => {
      Object.defineProperty(window, "localStorage", {
        value: originalLocalStorage,
      });
    },
  };
};

/**
 * Firestoreの共通モックを設定するヘルパー関数
 * @returns モック化されたFirestoreのメソッド
 */
export const setupFirestoreMocks = () => {
  // Firestoreの関数をモック化
  const mockFirestore = {
    doc: jest.fn(),
    deleteDoc: jest.fn(),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    getDocs: jest.fn(),
    Timestamp: {
      now: jest.fn().mockReturnValue(new Date("2024-01-01T00:00:00Z")),
    },
  };

  return mockFirestore;
};

/**
 * テストのセットアップを行い、共通のモックとクリーンアップ関数を返す
 * @returns モックとクリーンアップ関数のオブジェクト
 */
export const setupTest = () => {
  const dateMock = mockDate();
  const uuidMock = mockUUID();
  const consoleErrorMock = mockConsoleError();

  const cleanup = () => {
    dateMock.mockRestore();
    uuidMock.mockRestore();
    consoleErrorMock.mockRestore();
  };

  return {
    dateMock,
    uuidMock,
    consoleErrorMock,
    cleanup,
  };
};
