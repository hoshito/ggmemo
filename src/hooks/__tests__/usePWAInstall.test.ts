import { renderHook, act } from "@testing-library/react";
import { usePWAInstall } from "../usePWAInstall";

describe("usePWAInstall", () => {
  // テスト用のイベントモック
  type BeforeInstallPromptOutcome = {
    outcome: "accepted" | "dismissed";
    platform: string;
  };

  interface MockBeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<BeforeInstallPromptOutcome>;
    prompt(): Promise<void>;
  }

  const createBeforeInstallPromptEvent = (
    outcome: "accepted" | "dismissed" = "accepted"
  ): MockBeforeInstallPromptEvent =>
    Object.assign(new Event("beforeinstallprompt"), {
      platforms: ["web"],
      prompt: jest.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome, platform: "web" }),
    });

  // グローバルのイベントリスナー周りをテスト後にクリーンアップ
  afterEach(() => {
    jest.clearAllMocks();
    // @ts-expect-error beforeinstallpromptプロパティはWindowに存在しないため
    delete window.beforeinstallprompt;
  });

  describe("初期状態", () => {
    it("初期状態ではインストール不可能", () => {
      // Arrange & Act
      const { result } = renderHook(() => usePWAInstall());

      // Assert
      expect(result.current.canInstall).toBe(false);
    });
  });

  describe("インストールプロンプト", () => {
    it("beforeinstallpromptイベントを受け取るとインストール可能になる", () => {
      // Arrange
      const { result } = renderHook(() => usePWAInstall());

      // Act
      act(() => {
        window.dispatchEvent(createBeforeInstallPromptEvent());
      });

      // Assert
      expect(result.current.canInstall).toBe(true);
    });

    it.each([
      ["accepted", false, "ユーザーがインストールを承諾した場合"],
      ["dismissed", true, "ユーザーがインストールを拒否した場合"],
    ])("%s: %s、canInstallは%sになる", async (outcome, expectedCanInstall) => {
      // Arrange
      const { result } = renderHook(() => usePWAInstall());
      act(() => {
        window.dispatchEvent(
          createBeforeInstallPromptEvent(outcome as "accepted" | "dismissed")
        );
      });

      // Act
      await act(async () => {
        await result.current.showInstallPrompt();
      });

      // Assert
      expect(result.current.canInstall).toBe(expectedCanInstall);
    });
  });
});
