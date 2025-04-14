import { LocalStorage } from "../localStorage";
import { mockLocalStorage, setupTest } from "@/lib/__tests__/helpers";

describe("LocalStorage", () => {
  let storage: LocalStorage;
  let mockLS: {
    getItem: jest.Mock;
    setItem: jest.Mock;
    removeItem: jest.Mock;
    clear: jest.Mock;
  };
  let cleanup: () => void;

  beforeEach(() => {
    // 共通のテストセットアップ
    const testSetup = setupTest();

    // localStorageのモック設定
    const { mockLocalStorage: mockLS_, cleanup: lsCleanup } =
      mockLocalStorage();
    mockLS = mockLS_;
    cleanup = () => {
      testSetup.cleanup();
      lsCleanup();
    };

    storage = new LocalStorage();
  });

  afterEach(() => {
    cleanup();
  });

  describe("When running on server side", () => {
    beforeEach(() => {
      Object.defineProperty(storage, "isClient", { value: false });
    });

    it("should not interact with localStorage", async () => {
      await storage.getItem("testKey");
      await storage.setItem("testKey", { test: "data" });
      await storage.removeItem("testKey");
      await storage.clear();

      expect(mockLS.getItem).not.toHaveBeenCalled();
      expect(mockLS.setItem).not.toHaveBeenCalled();
      expect(mockLS.removeItem).not.toHaveBeenCalled();
      expect(mockLS.clear).not.toHaveBeenCalled();
    });
  });

  describe("getItem", () => {
    it("should retrieve saved value", async () => {
      // Arrange
      const mockData = { id: 1, name: "test" };
      mockLS.getItem.mockReturnValue(JSON.stringify(mockData));

      // Act
      const result = await storage.getItem("testKey");

      // Assert
      expect(result).toEqual(mockData);
      expect(mockLS.getItem).toHaveBeenCalledWith("testKey");
    });

    it("should return null for invalid data", async () => {
      // Arrange
      mockLS.getItem.mockReturnValue("invalid json");

      // Act
      const result = await storage.getItem("testKey");

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("setItem", () => {
    it("should save value", async () => {
      // Arrange
      const testData = { id: 1, name: "test" };

      // Act
      await storage.setItem("testKey", testData);

      // Assert
      expect(mockLS.setItem).toHaveBeenCalledWith(
        "testKey",
        JSON.stringify(testData)
      );
    });
  });

  describe("removeItem", () => {
    it("should remove value", async () => {
      // Act
      await storage.removeItem("testKey");

      // Assert
      expect(mockLS.removeItem).toHaveBeenCalledWith("testKey");
    });
  });

  describe("clear", () => {
    it("should clear all data", async () => {
      // Act
      await storage.clear();

      // Assert
      expect(mockLS.clear).toHaveBeenCalled();
    });
  });
});
