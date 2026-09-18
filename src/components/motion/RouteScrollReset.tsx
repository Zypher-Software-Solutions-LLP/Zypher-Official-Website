"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function RouteScrollReset(): null {
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  useEffect((): void => {
    if (previousPathnameRef.current === pathname) {
      return;
    }

    previousPathnameRef.current = pathname;
    window.scrollTo({ behavior: "auto", left: 0, top: 0 });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}
