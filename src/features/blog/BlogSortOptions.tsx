"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { BlogSort } from "@/integrations/cms/sanity/types";
import styles from "./BlogList.module.css";

const sortOptions: ReadonlyArray<{ label: string; value: BlogSort }> = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

type BlogSortOptionsProps = {
  basePath: string;
  value: BlogSort;
  interactive?: boolean;
  onValueChange?: (value: BlogSort) => void;
};

function getSortHref(basePath: string, value: BlogSort): string {
  return value === "oldest" ? `${basePath}?sort=oldest` : basePath;
}

export function BlogSortOptions({
  basePath,
  value,
  interactive = false,
  onValueChange,
}: BlogSortOptionsProps): ReactNode {
  return (
    <nav aria-label="Sort blog posts" className={styles.sortControl}>
      <span className={styles.sortLabel}>Sort by:</span>
      <div className={styles.sortOptions}>
        {sortOptions.map((option) => {
          const className = `${styles.sortOption} ${option.value === value ? styles.sortOptionActive : ""}`;

          if (interactive) {
            return (
              <button
                aria-pressed={option.value === value}
                className={className}
                key={option.value}
                onClick={() => onValueChange?.(option.value)}
                type="button"
              >
                {option.label}
              </button>
            );
          }

          return (
            <Link
              aria-current={option.value === value ? "page" : undefined}
              className={className}
              href={getSortHref(basePath, option.value)}
              key={option.value}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
