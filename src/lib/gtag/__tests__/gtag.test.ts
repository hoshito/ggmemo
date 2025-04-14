import {
  GA_MEASUREMENT_ID,
  pageview,
  event,
  trackMemoEvent,
  trackResultEvent,
} from "../gtag";
import type { GTagEvent, GtagFunction } from "@/types/gtag";
import { setupTest } from "@/lib/__tests__/helpers";

describe("Google Analytics Functions", () => {
  let mockGtag: jest.Mock<GtagFunction>;
  let cleanup: () => void;
  let originalGtag: GtagFunction | undefined;

  beforeEach(() => {
    // 共通のテストセットアップ
    const testSetup = setupTest();
    cleanup = testSetup.cleanup;

    // 元のgtagを保存
    originalGtag = window.gtag;

    // モックGtag関数の設定
    mockGtag = jest.fn() as jest.Mock<GtagFunction>;
    window.gtag = mockGtag;
  });

  afterEach(() => {
    // テスト後にモックをクリア
    jest.clearAllMocks();
    window.gtag = originalGtag;
    cleanup();
  });

  describe("pageview", () => {
    it("正しくページビューイベントを送信する", () => {
      // Arrange
      const testUrl = "/test-page";

      // Act
      pageview(testUrl);

      // Assert
      expect(mockGtag).toHaveBeenCalledWith("config", GA_MEASUREMENT_ID, {
        page_path: testUrl,
      });
    });

    it("window.gtagが未定義の場合は何もしない", () => {
      // Arrange
      window.gtag = undefined;
      const testUrl = "/test-page";

      // Act
      pageview(testUrl);

      // Assert
      expect(mockGtag).not.toHaveBeenCalled();
    });
  });

  describe("event", () => {
    it("正しくイベントを送信する", () => {
      // Arrange
      const testEvent: GTagEvent = {
        action: "test_action",
        category: "test_category",
        label: "test_label",
        value: 123,
      };

      // Act
      event(testEvent);

      // Assert
      expect(mockGtag).toHaveBeenCalledWith("event", testEvent.action, {
        event_category: testEvent.category,
        event_label: testEvent.label,
        value: testEvent.value,
      });
    });

    it("valueが未定義の場合はvalueパラメータを送信しない", () => {
      // Arrange
      const testEvent: GTagEvent = {
        action: "test_action",
        category: "test_category",
        label: "test_label",
      };

      // Act
      event(testEvent);

      // Assert
      expect(mockGtag).toHaveBeenCalledWith("event", testEvent.action, {
        event_category: testEvent.category,
        event_label: testEvent.label,
      });
    });

    it("window.gtagが未定義の場合は何もしない", () => {
      // Arrange
      window.gtag = undefined;
      const testEvent: GTagEvent = {
        action: "test_action",
        category: "test_category",
        label: "test_label",
      };

      // Act
      event(testEvent);

      // Assert
      expect(mockGtag).not.toHaveBeenCalled();
    });
  });

  describe("trackMemoEvent", () => {
    it("メモ作成イベントを正しく送信する", () => {
      // Arrange
      const memoId = "test-memo-id";

      // Act
      trackMemoEvent("create", memoId);

      // Assert
      expect(mockGtag).toHaveBeenCalledWith("event", "memo_create", {
        event_category: "Memo",
        event_label: memoId,
      });
    });

    it("メモ編集イベントを正しく送信する", () => {
      // Arrange
      const memoId = "test-memo-id";

      // Act
      trackMemoEvent("edit", memoId);

      // Assert
      expect(mockGtag).toHaveBeenCalledWith("event", "memo_edit", {
        event_category: "Memo",
        event_label: memoId,
      });
    });

    it("メモ削除イベントを正しく送信する", () => {
      // Arrange
      const memoId = "test-memo-id";

      // Act
      trackMemoEvent("delete", memoId);

      // Assert
      expect(mockGtag).toHaveBeenCalledWith("event", "memo_delete", {
        event_category: "Memo",
        event_label: memoId,
      });
    });
  });

  describe("trackResultEvent", () => {
    it("勝利結果イベントを正しく送信する", () => {
      // Arrange
      const gameId = "test-game-id";

      // Act
      trackResultEvent("win", gameId);

      // Assert
      expect(mockGtag).toHaveBeenCalledWith("event", "result_record", {
        event_category: "Game Result",
        event_label: `${gameId}_win`,
      });
    });

    it("敗北結果イベントを正しく送信する", () => {
      // Arrange
      const gameId = "test-game-id";

      // Act
      trackResultEvent("lose", gameId);

      // Assert
      expect(mockGtag).toHaveBeenCalledWith("event", "result_record", {
        event_category: "Game Result",
        event_label: `${gameId}_lose`,
      });
    });
  });
});
