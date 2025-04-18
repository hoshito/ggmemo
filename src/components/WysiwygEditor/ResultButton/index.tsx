import { FC } from 'react';
import { Memo } from '@/types/memo';
import styles from './ResultButton.module.css';

type WysiwygResultButtonProps = {
  onInsertBadge: (result: Memo['result']) => void;
  isDisabled: boolean;
};

/**
 * WYSIWYGエディター用のゲーム結果を記録するためのWIN/LOSEボタンコンポーネント
 */
const WysiwygResultButton: FC<WysiwygResultButtonProps> = ({ onInsertBadge, isDisabled }) => {
  return (
    <div className={styles.controlsGroup}>
      <button
        className={styles.inputButton}
        onClick={() => onInsertBadge('WIN')}
        title="Insert WIN"
        disabled={isDisabled}
      >
        WIN
      </button>
      <button
        className={styles.inputButton}
        onClick={() => onInsertBadge('LOSE')}
        title="Insert LOSE"
        disabled={isDisabled}
      >
        LOSE
      </button>
    </div>
  );
};

export default WysiwygResultButton;
