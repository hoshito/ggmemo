import { ChangeEvent, forwardRef, Ref } from "react";
import styles from "./TitleInput.module.css";

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}

const TitleInput = forwardRef(({
  value,
  onChange,
  onBlur,
  placeholder = "Enter title...",
  className,
  "aria-label": ariaLabel = "Title",
}: TitleInputProps, ref: Ref<HTMLInputElement>) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 100) {
      onChange(newValue);
    }
  };

  return (
    <div className={styles.titleInputContainer}>
      <input
        type="text"
        className={`${styles.titleInput} ${className || ""}`}
        value={value}
        maxLength={100}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-label={ariaLabel}
        ref={ref}
      />
      <span className={styles.characterCount}>{value.length}/100</span>
    </div>
  );
});

TitleInput.displayName = "TitleInput";

export default TitleInput;
