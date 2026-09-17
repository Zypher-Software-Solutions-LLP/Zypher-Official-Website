import type { Metadata } from "next";
import { ServicePage } from "@/features/services/ServicePage";
import { getServiceDefinition } from "@/features/services/service-data";
import { buildPageMetadata } from "@/lib/seo";

const service = getServiceDefinition("crm-erp-solutions");

export const metadata: Metadata = buildPageMetadata({
  title: "CRM/ERP Solutions",
  description: "Connected operational systems that give teams better visibility and control.",
  path: "/services/crm-erp-solutions",
});

export default function CrmErpSolutionsPage(): React.ReactNode {
  if (!service) return null;
  return <ServicePage service={service} />;
}
