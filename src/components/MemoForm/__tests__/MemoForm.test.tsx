import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material";
import { Memo, MAX_MEMO_LENGTH, MAX_MEMOS_PER_SESSION } from "@/types/memo";
import MemoForm from "../index";

// Material-UIのテーマを設定
const theme = createTheme({
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#4CAF50",
            color: "#fff",
          },
        },
      },
    },
  },
});

describe("MemoForm", () => {
  const mockSave = jest.fn();
  const mockCancel = jest.fn();
  const mockDelete = jest.fn();

  const defaultProps = {
    onSave: mockSave,
    onCancel: mockCancel,
    onDelete: mockDelete,
    memosCount: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * テスト用ヘルパー関数：テーマ付きでMemoFormをレンダリングする
   */
  const renderWithTheme = (props = defaultProps, initialData?: Memo) => {
    return render(
      <ThemeProvider theme={theme}>
        <MemoForm {...props} initialData={initialData} />
      </ThemeProvider>
    );
  };

  /**
   * テスト用ヘルパー関数：フォーム要素を取得する
   */
  const getFormElements = () => {
    return {
      form: screen.getByRole("form", { name: /game result memo form/i }),
      textarea: screen.getByRole("textbox", { name: /game memo text/i }),
      winButton: screen.getByRole("button", { name: /win/i }),
      loseButton: screen.getByRole("button", { name: /lose/i }),
      saveButton: screen.getByRole("button", { name: /save memo/i }),
      stars: screen.getAllByRole("button", { name: /[1-5]星/i }),
      characterCount: screen.getByText(new RegExp(`\\d+/${MAX_MEMO_LENGTH}`)),
    };
  };

  describe("表示テスト", () => {
    it("デフォルトの状態で正しくレンダリングされる", () => {
      // Arrange & Act
      renderWithTheme();
      const { form, textarea, winButton, loseButton, stars } = getFormElements();

      // Assert
      // フォームの基本要素
      expect(form).toBeInTheDocument();
      expect(textarea).toBeInTheDocument();
      expect(screen.getByText("0/300")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /save memo/i })).toBeInTheDocument();

      // 勝敗選択ボタン
      expect(screen.getByRole("group", { name: /select game result/i })).toBeInTheDocument();
      expect(winButton).toHaveClass("Mui-selected"); // デフォルトでWINが選択されている
      expect(loseButton).not.toHaveClass("Mui-selected");

      // レーティング入力
      const ratingGroup = screen.getByRole("group", { name: /rating \(1-5 stars\)/i });
      expect(ratingGroup).toBeInTheDocument();

      // 星の数を確認（デフォルトで3つ選択されている）
      expect(stars).toHaveLength(5);
      expect(stars[0]).toHaveAttribute("data-selected", "true");
      expect(stars[1]).toHaveAttribute("data-selected", "true");
      expect(stars[2]).toHaveAttribute("data-selected", "true");
      expect(stars[3]).toHaveAttribute("data-selected", "false");
      expect(stars[4]).toHaveAttribute("data-selected", "false");
    });

    it("初期データが正しく表示される", () => {
      // Arrange
      const initialData: Memo = {
        id: "test-id",
        title: "",
        result: "LOSE",
        rating: 4,
        memo: "Initial memo",
        createdAt: "2024-01-01",
      };

      // Act
      renderWithTheme(defaultProps, initialData);
      const { textarea, winButton, loseButton, stars } = getFormElements();

      // Assert
      // メモテキストの確認
      expect(textarea).toHaveValue("Initial memo");

      // 勝敗の確認（LOSEが選択されている）
      expect(loseButton).toHaveClass("Mui-selected");
      expect(winButton).not.toHaveClass("Mui-selected");

      // レーティングの確認（4が選択されている）
      expect(stars).toHaveLength(5);
      for (let i = 0; i < 4; i++) {
        expect(stars[i]).toHaveAttribute("data-selected", "true");
      }
      expect(stars[4]).toHaveAttribute("data-selected", "false");

      // 文字数カウントの確認
      expect(screen.getByText(`${initialData.memo.length}/${MAX_MEMO_LENGTH}`)).toBeInTheDocument();
    });

    it("メモ数が制限に達した場合、新規メモの保存が無効化される", async () => {
      // Arrange & Act
      renderWithTheme({
        ...defaultProps,
        memosCount: MAX_MEMOS_PER_SESSION,
      });
      const { saveButton, textarea } = getFormElements();

      // Assert
      await waitFor(() => {
        // 制限メッセージが表示される
        expect(screen.getByText(`Cannot add more memos. Maximum limit of ${MAX_MEMOS_PER_SESSION} memos reached.`)).toBeInTheDocument();

        // 保存ボタンが無効化される
        expect(saveButton).toBeDisabled();

        // フォームフィールドは空の状態
        expect(textarea).toHaveValue("");
        expect(screen.getByText("0/300")).toBeInTheDocument();
      });
    });
  });

  describe("インタラクションテスト", () => {
    it("テキストエリアに入力できる", async () => {
      // Arrange
      renderWithTheme();
      const { textarea } = getFormElements();

      // Act
      fireEvent.change(textarea, { target: { value: "Test memo" } });

      // Assert
      await waitFor(() => {
        expect(textarea).toHaveValue("Test memo");
        expect(screen.getByText("9/300")).toBeInTheDocument();
      });
    });

    it("勝敗を選択できる", async () => {
      // Arrange
      renderWithTheme();
      const { winButton, loseButton } = getFormElements();

      // Act - デフォルトではWINが選択されている
      expect(winButton).toHaveClass("Mui-selected");
      expect(loseButton).not.toHaveClass("Mui-selected");

      // LOSEを選択
      fireEvent.click(loseButton);

      // Assert
      await waitFor(() => {
        expect(loseButton).toHaveClass("Mui-selected");
        expect(winButton).not.toHaveClass("Mui-selected");
      });
    });

    it("レーティングを選択できる", async () => {
      // Arrange
      renderWithTheme();
      const { stars } = getFormElements();

      // Act - デフォルトは3
      expect(stars[0]).toHaveAttribute("data-selected", "true");
      expect(stars[1]).toHaveAttribute("data-selected", "true");
      expect(stars[2]).toHaveAttribute("data-selected", "true");
      expect(stars[3]).toHaveAttribute("data-selected", "false");
      expect(stars[4]).toHaveAttribute("data-selected", "false");

      // 5つ目の星をクリック
      fireEvent.click(stars[4]);

      // Assert
      await waitFor(() => {
        stars.forEach(star => {
          expect(star).toHaveAttribute("data-selected", "true");
        });
      });
    });

    it("文字数制限が正しく機能する", () => {
      // Arrange
      renderWithTheme();
      const { textarea } = getFormElements();

      // Act & Assert - 制限内の入力
      const validText = "a".repeat(MAX_MEMO_LENGTH - 10);
      fireEvent.change(textarea, { target: { value: validText } });
      expect(textarea).toHaveValue(validText);
      expect(screen.getByText(`${MAX_MEMO_LENGTH - 10}/${MAX_MEMO_LENGTH}`)).toBeInTheDocument();

      // Act & Assert - 制限ちょうどの入力
      const exactText = "a".repeat(MAX_MEMO_LENGTH);
      fireEvent.change(textarea, { target: { value: exactText } });
      expect(textarea).toHaveValue(exactText);
      expect(screen.getByText(`${MAX_MEMO_LENGTH}/${MAX_MEMO_LENGTH}`)).toBeInTheDocument();

      // Act & Assert - 制限を超える入力
      const longText = exactText + "extra";
      fireEvent.change(textarea, { target: { value: longText } });
      expect(textarea).toHaveValue(exactText); // 前回の有効な入力が維持される
      expect(screen.getByText(`${MAX_MEMO_LENGTH}/${MAX_MEMO_LENGTH}`)).toBeInTheDocument();
    });

    it("フォーム送信時にonSaveが呼ばれる", () => {
      // Arrange
      renderWithTheme();
      const { form, textarea } = getFormElements();

      // Act
      fireEvent.change(textarea, { target: { value: "Test memo" } });
      fireEvent.submit(form);

      // Assert
      expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
        memo: "Test memo",
        result: "WIN", // デフォルト値
        rating: 3, // デフォルト値
        title: "", // デフォルト値
      }));
    });
  });
});
