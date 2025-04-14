"use client";

import styles from "./RatingInput.module.css";
import { STAR_PATH, createStarArray, getAriaLabel, TOTAL_STARS } from "./utils";

interface RatingDisplayProps {
  value: number;
  small?: boolean;
}

export const RatingDisplay = ({ value, small = false }: RatingDisplayProps) => {
  const stars = createStarArray();
  const validValue = Math.min(Math.max(0, value), TOTAL_STARS);

  return (
    <div
      className={styles.container}
      role="img"
      aria-label={getAriaLabel(validValue)}
    >
      {stars.map((star) => (
        <div
          key={star}
          className={styles.starButton}
          data-selected={star <= validValue}
          style={{ pointerEvents: "none" }}
          aria-hidden="true"
        >
          <svg
            className={small ? styles.starSmall : styles.star}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d={STAR_PATH} />
          </svg>
        </div>
      ))}
    </div>
  );
};
