import { renderHook, act } from "@testing-library/react";
import { useEditorAutoSave } from "../useEditorAutoSave";
import { useLocalStorage } from "../useLocalStorage";

// useLocalStorageフックのモック
jest.mock("../useLocalStorage", () => ({
  useLocalStorage: jest.fn(),
}));

// TipTapエディターのモックインターフェース定義
interface MockEditor {
  getHTML: jest.Mock;
  state: {
    doc: {
      textContent: string;
    };
  };
  commands: {
    setContent: jest.Mock;
  };
}

// エディターのモックを作成する関数
const createMockEditor = (content: string = "テスト内容"): MockEditor => {
  return {
    getHTML: jest.fn().mockReturnValue(`<p>${content}</p>`),
    state: {
      doc: {
        textContent: content,
      },
    },
    commands: {
      setContent: jest.fn(),
    },
  };
};

describe("useEditorAutoSave", () => {
  const storageKey = "test-editor-content";
  const savedContent = "<p>保存されたコンテンツ</p>";
  const setSavedContentMock = jest.fn();
  const isClient = true;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useLocalStorage as jest.Mock).mockReturnValue([
      savedContent,
      setSavedContentMock,
      isClient,
    ]);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("基本機能", () => {
    it("正しい初期値で初期化される", () => {
      const { result } = renderHook(() =>
        useEditorAutoSave({
          storageKey,
          debounceTime: 500,
          characterLimit: 5000,
        })
      );

      expect(result.current.savedContent).toBe(savedContent);
      expect(result.current.isClient).toBe(isClient);
      expect(result.current.isOverLimit).toBe(false);
      expect(result.current.initialLoadDone).toBe(false);
    });
  });

  describe("文字数カウント", () => {
    it("エディターのテキスト文字数を正しくカウントする", () => {
      const testCases = [
        { content: "", expected: 0 },
        { content: "Hello", expected: 5 },
        { content: "これは日本語のテスト", expected: 10 },
      ];

      const { result } = renderHook(() => useEditorAutoSave({ storageKey }));

      testCases.forEach(({ content, expected }) => {
        const mockEditor = createMockEditor(content);
        const count = result.current.countCharacters(mockEditor);
        expect(count).toBe(expected);
      });

      // nullケース
      expect(result.current.countCharacters(null)).toBe(0);
    });
  });

  describe("エディター更新時の動作", () => {
    it("文字数制限内なら内容を保存し、超過時は保存しない", () => {
      // 文字数制限内のエディター
      const shortEditor = createMockEditor("短いテキスト");

      // 文字数制限を超えるエディター
      const longEditor = createMockEditor(
        "これは文字数制限を超える長いテキストです"
      );

      const { result } = renderHook(() =>
        useEditorAutoSave({
          storageKey,
          characterLimit: 10,
        })
      );

      // 文字数制限内の場合
      act(() => {
        result.current.handleEditorUpdate(shortEditor);
        jest.runAllTimers(); // デバウンス処理を進める
      });

      expect(setSavedContentMock).toHaveBeenCalledWith("<p>短いテキスト</p>");
      expect(result.current.isOverLimit).toBe(false);

      // 文字数制限超過の場合
      setSavedContentMock.mockClear();
      act(() => {
        result.current.handleEditorUpdate(longEditor);
        jest.runAllTimers(); // デバウンス処理を進める
      });

      expect(setSavedContentMock).not.toHaveBeenCalled();
      expect(result.current.isOverLimit).toBe(true);
    });

    it("デバウンス処理が正しく機能する", () => {
      const { result } = renderHook(() =>
        useEditorAutoSave({
          storageKey,
          debounceTime: 1000,
        })
      );

      const mockEditor = createMockEditor("テスト");

      // 最初の更新
      act(() => {
        result.current.handleEditorUpdate(mockEditor);
        jest.advanceTimersByTime(500); // 途中経過
      });
      expect(setSavedContentMock).not.toHaveBeenCalled(); // まだ保存されていない

      // 時間経過後
      act(() => {
        jest.advanceTimersByTime(500); // 合計1000ms経過
      });
      expect(setSavedContentMock).toHaveBeenCalledTimes(1); // 保存された
    });
  });

  describe("保存内容の読み込み", () => {
    it("保存された内容をエディターに読み込む", () => {
      const mockEditor = createMockEditor("");
      const { result } = renderHook(() => useEditorAutoSave({ storageKey }));

      act(() => {
        result.current.loadSavedContent(mockEditor);
      });

      expect(mockEditor.commands.setContent).toHaveBeenCalledWith(savedContent);
    });

    it("エディターがnullやクライアントサイドでない場合は何もしない", () => {
      const mockEditor = createMockEditor("");

      // isClientがfalseのケース
      (useLocalStorage as jest.Mock).mockReturnValueOnce([
        savedContent,
        setSavedContentMock,
        false, // isClientがfalse
      ]);

      const { result } = renderHook(() => useEditorAutoSave({ storageKey }));

      act(() => {
        // nullケース
        result.current.loadSavedContent(null);
        // クライアントサイドでないケース
        result.current.loadSavedContent(mockEditor);
      });

      expect(mockEditor.commands.setContent).not.toHaveBeenCalled();
    });
  });

  describe("クリーンアップ", () => {
    it("アンマウント時にタイマーをクリアする", () => {
      const clearTimeoutSpy = jest.spyOn(window, "clearTimeout");
      const { result, unmount } = renderHook(() =>
        useEditorAutoSave({ storageKey })
      );

      // タイマーを設定
      const mockEditor = createMockEditor("テスト");
      act(() => {
        result.current.handleEditorUpdate(mockEditor);
      });

      // アンマウント
      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });
});
