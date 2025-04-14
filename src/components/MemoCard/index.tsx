"use client";
import styles from "./MemoCard.module.css";
import { RatingDisplay } from "../RatingInput/RatingDisplay";
import { Memo } from "@/types/memo";

interface MemoCardProps {
  result: Memo["result"];
  rating: number;
  memo: string;
  onEditClick: () => void;
  hideRating?: boolean;
}

const DEFAULT_PROPS = {
  result: "WIN" as const,
  rating: 0,
  memo: "",
} satisfies Partial<MemoCardProps>;

export default function MemoCard({
  result = DEFAULT_PROPS.result,
  rating = DEFAULT_PROPS.rating,
  memo,
  onEditClick,
  hideRating = false,
}: MemoCardProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      onEditClick();
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    element.style.transform = "scale(0.98)";
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    element.style.transform = "";
  };

  const handleTouchCancel = (e: React.TouchEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    element.style.transform = "";
  };

  return (
    <div className={styles.cardWrapper}>
      <div
        className={styles.card}
        onClick={onEditClick}
        onKeyPress={handleKeyPress}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        role="button"
        tabIndex={0}
        aria-label={`Edit ${result} record`}
      >
        <div className={styles.cardHeader}>
          <div className={`${styles.resultBadge} ${styles[result.toLowerCase()]}`}>
            {result}
          </div>
          {!hideRating && (
            <div className={styles.ratingContainer}>
              <RatingDisplay value={rating} small={true} />
            </div>
          )}
        </div>
        <div className={styles.cardContent}>
          <p className={styles.memo}>{memo || "(No memo)"}</p>
        </div>
      </div>
    </div>
  );
}
