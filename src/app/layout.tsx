import localFont from "next/font/local";
import { Hanken_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { ConsentManager } from "@/components/privacy/ConsentManager";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";
import "@/styles/globals.css";

const generalSans = localFont({
  display: "swap",
  src: [
    {
      path: "../../public/fonts/GeneralSans-Regular.otf",
      style: "normal",
      weight: "400",
    },
    {
      path: "../../public/fonts/GeneralSans-Medium.otf",
      style: "normal",
      weight: "500",
    },
    {
      path: "../../public/fonts/GeneralSans-Semibold.otf",
      style: "normal",
      weight: "600",
    },
    {
      path: "../../public/fonts/GeneralSans-Bold.otf",
      style: "normal",
      weight: "700",
    },
  ],
  variable: "--font-general-sans",
});

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
      <body
        className={hankenGrotesk.variable + " " + generalSans.variable}
        suppressHydrationWarning
      >
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <MotionProvider>{children}</MotionProvider>
        <ConsentManager />
      </body>
    </html>
  );
}
