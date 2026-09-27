import type { Metadata } from "next";
import { ContactHeroSection } from "@/features/contact/ContactHeroSection";
import { ContactInquirySection } from "@/features/contact/ContactInquirySection";
import { ContactProcessSection } from "@/features/contact/ContactProcessSection";
import { getStaticPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("/contact");
}

export default function ContactPage(): React.ReactNode {
  return (
    <main id="main-content">
      <ContactHeroSection />
      <ContactInquirySection />
      <ContactProcessSection />
    </main>
  );
}
