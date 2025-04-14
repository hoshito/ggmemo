/**
 * ストレージ操作の抽象インターフェース
 * 各ストレージ実装（LocalStorage, IndexedDB等）はこのインターフェースを実装する
 */
export interface IStorage {
  /**
   * 指定されたキーに対応する値を取得
   * @param key 取得対象のキー
   * @returns 取得した値、存在しない場合はnull
   */
  getItem<T>(key: string): Promise<T | null>;

  /**
   * 指定されたキーと値をストレージに保存
   * @param key 保存するキー
   * @param value 保存する値
   */
  setItem<T>(key: string, value: T): Promise<void>;

  /**
   * 指定されたキーの値を削除
   * @param key 削除対象のキー
   */
  removeItem(key: string): Promise<void>;

  /**
   * ストレージ内のすべてのデータを削除
   */
  clear(): Promise<void>;
}
