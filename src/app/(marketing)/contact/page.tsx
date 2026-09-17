import type { Metadata } from "next";
import { ContactForm } from "@/features/contact/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: "Tell Zypher what you are building, improving, or trying to solve.",
  path: "/contact",
});

export default function ContactPage(): React.ReactNode {
  return (
    <main id="main-content">
      <section className="border-b border-mist-300/10">
        <div className="site-container py-24 sm:py-32">
          <SectionHeading
            eyebrow="Contact Zypher"
            title="Let’s make the next step clearer."
            description="Tell us what is changing in your business and where you need a thoughtful software partner."
          />
        </div>
      </section>
      <section className="site-container grid gap-12 py-20 lg:grid-cols-[0.7fr_1.3fr] lg:py-28">
        <div>
          <p className="text-sm leading-7 text-mist-300">
            Share enough context for us to understand the opportunity. We will use your information
            only to respond to this enquiry.
          </p>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
