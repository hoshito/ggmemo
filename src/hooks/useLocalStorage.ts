import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // クライアントサイドでのマウント状態を追跡
  const [isClient, setIsClient] = useState(false);

  // 初期状態の設定
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // クライアントサイドでのみ実行される初期化
  useEffect(() => {
    setIsClient(true);
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  // 値を設定し、ローカルストレージに保存する関数
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 新しい値が関数の場合は、前の値を引数として実行
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      if (isClient) {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, isClient] as const;
}
