export const STAR_PATH =
  "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

export const TOTAL_STARS = 5;

export const createStarArray = (length: number = TOTAL_STARS) =>
  Array.from({ length }, (_, index) => index + 1);

export const getAriaLabel = (value: number, isInput: boolean = false) =>
  isInput ? "Rating (1-5 stars)" : `Rating: ${value} out of 5`;
