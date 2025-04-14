/**
 * ローカルストレージを使用したStorage実装
 */
import { IStorage } from "./types";

export class LocalStorage implements IStorage {
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== "undefined";
  }

  /**
   * 指定されたキーに対応する値を取得
   */
  async getItem<T>(key: string): Promise<T | null> {
    if (!this.isClient) {
      return null;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      return null;
    }
  }

  /**
   * 指定されたキーと値をストレージに保存
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    if (!this.isClient) {
      return;
    }

    try {
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error writing to localStorage (key: ${key}):`, error);
      throw new Error(`Failed to save data to localStorage: ${error}`);
    }
  }

  /**
   * 指定されたキーの値を削除
   */
  async removeItem(key: string): Promise<void> {
    if (!this.isClient) {
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
      throw new Error(`Failed to remove data from localStorage: ${error}`);
    }
  }

  /**
   * ストレージ内のすべてのデータを削除
   */
  async clear(): Promise<void> {
    if (!this.isClient) {
      return;
    }

    try {
      window.localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      throw new Error(`Failed to clear localStorage: ${error}`);
    }
  }
}
