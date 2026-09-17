import type { Metadata } from "next";
import { ServicePage } from "@/features/services/ServicePage";
import { getServiceDefinition } from "@/features/services/service-data";
import { buildPageMetadata } from "@/lib/seo";

const service = getServiceDefinition("ai-llm-automation");

export const metadata: Metadata = buildPageMetadata({
  title: "AI & LLM Automation",
  description: "Practical AI and automation systems designed around your team’s real work.",
  path: "/services/ai-llm-automation",
});

export default function AiLlmAutomationPage(): React.ReactNode {
  if (!service) return null;
  return <ServicePage service={service} />;
}
