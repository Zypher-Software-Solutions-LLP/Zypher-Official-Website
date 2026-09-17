import type { Metadata } from "next";
import { ServicePage } from "@/features/services/ServicePage";
import { getServiceDefinition } from "@/features/services/service-data";
import { buildPageMetadata } from "@/lib/seo";

const service = getServiceDefinition("mobile-app-development");

export const metadata: Metadata = buildPageMetadata({
  title: "Mobile App Development",
  description: "Focused mobile apps that make your product and operations easier to access.",
  path: "/services/mobile-app-development",
});

export default function MobileAppDevelopmentPage(): React.ReactNode {
  if (!service) return null;
  return <ServicePage service={service} />;
}
