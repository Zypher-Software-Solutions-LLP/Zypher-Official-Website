import type { ReactNode } from "react";
import styles from "./ArrowIcon.module.css";

type ArrowDirection = "left" | "right" | "north-east";

type ArrowIconProps = {
  direction?: ArrowDirection;
};

const PATHS: Record<ArrowDirection, string> = {
  left: "M13 8H3m4.5-4.5L3 8l4.5 4.5",
  right: "M3 8h10m-4.5-4.5L13 8l-4.5 4.5",
  "north-east": "M4 12 12 4m-5.5 0H12v5.5",
};

export function ArrowIcon({ direction = "right" }: ArrowIconProps): ReactNode {
  return (
    <svg
      aria-hidden="true"
      className={styles.arrowIcon}
      fill="none"
      focusable="false"
      viewBox="0 0 16 16"
    >
      <path
        d={PATHS[direction]}
        pathLength="1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
