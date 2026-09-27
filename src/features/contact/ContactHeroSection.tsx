import Image from "next/image";
import Script from "next/script";
import type { CSSProperties, ReactNode } from "react";

import styles from "./ContactHeroSection.module.css";

const BACKGROUND_ILLUSTRATION_SRC = "/home/section-1/background-illustration.png";
const CONTACT_ILLUSTRATION_SRC =
  "https://media.zypher-solutions.com/contact-us/section-1/3d%20Illustration.png";
const CAL_EMBED_SCRIPT = [
  "(function (C, A, L) {",
  "  let p = function (a, ar) { a.q.push(ar); };",
  "  let d = C.document;",
  "  C.Cal = C.Cal || function () {",
  "    let cal = C.Cal;",
  "    let ar = arguments;",
  "    if (!cal.loaded) {",
  "      cal.ns = {};",
  "      cal.q = cal.q || [];",
  '      d.head.appendChild(d.createElement("script")).src = A;',
  "      cal.loaded = true;",
  "    }",
  "    if (ar[0] === L) {",
  "      const api = function () { p(api, arguments); };",
  "      const namespace = ar[1];",
  "      api.q = api.q || [];",
  '      if (typeof namespace === "string") {',
  "        cal.ns[namespace] = cal.ns[namespace] || api;",
  "        p(cal.ns[namespace], ar);",
  '        p(cal, ["initNamespace", namespace]);',
  "      } else {",
  "        p(cal, ar);",
  "      }",
  "      return;",
  "    }",
  "    p(cal, ar);",
  "  };",
  '})(window, "https://app.cal.com/embed/embed.js", "init");',
  "",
  'Cal("init", "30-minute-discovery-call", { origin: "https://app.cal.com" });',
  "Cal.config = Cal.config || {};",
  "Cal.config.forwardQueryParams = true;",
  'Cal.ns["30-minute-discovery-call"]("inline", {',
  '  elementOrSelector: "#my-cal-inline-30-minute-discovery-call",',
  "  config: {",
  '    layout: "month_view",',
  '    useSlotsViewOnSmallScreen: "true",',
  '    theme: "dark",',
  "  },",
  '  calLink: "zypher-solutions/30-minute-discovery-call",',
  "});",
  'Cal.ns["30-minute-discovery-call"]("ui", {',
  '  theme: "dark",',
  "  hideEventTypeDetails: true,",
  '  layout: "month_view",',
  "});",
].join("\n");

const socialLinks = [
  {
    href: "#",
    label: "Facebook",
    icon: "/footer/facebook.svg",
  },
  {
    href: "https://x.com/ZyphersSolution",
    label: "X",
    icon: "/footer/x.svg",
  },
  {
    href: "https://www.instagram.com/zyphersolutions/",
    label: "Instagram",
    icon: "/footer/instagram.svg",
  },
  {
    href: "https://www.linkedin.com/company/zypher-solutions/",
    label: "LinkedIn",
    icon: "/footer/linkedin.svg",
  },
  {
    href: "https://wa.me/918075725045",
    label: "WhatsApp",
    icon: "/footer/whatsapp.svg",
  },
] as const;

function ContactDetail({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: ReactNode;
}): ReactNode {
  return (
    <div className={styles.contactDetail}>
      <span className={styles.contactDetailLabel}>{label}</span>
      <a className={styles.contactDetailLink} href={href}>
        {children}
      </a>
    </div>
  );
}

export function ContactHeroSection(): ReactNode {
  return (
    <section
      aria-labelledby="contact-hero-title"
      className={styles.contactHero}
      data-layout="12-column"
      data-testid="contact-hero"
    >
      <Image
        alt=""
        aria-hidden="true"
        className={styles.contactHeroBackground}
        fill
        priority
        sizes="100vw"
        src={BACKGROUND_ILLUSTRATION_SRC}
      />

      <div aria-hidden="true" className={styles.contactHeroGridLines}>
        <span />
        <span />
        <span />
      </div>

      <div
        className={styles.contactHeroInner}
        data-motion-intro="true"
        data-testid="contact-hero-grid"
      >
        <div
          className={styles.contactHeroIllustration}
          data-image-quality="100"
          data-image-src={CONTACT_ILLUSTRATION_SRC}
          data-rotation="-8.17deg"
          data-testid="contact-hero-illustration"
        >
          <Image
            alt="Abstract 3D illustration for contacting Zypher"
            fill
            priority
            quality={100}
            sizes="(max-width: 899px) 12rem, 13rem"
            src={CONTACT_ILLUSTRATION_SRC}
          />
        </div>

        <div className={styles.contactHeroCopy}>
          <h1
            className={styles.contactHeroTitle}
            data-testid="contact-hero-title"
            id="contact-hero-title"
          >
            <span>Tell us what you’re building.</span> <span>We’ll take it from there.</span>
          </h1>

          <div className={styles.contactHeroDetails}>
            <ContactDetail href="mailto:info@zypher-solutions.com" label="Email">
              info@zypher-solutions.com
            </ContactDetail>
            <ContactDetail href="tel:+918075725045" label="Phone">
              +91 80757 25045
            </ContactDetail>
          </div>

          <div aria-label="Find us here as well" className={styles.contactHeroSocials} role="group">
            <span className={styles.contactHeroSocialLabel}>Find us here as well</span>
            <div className={styles.contactHeroSocialLinks}>
              {socialLinks.map((socialLink) => (
                <a
                  aria-label={socialLink.label}
                  className={styles.contactHeroSocialLink}
                  href={socialLink.href}
                  key={socialLink.label}
                  rel={socialLink.href === "#" ? undefined : "noreferrer"}
                  target={socialLink.href === "#" ? undefined : "_blank"}
                >
                  <span
                    aria-hidden="true"
                    className={styles.contactHeroSocialIcon}
                    style={
                      {
                        "--contact-social-icon": `url("${socialLink.icon}")`,
                      } as CSSProperties
                    }
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.contactHeroBooking}>
          <p className={styles.contactHeroBookingIntro}>
            No slides, no canned demo, just a real conversation about what you actually need. Pick
            whichever way works for you.
          </p>

          <div className={styles.contactHeroCalFrame}>
            <div
              aria-label="Schedule a 30-minute discovery call"
              className={styles.contactHeroCalWidget}
              data-testid="contact-hero-cal-widget"
              id="my-cal-inline-30-minute-discovery-call"
              role="region"
            />
          </div>
          <link crossOrigin="anonymous" href="https://app.cal.com" rel="preconnect" />
          <link href="https://app.cal.com" rel="dns-prefetch" />
          <link as="script" href="https://app.cal.com/embed/embed.js" rel="preload" />
          <Script id="cal-inline-30-minute-discovery-call" strategy="afterInteractive">
            {CAL_EMBED_SCRIPT}
          </Script>

          <p className={styles.contactHeroFormPrompt}>
            Prefer to write it out first? Use the{" "}
            <span className={styles.contactHeroFormPromptAccent}>Form Below</span>
          </p>
        </div>
      </div>
    </section>
  );
}
