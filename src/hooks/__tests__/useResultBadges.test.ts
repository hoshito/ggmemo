import { renderHook, act } from "@testing-library/react";
import { useResultBadges } from "../useResultBadges";
import { Memo } from "@/types/memo";

// エディターとノードのインターフェースを定義
interface MockNode {
  type: {
    name: string;
  };
  attrs: {
    result: Memo["result"];
  };
}

interface MockEditor {
  getHTML: jest.Mock;
  chain: jest.Mock;
  focus: jest.Mock;
  insertContent: jest.Mock;
  run: jest.Mock;
  state: {
    doc: {
      descendants: (callback: (node: MockNode) => boolean) => void;
    };
  };
}

// エディターのモックを作成する関数
const createMockEditor = (nodes: MockNode[] = []): MockEditor => {
  return {
    getHTML: jest.fn().mockReturnValue("<p>test content</p>"),
    chain: jest.fn().mockReturnThis(),
    focus: jest.fn().mockReturnThis(),
    insertContent: jest.fn().mockReturnThis(),
    run: jest.fn(),
    state: {
      doc: {
        descendants: (callback: (node: MockNode) => boolean) => {
          nodes.forEach((node) => callback(node));
        },
      },
    },
  };
};

// モックノードの作成ヘルパー
const createResultBadgeNode = (result: Memo["result"]): MockNode => ({
  type: { name: "resultBadge" },
  attrs: { result },
});

describe("useResultBadges", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("memoStatsの管理", () => {
    it("初期状態では空の配列が設定される", () => {
      const { result } = renderHook(() => useResultBadges());
      expect(result.current.memoStats).toEqual([]);
    });
  });

  describe("countResultBadges", () => {
    it("エディターがnullの場合は0を返す", () => {
      const { result } = renderHook(() => useResultBadges());
      const counts = result.current.countResultBadges(null);
      expect(counts).toEqual({ win: 0, lose: 0 });
    });

    it("WIN/LOSEバッジの数を正しくカウントする", () => {
      // 様々なバッジパターンをテスト
      const testCases = [
        {
          nodes: [] as MockNode[],
          expected: { win: 0, lose: 0 },
          name: "バッジなし",
        },
        {
          nodes: [
            createResultBadgeNode("WIN"),
            createResultBadgeNode("WIN"),
            createResultBadgeNode("WIN"),
          ],
          expected: { win: 3, lose: 0 },
          name: "WINのみ",
        },
        {
          nodes: [createResultBadgeNode("LOSE"), createResultBadgeNode("LOSE")],
          expected: { win: 0, lose: 2 },
          name: "LOSEのみ",
        },
        {
          nodes: [
            createResultBadgeNode("WIN"),
            createResultBadgeNode("LOSE"),
            createResultBadgeNode("WIN"),
          ],
          expected: { win: 2, lose: 1 },
          name: "混合",
        },
      ];

      // 各テストケースを実行
      testCases.forEach((testCase) => {
        const { result } = renderHook(() => useResultBadges());
        const mockEditor = createMockEditor(testCase.nodes);
        const counts = result.current.countResultBadges(mockEditor);

        expect(counts).toEqual(testCase.expected);
      });
    });
  });

  describe("updateMemoStats", () => {
    it("エディターの内容に基づいてmemoStatsを更新する", () => {
      const nodes = [
        createResultBadgeNode("WIN"),
        createResultBadgeNode("LOSE"),
        createResultBadgeNode("WIN"),
      ];

      const mockEditor = createMockEditor(nodes);
      const { result } = renderHook(() => useResultBadges());

      act(() => {
        result.current.updateMemoStats(mockEditor);
      });

      expect(result.current.memoStats.length).toBe(3);
      expect(
        result.current.memoStats.filter((m) => m.result === "WIN").length
      ).toBe(2);
      expect(
        result.current.memoStats.filter((m) => m.result === "LOSE").length
      ).toBe(1);
    });

    it("エディターがnullの場合は何もしない", () => {
      const { result } = renderHook(() => useResultBadges());

      act(() => {
        result.current.updateMemoStats(null);
      });

      expect(result.current.memoStats).toEqual([]);
    });
  });

  describe("insertBadge", () => {
    it("WINバッジを挿入する", () => {
      const mockEditor = createMockEditor();
      const { result } = renderHook(() => useResultBadges());

      result.current.insertBadge(mockEditor, "WIN");

      expect(mockEditor.chain).toHaveBeenCalled();
      expect(mockEditor.focus).toHaveBeenCalled();
      expect(mockEditor.insertContent).toHaveBeenCalledWith({
        type: "resultBadge",
        attrs: { result: "WIN" },
      });
      expect(mockEditor.run).toHaveBeenCalled();
    });

    it("LOSEバッジを挿入する", () => {
      const mockEditor = createMockEditor();
      const { result } = renderHook(() => useResultBadges());

      result.current.insertBadge(mockEditor, "LOSE");

      expect(mockEditor.insertContent).toHaveBeenCalledWith({
        type: "resultBadge",
        attrs: { result: "LOSE" },
      });
    });

    it("エディターがnullまたは文字数制限超過時は何もしない", () => {
      const mockEditor = createMockEditor();
      const { result } = renderHook(() => useResultBadges());

      // nullテスト
      result.current.insertBadge(null, "WIN");
      expect(mockEditor.chain).not.toHaveBeenCalled();

      // 文字数制限テスト
      mockEditor.chain.mockClear();
      result.current.insertBadge(mockEditor, "WIN", true);
      expect(mockEditor.chain).not.toHaveBeenCalled();
    });
  });
});
