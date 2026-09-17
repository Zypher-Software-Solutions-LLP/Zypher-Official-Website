import Image from "next/image";
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

const footerIllustrationSrc =
  "https://media.zypher-solutions.com/footer/Footer%20Illustration.png?v=2";

function FooterLinkItem({ link }: { link: FooterLink }): ReactNode {
  if (link.external) {
    return (
      <a className="site-footer__link" href={link.href}>
        {link.label}
      </a>
    );
  }

  return (
    <Link className="site-footer__link" href={link.href}>
      {link.label}
    </Link>
  );
}

export function Footer(): ReactNode {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div className="site-footer__brand">
          <Link
            aria-label="Zypher Software Solutions home"
            className="site-footer__logo-link"
            href="/"
          >
            <Image
              alt="Zypher Software Solutions"
              className="site-footer__logo"
              height={575}
              src="/brand/Zypher%20Software%20Solutions%20Logo%20Dark.svg"
              width={2085}
            />
          </Link>
          <p className="site-footer__tagline">
            <span>Your vision</span>
            <span>Our code</span>
          </p>
          <p className="site-footer__description">
            A software agency building tailored systems for businesses across UAE, Qatar, USA, UK,
            India, Netherlands &amp; More.
          </p>
          <p className="site-footer__location">Headquartered in Calicut, Kerala</p>

          <div aria-label="Social links" className="site-footer__socials">
            {footerSocialLinks.map((social) => {
              const iconStyle = {
                "--site-footer-icon": `url("${social.iconSrc}")`,
              } as SocialIconStyle;

              return (
                <a
                  aria-label={social.label}
                  className="site-footer__social-link"
                  href={social.href}
                  key={social.label}
                  rel={social.href === "#" ? undefined : "noreferrer"}
                  target={social.href === "#" ? undefined : "_blank"}
                >
                  <span aria-hidden="true" className="site-footer__social-icon" style={iconStyle} />
                </a>
              );
            })}
          </div>
        </div>

        <nav aria-label="Footer navigation" className="site-footer__nav">
          {footerGroups.map((group) => (
            <section className="site-footer__group" key={group.title}>
              <h2 className="site-footer__group-title">{group.title}</h2>
              <ul className="site-footer__link-list">
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

      <div className="site-footer__meta">
        <div className="site-footer__meta-inner">
          <p className="site-footer__copyright">© {currentYear} Zypher Software Solutions LLP.</p>
          <nav aria-label="Utility navigation" className="site-footer__utility">
            <Link className="site-footer__utility-link" href="/privacy-policy">
              Privacy
            </Link>
            <span aria-hidden="true">•</span>
            <Link className="site-footer__utility-link" href="/terms-of-service">
              Terms
            </Link>
            <span aria-hidden="true">•</span>
            <Link className="site-footer__utility-link" href="/cookie-policy">
              Cookies
            </Link>
            <span aria-hidden="true">•</span>
            <Link className="site-footer__utility-link" href="/careers">
              Careers
            </Link>
            <span aria-hidden="true">•</span>
            <CookieSettingsButton className="site-footer__settings" />
          </nav>
        </div>
      </div>

      <div aria-hidden="true" className="site-footer__illustration">
        <Image
          alt=""
          className="site-footer__illustration-image"
          fill
          sizes="100vw"
          src={footerIllustrationSrc}
        />
      </div>
    </footer>
  );
}
