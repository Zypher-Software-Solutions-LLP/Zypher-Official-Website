import type { Metadata } from "next";
import { HomePage } from "@/features/home/HomePage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Zypher",
  description:
    "Software development, automation, CRM/ERP, mobile, and UI/UX solutions for teams ready to scale.",
  path: "/",
});

export default function Page(): React.ReactNode {
  return <HomePage />;
}
