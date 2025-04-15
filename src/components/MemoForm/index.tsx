"use client";
import { useState } from "react";
import styles from "./MemoForm.module.css";
import { ToggleButtonGroup, Tooltip, IconButton } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import WinLoseButton from "../WinLoseButton";
import { RatingInput } from "../RatingInput";
import { Memo, MAX_MEMO_LENGTH, MAX_MEMOS_PER_SESSION } from "@/types/memo";
import { muiStyles } from "./styles";
import { trackMemoEvent, trackResultEvent } from "@/lib/gtag/gtag";

interface MemoFormProps {
  initialData?: Memo;
  onSave: (updatedMemo: Omit<Memo, "id" | "createdAt">) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  hideRating?: boolean;
  memosCount: number;
}

type MemoFormData = Omit<Memo, "id" | "createdAt">;

const DEFAULT_MEMO_DATA: MemoFormData = {
  title: "",
  result: "WIN",
  rating: 3,
  memo: "",
};

export default function MemoForm({
  initialData,
  onSave,
  onCancel,
  onDelete,
  hideRating = false,
  memosCount,
}: MemoFormProps) {
  const isLimitReached = memosCount >= MAX_MEMOS_PER_SESSION;
  const initialFormData = initialData ?? DEFAULT_MEMO_DATA;
  const [formData, setFormData] = useState<MemoFormData>(initialFormData);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);

    // トラッキングイベントの発火
    if (initialData?.id) {
      trackMemoEvent("edit", initialData.id);
    } else {
      // 新規メモの場合は一時的なIDを生成
      const tempId = new Date().getTime().toString();
      trackMemoEvent("create", tempId);
    }

    // 新規追加フォームの場合は送信後にフォームをリセット
    if (!onCancel && !onDelete) {
      setFormData(DEFAULT_MEMO_DATA);
    }
  };

  const handleResultChange = (
    event: React.MouseEvent<HTMLElement>,
    newResult: Memo["result"] | null,
  ) => {
    if (newResult !== null) {
      setFormData((prev) => ({ ...prev, result: newResult }));

      // 勝敗結果変更時のトラッキング
      const eventId = initialData?.id || new Date().getTime().toString();
      trackResultEvent(newResult.toLowerCase() as "win" | "lose", eventId);
    }
  };

  const handleRatingChange = (newRating: number) => {
    setFormData((prev) => ({ ...prev, rating: newRating }));
  };

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_MEMO_LENGTH) {
      setFormData((prev) => ({ ...prev, memo: newValue }));
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this memo?")) {
      if (initialData?.id) {
        trackMemoEvent("delete", initialData.id);
      }
      onDelete?.();
    }
  };

  return (
    <form
      className={styles.container}
      onSubmit={handleSubmit}
      role="form"
      aria-label="Game result memo form"
    >
      {/* Result selection */}
      <div
        role="group"
        aria-label="Game Result"
        className={styles.formSection}
      >
        <ToggleButtonGroup
          value={formData.result}
          exclusive
          onChange={handleResultChange}
          aria-label="Select game result"
          sx={muiStyles.toggleButtonGroup}
        >
          <WinLoseButton value="WIN" />
          <WinLoseButton value="LOSE" />
        </ToggleButtonGroup>
      </div>

      {/* Rating input */}
      {!hideRating && (
        <div
          role="group"
          aria-label="Performance Rating"
          className={styles.formSection}
          style={{ marginBottom: '8px' }} /* 直接スタイルで調整 */
        >
          <div className={styles.ratingContainer}>
            <RatingInput
              value={formData.rating}
              onChange={handleRatingChange}
              aria-label="Rate your performance from 1 to 5 stars"
            />
            <Tooltip title="Rate your performance in this game from 1 to 5 stars">
              <IconButton
                size="small"
                aria-label="rating help"
                sx={{
                  marginLeft: '12px',
                  padding: '4px',
                  color: '#FFFFFF',
                  width: '24px',
                  height: '24px',
                  minHeight: '24px'
                }}
              >
                <HelpOutlineIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Memo input */}
      <div
        role="group"
        aria-labelledby="memo-label"
        style={{ marginTop: '8px' }} /* 直接スタイルで調整 */
      >
        <label id="memo-label" className={styles.visuallyHidden}>
          Game Memo
        </label>
        <div className={styles.memoInputContainer}>
          <textarea
            className={styles.textarea}
            placeholder="e.g., Opponent used defensive playstyle, counter with aggressive approach..."
            value={formData.memo}
            onChange={handleMemoChange}
            aria-label="Game memo text"
            maxLength={MAX_MEMO_LENGTH}
          />
          <div className={styles.charCount}>
            {formData.memo.length}/{MAX_MEMO_LENGTH}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {isLimitReached && !initialData && (
        <div className={styles.limitMessage}>
          Cannot add more memos. Maximum limit of {MAX_MEMOS_PER_SESSION} memos reached.
        </div>
      )}

      <div className={styles.actions} role="group" aria-label="Form actions">
        <button
          type="submit"
          className={`${styles.btn} ${styles.btnSave}`}
          aria-label="Save memo"
          disabled={isLimitReached && !initialData}
        >
          Save
        </button>
        {onCancel && (
          <button
            type="button"
            className={`${styles.btn} ${styles.btnCancel}`}
            onClick={onCancel}
            aria-label="Cancel editing"
          >
            Cancel
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            className={`${styles.btn} ${styles.btnDelete}`}
            onClick={handleDelete}
            aria-label="Delete memo"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
