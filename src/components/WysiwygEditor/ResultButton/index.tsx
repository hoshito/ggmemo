import { FC, KeyboardEvent, TouchEvent, useState } from 'react';
import { Memo } from '@/types/memo';
import styles from './ResultButton.module.css';

type WysiwygResultButtonProps = {
  onInsertBadge: (result: Memo['result']) => void;
  isDisabled: boolean;
};

/**
 * WYSIWYGエディター用のゲーム結果を記録するためのWIN/LOSEボタンコンポーネント
 * PCのキーボード操作とモバイルのタッチ操作の両方に対応
 */
const WysiwygResultButton: FC<WysiwygResultButtonProps> = ({ onInsertBadge, isDisabled }) => {
  // タッチ操作の状態を管理
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null);

  // キーボードイベントハンドラー
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, result: Memo['result']) => {
    // スペースまたはエンターキーが押されたときに実行
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onInsertBadge(result);
    }
  };

  // タッチ開始時のハンドラー
  const handleTouchStart = () => {
    // タッチ開始時間を記録
    setTouchStartTime(Date.now());
  };

  // タッチ終了時のハンドラー
  const handleTouchEnd = (e: TouchEvent<HTMLButtonElement>, result: Memo['result']) => {
    // タッチ操作が短かった場合のみアクションを実行
    // これにより誤操作を防止し、スクロール中の誤タップなどを防ぐ
    if (touchStartTime && Date.now() - touchStartTime < 300) {
      e.preventDefault();
      onInsertBadge(result);
    }

    // タッチ開始時間をリセット
    setTouchStartTime(null);
  };

  return (
    <div className={styles.controlsGroup} role="toolbar" aria-label="Game result controls">
      <button
        className={styles.inputButton}
        onClick={() => onInsertBadge('WIN')}
        onKeyDown={(e) => handleKeyDown(e, 'WIN')}
        onTouchStart={handleTouchStart}
        onTouchEnd={(e) => handleTouchEnd(e, 'WIN')}
        title="Insert WIN"
        disabled={isDisabled}
        aria-label="Insert WIN badge"
        aria-disabled={isDisabled}
        // スマホ用のタッチ体験を向上させる属性
        style={{ touchAction: 'manipulation' }}
      >
        WIN
      </button>
      <button
        className={styles.inputButton}
        onClick={() => onInsertBadge('LOSE')}
        onKeyDown={(e) => handleKeyDown(e, 'LOSE')}
        onTouchStart={handleTouchStart}
        onTouchEnd={(e) => handleTouchEnd(e, 'LOSE')}
        title="Insert LOSE"
        disabled={isDisabled}
        aria-label="Insert LOSE badge"
        aria-disabled={isDisabled}
        // スマホ用のタッチ体験を向上させる属性
        style={{ touchAction: 'manipulation' }}
      >
        LOSE
      </button>
    </div>
  );
};

export default WysiwygResultButton;
