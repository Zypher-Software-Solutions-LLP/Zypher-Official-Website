"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { trackEvent } from "@/integrations/analytics/events";

type BlogViewTrackerProps = {
  slug: string;
};

export function BlogViewTracker({ slug }: BlogViewTrackerProps): ReactNode {
  const hasTracked = useRef(false);

  useEffect(() => {
    function trackBlogView(): void {
      if (hasTracked.current) {
        return;
      }

      hasTracked.current = trackEvent({
        name: "blog_post_viewed",
        properties: { slug },
      });
    }

    trackBlogView();
    window.addEventListener("zypher:analytics-ready", trackBlogView);
    return () => window.removeEventListener("zypher:analytics-ready", trackBlogView);
  }, [slug]);

  return null;
}
