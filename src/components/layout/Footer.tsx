import Image from "next/image";
import styles from "./Footer.module.css";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { CookieSettingsButton } from "@/components/privacy/CookieSettingsButton";
type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterLinkGroup = {
  title: string;
  links: readonly FooterLink[];
};

type FooterSocialLink = {
  label: string;
  href: string;
  iconSrc: string;
};

type SocialIconStyle = CSSProperties & {
  "--site-footer-icon": string;
};

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Work", href: "/work" },
      { label: "Scale", href: "/scale" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "AI & LLM Autom.", href: "/services/ai-llm-automation" },
      { label: "Software / Website Dev", href: "/services/software-development" },
      { label: "Mobile App Dev.", href: "/services/mobile-app-development" },
      { label: "CRM/ERP Solutions", href: "/services/crm-erp-solutions" },
      { label: "Digital Marketing", href: "/contact" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Book Call", href: "/contact" },
      { label: "Project Inquiry", href: "/contact" },
      {
        label: "info@zypher-solutions.com",
        href: "mailto:info@zypher-solutions.com",
        external: true,
      },
      { label: "+91 80757 25045", href: "tel:+918075725045", external: true },
    ],
  },
] as const satisfies readonly FooterLinkGroup[];

const footerSocialLinks = [
  { label: "Facebook", href: "#", iconSrc: "/footer/facebook.svg" },
  {
    label: "X",
    href: "https://x.com/ZyphersSolution",
    iconSrc: "/footer/x.svg",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/zyphersolutions/",
    iconSrc: "/footer/instagram.svg",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/zypher-solutions/",
    iconSrc: "/footer/linkedin.svg",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/918075725045",
    iconSrc: "/footer/whatsapp.svg",
  },
] as const satisfies readonly FooterSocialLink[];

const footerIllustrationSrc = "https://media.zypher-solutions.com/footer/Footer%20Illustration.png";

function FooterLinkItem({ link }: { link: FooterLink }): ReactNode {
  if (link.external) {
    return (
      <a className={styles.siteFooterLink} href={link.href}>
        {link.label}
      </a>
    );
  }

  return (
    <Link className={styles.siteFooterLink} href={link.href}>
      {link.label}
    </Link>
  );
}

export function Footer(): ReactNode {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.siteFooter} data-testid="site-footer">
      <div className={styles.siteFooterMain} data-testid="site-footer-main">
        <div className={styles.siteFooterBrand}>
          <Link
            aria-label="Zypher Software Solutions home"
            className={styles.siteFooterLogoLink}
            href="/"
          >
            <Image
              alt="Zypher Software Solutions"
              className={styles.siteFooterLogo}
              height={575}
              src="/brand/Zypher%20Software%20Solutions%20Logo%20Dark.svg"
              width={2085}
            />
          </Link>
          <p className={styles.siteFooterTagline}>
            <span>Your vision</span>
            <span>Our code</span>
          </p>
          <p className={styles.siteFooterDescription}>
            A software agency building tailored systems for businesses across UAE, Qatar, USA, UK,
            India, Netherlands &amp; More.
          </p>
          <p className={styles.siteFooterLocation}>Headquartered in Calicut, Kerala</p>

          <div aria-label="Social links" className={styles.siteFooterSocials}>
            {footerSocialLinks.map((social) => {
              const iconStyle = {
                "--site-footer-icon": `url("${social.iconSrc}")`,
              } as SocialIconStyle;

              return (
                <a
                  aria-label={social.label}
                  className={styles.siteFooterSocialLink}
                  href={social.href}
                  key={social.label}
                  rel={social.href === "#" ? undefined : "noreferrer"}
                  target={social.href === "#" ? undefined : "_blank"}
                >
                  <span
                    aria-hidden="true"
                    className={styles.siteFooterSocialIcon}
                    style={iconStyle}
                  />
                </a>
              );
            })}
          </div>
        </div>

        <nav aria-label="Footer navigation" className={styles.siteFooterNav}>
          {footerGroups.map((group) => (
            <section className={styles.siteFooterGroup} key={group.title}>
              <h2 className={styles.siteFooterGroupTitle}>{group.title}</h2>
              <ul className={styles.siteFooterLinkList}>
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </div>

      <div className={styles.siteFooterMeta} data-testid="site-footer-meta">
        <div className={styles.siteFooterMetaInner}>
          <p className={styles.siteFooterCopyright}>
            © {currentYear} Zypher Software Solutions LLP.
          </p>
          <nav aria-label="Utility navigation" className={styles.siteFooterUtility}>
            <Link className={styles.siteFooterUtilityLink} href="/privacy-policy">
              Privacy
            </Link>
            <span aria-hidden="true">•</span>
            <Link className={styles.siteFooterUtilityLink} href="/terms-of-service">
              Terms
            </Link>
            <span aria-hidden="true">•</span>
            <Link className={styles.siteFooterUtilityLink} href="/cookie-policy">
              Cookies
            </Link>
            <span aria-hidden="true">•</span>
            <Link className={styles.siteFooterUtilityLink} href="/careers">
              Careers
            </Link>
            <span aria-hidden="true">•</span>
            <CookieSettingsButton className={styles.siteFooterSettings} />
          </nav>
        </div>
      </div>

      <div
        aria-hidden="true"
        className={styles.siteFooterIllustration}
        data-image-src={footerIllustrationSrc}
        data-testid="site-footer-illustration"
      >
        <Image
          alt=""
          className={styles.siteFooterIllustrationImage}
          fill
          sizes="100vw"
          src={footerIllustrationSrc}
        />
      </div>
    </footer>
  );
}
