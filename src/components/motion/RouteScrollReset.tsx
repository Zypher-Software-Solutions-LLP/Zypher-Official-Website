"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

type RouteScrollResetProps = {
  onReset: () => void;
};

export function RouteScrollReset({ onReset }: RouteScrollResetProps): null {
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | null>(null);

  useLayoutEffect((): void => {
    if (previousPathnameRef.current === pathname) {
      return;
    }

    previousPathnameRef.current = pathname;
    onReset();
  }, [onReset, pathname]);

  return null;
}
