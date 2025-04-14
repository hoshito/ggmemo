import { createStarArray, getAriaLabel } from "../utils";

describe("RatingInput utils", () => {
  describe("createStarArray", () => {
    it("デフォルトで5つの星の配列を生成する", () => {
      const result = createStarArray();
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("指定した数の星の配列を生成する", () => {
      const result = createStarArray(3);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe("getAriaLabel", () => {
    it("入力モード時のラベルを生成する", () => {
      const result = getAriaLabel(3, true);
      expect(result).toBe("Rating (1-5 stars)");
    });

    it("表示モード時のラベルを生成する", () => {
      const result = getAriaLabel(3);
      expect(result).toBe("Rating: 3 out of 5");
    });
  });
});
