import { renderHook, act } from "@testing-library/react";
import { useMemos } from "../useMemos";
import { useMemoService } from "../useMemoService";
import { waitForNextTick, mockConsoleError } from "@/lib/__tests__/helpers";
import { createMemos, createMemoFormData } from "@/lib/__tests__/factories";

// モックの作成
jest.mock("../useMemoService");
jest.mock("@/lib/storage/localStorage");
jest.mock("@/lib/services/memoService");

const mockUseMemoService = useMemoService as jest.MockedFunction<
  typeof useMemoService
>;

// テスト用のメモデータ
const mockMemos = createMemos(2);

// モックサービスの作成
const mockMemoService = {
  getMemos: jest.fn(),
  addMemo: jest.fn(),
  updateMemo: jest.fn(),
  deleteMemo: jest.fn(),
  deleteAllMemos: jest.fn(),
  getTotalMemos: jest.fn(),
};

describe("useMemos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMemoService.mockReturnValue(mockMemoService);
    mockMemoService.getMemos.mockResolvedValue(mockMemos);
  });

  it("初期化時にメモを読み込む", async () => {
    // Arrange
    const { result } = renderHook(() => useMemos());

    // 初期状態では空配列
    expect(result.current.memos).toEqual([]);

    // Act
    await act(async () => {
      await waitForNextTick();
    });

    // Assert
    expect(result.current.memos).toEqual(mockMemos);
    expect(mockMemoService.getMemos).toHaveBeenCalledTimes(1);
  });

  it("メモを追加できる", async () => {
    // Arrange
    const newMemo = createMemos(1, () => ({ id: "3" }))[0];
    const memoFormData = createMemoFormData();
    mockMemoService.addMemo.mockResolvedValue(newMemo);

    // Act
    const { result } = renderHook(() => useMemos());
    await act(async () => {
      await result.current.addMemo(memoFormData);
    });

    // Assert
    expect(mockMemoService.addMemo).toHaveBeenCalledWith(memoFormData);
    expect(result.current.memos[0]).toEqual(newMemo);
  });

  it("メモを更新できる", async () => {
    // Arrange
    const updatedMemoData = createMemoFormData({
      title: "Updated Title",
      memo: "Updated Memo",
    });

    // updateMemoが呼ばれたとき、モックサービスが更新後のメモを返すようにする
    mockMemoService.updateMemo.mockImplementation((id, data) => {
      return Promise.resolve({
        ...mockMemos.find((memo) => memo.id === id),
        ...data,
      });
    });

    const { result } = renderHook(() => useMemos());

    // 初期メモを読み込む
    await act(async () => {
      await waitForNextTick();
    });

    // Act
    await act(async () => {
      await result.current.updateMemo(mockMemos[0].id, updatedMemoData);
    });

    // Assert
    expect(mockMemoService.updateMemo).toHaveBeenCalledWith(
      mockMemos[0].id,
      updatedMemoData
    );

    // 期待値と実際の値を確認
    expect(result.current.memos[0]).toEqual({
      ...updatedMemoData,
      id: mockMemos[0].id,
      createdAt: mockMemos[0].createdAt,
    });
  });

  it("メモを削除できる", async () => {
    // Arrange
    const { result } = renderHook(() => useMemos());

    // 初期メモを読み込む
    await act(async () => {
      await waitForNextTick();
    });

    // Act
    await act(async () => {
      await result.current.deleteMemo(mockMemos[0].id);
    });

    // Assert
    expect(mockMemoService.deleteMemo).toHaveBeenCalledWith(mockMemos[0].id);
    expect(result.current.memos).toEqual([mockMemos[1]]);
  });

  it("すべてのメモを削除できる", async () => {
    // Arrange
    const { result } = renderHook(() => useMemos());

    // 初期メモを読み込む
    await act(async () => {
      await waitForNextTick();
    });

    // Act
    await act(async () => {
      await result.current.deleteAllMemos();
    });

    // Assert
    expect(mockMemoService.deleteAllMemos).toHaveBeenCalled();
    expect(result.current.memos).toEqual([]);
  });

  it("ページネーションが正しく動作する", async () => {
    // Arrange
    // より多くのモックデータを用意
    const manyMockMemos = createMemos(10);
    mockMemoService.getMemos.mockResolvedValue(manyMockMemos);

    const { result } = renderHook(() => useMemos());

    // 初期メモを読み込む
    await act(async () => {
      await waitForNextTick();
    });

    // Assert - 初期状態
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(2); // 10件のデータで1ページ5件なので2ページになる
    expect(result.current.currentPageMemos).toEqual(manyMockMemos.slice(0, 5)); // 最初の5件

    // Act - ページを変更
    await act(async () => {
      result.current.setCurrentPage(2);
      await waitForNextTick();
    });

    // Assert - ページ変更後
    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentPageMemos).toEqual(manyMockMemos.slice(5, 10)); // 次の5件
  });

  it("初期読み込み時のエラーをハンドリングする", async () => {
    // Arrange
    const error = new Error("Failed to load memos");
    mockMemoService.getMemos.mockRejectedValue(error);

    // コンソールエラーをモック
    const consoleSpy = mockConsoleError();

    // Act
    renderHook(() => useMemos());
    await act(async () => {
      await waitForNextTick();
    });

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith("Failed to load memos:", error);
    consoleSpy.mockRestore();
  });
});
