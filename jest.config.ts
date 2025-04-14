import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  // next.config.jsとテスト環境用の.envファイルが配置されたディレクトリをセット
  dir: "./",
});

// Jestのカスタム設定を設置する場所
const customJestConfig: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    // aliasを定義
    "^@/(.*)$": "<rootDir>/src/$1",
    // firebaseモジュールのモック
    "^firebase/(.*)$": "<rootDir>/__mocks__/firebase/$1",
  },
  // モックのディレクトリを指定
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  // テストのカバレッジレポートの設定
  collectCoverage: true,
  collectCoverageFrom: [
    "src/hooks/**/*.{ts,tsx}",
    "src/lib/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/types.ts",
  ],
  // テスト対象から除外するファイルパターン
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/coverage/",
    "/__mocks__/",
    "/src/lib/__tests__/helpers.ts",
    "/src/lib/__tests__/factories.ts",
  ],
};

// createJestConfigを定義することによって、本ファイルで定義された設定がNext.jsの設定に反映される
export default createJestConfig(customJestConfig);
