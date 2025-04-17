"use client";

import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import styles from './ResultBadgeView.module.css';
import { useState, useRef, useEffect } from 'react';

/**
 * 勝敗バッジを表示するコンポーネント
 * TipTapのNodeView実装
 * クリックで編集モード、ダブルクリックで結果を切り替え
 */
const ResultBadgeView = ({ node, updateAttributes }: NodeViewProps) => {
  const result = node.attrs.result as 'WIN' | 'LOSE';
  const [isEditing, setIsEditing] = useState(false);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupStyle, setPopupStyle] = useState({});


  useEffect(() => {
    // ポップアップのポジショニングを計算
    if (isEditing && badgeRef.current && popupRef.current) {
      const badgeRect = badgeRef.current.getBoundingClientRect();

      // 画面上部からのスペースと画面中央からの位置を計算
      const spaceFromTop = badgeRect.top;
      const viewportHeight = window.innerHeight;
      const isInUpperHalf = spaceFromTop < (viewportHeight / 2);

      // 画面の上半分にある場合は下に表示、下半分にある場合は上に表示
      setPopupStyle(isInUpperHalf
        ? { top: '100%', left: '0', marginTop: '5px' }
        : { bottom: '100%', left: '0', marginBottom: '5px' });
    }
  }, [isEditing]);

  const toggleResult = () => {
    // 現在の結果を反転
    const newResult = result === 'WIN' ? 'LOSE' : 'WIN';
    updateAttributes({ result: newResult });
    setIsEditing(false);
  };

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleResultUpdate = (newResult: 'WIN' | 'LOSE') => {
    updateAttributes({ result: newResult });
    setIsEditing(false);
  };

  return (
    <NodeViewWrapper as="span" className="react-component">
      {isEditing ? (
        <div className={styles.editingContainer} ref={popupRef} style={popupStyle}>
          <button
            className={`${styles.editButton} ${styles.winButton}`}
            onClick={() => handleResultUpdate('WIN')}
          >
            WIN
          </button>
          <button
            className={`${styles.editButton} ${styles.loseButton}`}
            onClick={() => handleResultUpdate('LOSE')}
          >
            LOSE
          </button>
          <button
            className={styles.cancelButton}
            onClick={() => setIsEditing(false)}
          >
            ✕
          </button>
        </div>
      ) : (
        <span
          className={`${styles.resultBadge} ${styles[result.toLowerCase()]}`}
          contentEditable={false}
          data-result={result}
          data-type="result-badge"
          onClick={handleClick}
          onDoubleClick={toggleResult}
          title="Click to edit, double-click to toggle"
          ref={badgeRef}
        >
          {result}
        </span>
      )}
    </NodeViewWrapper>
  );
};

export default ResultBadgeView;
