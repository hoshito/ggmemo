import "@testing-library/jest-dom";

// Firebaseのモック
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn().mockReturnValue({
    name: "mock-app",
  }),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn().mockReturnValue({
    currentUser: null,
  }),
}));

jest.mock("firebase/firestore", () => {
  class TimestampClass {
    seconds: number;
    nanoseconds: number;

    constructor(seconds: number, nanoseconds: number) {
      this.seconds = seconds;
      this.nanoseconds = nanoseconds;
    }

    static fromDate(date: Date): TimestampClass {
      return new TimestampClass(
        Math.floor(date.getTime() / 1000),
        (date.getTime() % 1000) * 1000000
      );
    }

    static now(): TimestampClass {
      const date = new Date();
      return TimestampClass.fromDate(date);
    }
  }

  return {
    getFirestore: jest.fn().mockReturnValue({
      collection: jest.fn(),
    }),
    Timestamp: TimestampClass,
  };
});

// cryptoのモック
const cryptoMock = {
  randomUUID: jest.fn(() => "test-uuid"),
};

Object.defineProperty(window, "crypto", {
  value: cryptoMock,
  writable: true,
});

Object.defineProperty(global, "crypto", {
  value: cryptoMock,
  writable: true,
});

// テスト実行時のコンソールエラーを抑制
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      /Warning: ReactDOM.render is no longer supported in React 18/.test(
        args[0]
      )
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// localStorageのモック
class LocalStorageMock {
  private store: { [key: string]: string } = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = value;
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  key(index: number) {
    return Object.keys(this.store)[index] || null;
  }

  get length() {
    return Object.keys(this.store).length;
  }
}

global.localStorage = new LocalStorageMock() as Storage;

// localStorageのメソッドをspyにする
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    key: jest.fn(),
    length: 0,
  },
  writable: true,
});
