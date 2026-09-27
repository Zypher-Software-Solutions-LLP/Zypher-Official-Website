"use client";

import { useEffect, type ReactElement } from "react";
import ErrorRecovery from "./ErrorRecovery";

type AppError = Error & { digest?: string };

export default function Error({
  error,
  reset,
}: {
  error: AppError;
  reset: () => void;
}): ReactElement {
  useEffect(() => {
    console.error(JSON.stringify({ event: "app_render_error", digest: error.digest ?? "unknown" }));
  }, [error]);

  return <ErrorRecovery onRetry={reset} />;
}
