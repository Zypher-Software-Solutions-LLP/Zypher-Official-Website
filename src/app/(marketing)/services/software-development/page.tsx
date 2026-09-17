import type { Metadata } from "next";
import { ServicePage } from "@/features/services/ServicePage";
import { getServiceDefinition } from "@/features/services/service-data";
import { buildPageMetadata } from "@/lib/seo";

const service = getServiceDefinition("software-development");

export const metadata: Metadata = buildPageMetadata({
  title: "Software Development",
  description:
    "Purpose-built software that turns important business workflows into clear products.",
  path: "/services/software-development",
});

export default function SoftwareDevelopmentPage(): React.ReactNode {
  if (!service) return null;
  return <ServicePage service={service} />;
}
