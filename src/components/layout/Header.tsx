"use client";

import Image from "next/image";
import styles from "./Header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { trackEvent } from "@/integrations/analytics/events";
const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Scale", href: "/scale" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

function isNavigationItemActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header(): React.ReactNode {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  function handleNavigation(label: string, destination: string): void {
    trackEvent({
      name: "navigation_clicked",
      properties: { label, destination, location: "header" },
    });
    setMobileOpen(false);
  }

  return (
    <header
      className={styles.siteHeader + " " + styles.siteHeaderCompact}
      data-testid="site-header"
      data-variant="compact"
      data-width="responsive"
    >
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>

      <div className={styles.siteHeaderInner} data-testid="site-header-inner">
        <Link
          aria-label="Zypher Software Solutions home"
          className={styles.siteHeaderBrand}
          href="/"
          onClick={() => handleNavigation("Home", "/")}
        >
          <Image
            alt="Zypher Software Solutions"
            className={styles.siteHeaderLogo}
            data-testid="site-header-logo"
            height={28}
            priority
            src="/brand/Zypher%20Software%20Solutions%20Logo%20Dark.svg"
            width={105}
          />
        </Link>

        <nav
          aria-label="Primary navigation"
          className={styles.siteHeaderNav}
          data-testid="site-header-nav"
        >
          <ul className={styles.siteHeaderNavList} data-testid="site-header-nav-list">
            {navigationItems.map((item) => {
              const isActive = isNavigationItemActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={styles.siteHeaderLink}
                    data-state={isActive ? "active" : "inactive"}
                    href={item.href}
                    onClick={() => handleNavigation(item.label, item.href)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link
          aria-label="Contact Us"
          className={styles.siteHeaderContact}
          href="/contact"
          onClick={() => handleNavigation("Contact", "/contact")}
        >
          Contact Us
        </Link>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          className={styles.siteHeaderMenuButton}
          onClick={() => setMobileOpen((open) => !open)}
          type="button"
        >
          <span
            aria-hidden="true"
            className={styles.siteHeaderMenuIcon}
            data-state={mobileOpen ? "open" : "closed"}
            data-testid="site-header-menu-icon"
          >
            <span className={styles.siteHeaderMenuLine + " " + styles.siteHeaderMenuLineTop} />
            <span className={styles.siteHeaderMenuLine + " " + styles.siteHeaderMenuLineMiddle} />
            <span className={styles.siteHeaderMenuLine + " " + styles.siteHeaderMenuLineBottom} />
          </span>
        </button>
      </div>

      <nav
        aria-hidden={!mobileOpen}
        aria-label="Mobile navigation"
        className={styles.siteHeaderMobileNav}
        data-state={mobileOpen ? "open" : "closed"}
        id="mobile-navigation"
        inert={!mobileOpen}
      >
        <ul className={styles.siteHeaderMobileList}>
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                className={styles.siteHeaderMobileLink}
                href={item.href}
                onClick={() => handleNavigation(item.label, item.href)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              className={styles.siteHeaderMobileContact}
              href="/contact"
              onClick={() => handleNavigation("Contact", "/contact")}
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
