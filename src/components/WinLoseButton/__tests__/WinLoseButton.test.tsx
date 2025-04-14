import { render, screen } from "@testing-library/react";
import WinLoseButton from "..";

describe("WinLoseButton", () => {
  /**
   * テスト用ヘルパー関数：WinLoseButtonをレンダリングする
   */
  const renderWinLoseButton = (value: "WIN" | "LOSE") => {
    return render(<WinLoseButton value={value} />);
  };

  /**
   * テスト用ヘルパー関数：ボタン要素を取得する
   */
  const getButton = () => {
    return screen.getByRole("button");
  };

  describe("表示テスト", () => {
    it("WIN状態を表示する", () => {
      // Arrange & Act
      renderWinLoseButton("WIN");

      // Assert
      const button = getButton();
      expect(button).toHaveTextContent("WIN");
    });

    it("LOSE状態を表示する", () => {
      // Arrange & Act
      renderWinLoseButton("LOSE");

      // Assert
      const button = getButton();
      expect(button).toHaveTextContent("LOSE");
    });
  });

  // ゲーム結果以外のテストは省略（MUIコンポーネントの内部実装に依存するため）
});
