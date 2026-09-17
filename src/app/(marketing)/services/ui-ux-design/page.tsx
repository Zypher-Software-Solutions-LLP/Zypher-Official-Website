import type { Metadata } from "next";
import { ServicePage } from "@/features/services/ServicePage";
import { getServiceDefinition } from "@/features/services/service-data";
import { buildPageMetadata } from "@/lib/seo";

const service = getServiceDefinition("ui-ux-design");

export const metadata: Metadata = buildPageMetadata({
  title: "UI/UX Design",
  description: "Clear product experiences that help people understand, choose, and act.",
  path: "/services/ui-ux-design",
});

export default function UiUxDesignPage(): React.ReactNode {
  if (!service) return null;
  return <ServicePage service={service} />;
}
