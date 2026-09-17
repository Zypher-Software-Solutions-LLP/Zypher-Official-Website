import { Hanken_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { ConsentManager } from "@/components/privacy/ConsentManager";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";
import "@/styles/globals.css";

const hankenGrotesk = Hanken_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
});

export const metadata = buildPageMetadata({
  title: "Zypher",
  description:
    "Software development, automation, CRM/ERP, mobile, and UI/UX solutions for teams ready to scale.",
  path: "/",
});

export default function RootLayout({ children }: { children: ReactNode }): ReactNode {
  return (
    <html data-scroll-behavior="smooth" lang="en">
      <body className={hankenGrotesk.variable} suppressHydrationWarning>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <MotionProvider>{children}</MotionProvider>
        <ConsentManager />
      </body>
    </html>
  );
}
