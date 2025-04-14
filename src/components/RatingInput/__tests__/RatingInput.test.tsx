import { render, screen, fireEvent } from "@testing-library/react";
import { RatingInput } from "..";

describe("RatingInput", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  /**
   * テスト用ヘルパー関数：RatingInputをレンダリングする
   */
  const renderRatingInput = (value: number = 0) => {
    return render(<RatingInput value={value} onChange={mockOnChange} />);
  };

  /**
   * テスト用ヘルパー関数：星ボタンを全て取得する
   */
  const getAllStarButtons = () => {
    return screen.getAllByRole("button");
  };

  describe("表示テスト", () => {
    it("5つの星ボタンを表示する", () => {
      // Arrange & Act
      renderRatingInput();

      // Assert
      const buttons = getAllStarButtons();
      expect(buttons).toHaveLength(5);
    });

    it("現在の値に応じて星が選択状態になる", () => {
      // Arrange & Act
      renderRatingInput(3);

      // Assert
      const buttons = getAllStarButtons();

      // 最初の3つのボタンがdata-selected="true"を持つ
      expect(buttons[0]).toHaveAttribute("data-selected", "true");
      expect(buttons[1]).toHaveAttribute("data-selected", "true");
      expect(buttons[2]).toHaveAttribute("data-selected", "true");
      // 残りのボタンはdata-selected="false"を持つ
      expect(buttons[3]).toHaveAttribute("data-selected", "false");
      expect(buttons[4]).toHaveAttribute("data-selected", "false");
    });
  });

  describe("インタラクションテスト", () => {
    it("星をクリックするとonChangeが呼ばれる", () => {
      // Arrange
      renderRatingInput();
      const buttons = getAllStarButtons();

      // Act
      fireEvent.click(buttons[2]); // 3番目の星をクリック

      // Assert
      expect(mockOnChange).toHaveBeenCalledWith(3);
    });

    it("マウスホバー時に星がハイライトされる", () => {
      // Arrange
      renderRatingInput();
      const buttons = getAllStarButtons();

      // Act
      fireEvent.mouseEnter(buttons[2]); // 3番目の星にホバー

      // Assert
      // 最初の3つのボタンがdata-hovered="true"を持つ
      expect(buttons[0]).toHaveAttribute("data-hovered", "true");
      expect(buttons[1]).toHaveAttribute("data-hovered", "true");
      expect(buttons[2]).toHaveAttribute("data-hovered", "true");
      // 残りのボタンはdata-hovered="false"を持つ
      expect(buttons[3]).toHaveAttribute("data-hovered", "false");
      expect(buttons[4]).toHaveAttribute("data-hovered", "false");
    });

    it("マウスが離れるとハイライトが解除される", () => {
      // Arrange
      renderRatingInput();
      const container = screen.getByRole("group");
      const buttons = getAllStarButtons();

      // Act
      fireEvent.mouseEnter(buttons[2]); // まず3番目の星にホバー
      fireEvent.mouseLeave(container);  // コンテナからマウスが離れる

      // Assert
      // すべてのボタンのdata-hoveredが"false"になる
      buttons.forEach(button => {
        expect(button).toHaveAttribute("data-hovered", "false");
      });
    });
  });

  describe("アクセシビリティ", () => {
    it("アクセシビリティ要素が適切に設定される", () => {
      // Arrange & Act
      renderRatingInput(3);

      // Assert
      // コンテナのアクセシビリティ
      const container = screen.getByRole("group");
      expect(container).toHaveAttribute("aria-label", "Rating (1-5 stars)");

      // 各ボタンのアクセシビリティ
      const buttons = getAllStarButtons();
      buttons.forEach((button, index) => {
        expect(button).toHaveAttribute("aria-label", `${index + 1}星`);
      });
    });
  });
});
