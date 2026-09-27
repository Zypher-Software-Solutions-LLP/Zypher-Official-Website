export {};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          action?: string;
          appearance?: "always" | "execute" | "interaction-only";
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}
