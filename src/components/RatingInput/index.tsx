"use client";

import { useState } from "react";
import styles from "./RatingInput.module.css";
import { STAR_PATH, createStarArray, getAriaLabel } from "./utils";

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
}

export const RatingInput = ({ value, onChange }: RatingInputProps) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const stars = createStarArray();

  const handleClick = (star: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    onChange(star);
  };

  const handleMouseEnter = (star: number) => () => {
    setHoveredRating(star);
  };

  const handleMouseLeave = () => {
    setHoveredRating(null);
  };

  return (
    <div
      className={styles.container}
      onMouseLeave={handleMouseLeave}
      role="group"
      aria-label={getAriaLabel(value, true)}
    >
      {stars.map((star) => (
        <button
          key={star}
          className={styles.starButton}
          type="button"
          onClick={handleClick(star)}
          onMouseEnter={handleMouseEnter(star)}
          data-selected={star <= value}
          data-hovered={star <= (hoveredRating ?? 0)}
          aria-label={`${star}星`}
        >
          <svg
            className={styles.star}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d={STAR_PATH} />
          </svg>
        </button>
      ))}
    </div>
  );
};
