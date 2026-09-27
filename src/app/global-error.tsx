"use client";

import { useEffect, type ReactElement } from "react";
import ErrorRecovery from "./ErrorRecovery";

type GlobalAppError = Error & { digest?: string };

export default function GlobalError({
  error,
  reset,
}: {
  error: GlobalAppError;
  reset: () => void;
}): ReactElement {
  useEffect(() => {
    console.error(
      JSON.stringify({ event: "global_render_error", digest: error.digest ?? "unknown" }),
    );
  }, [error]);

  return (
    <html lang="en">
      <body>
        <ErrorRecovery onRetry={reset} />
      </body>
    </html>
  );
}
