"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { trackEvent } from "@/integrations/analytics/events";
import styles from "./Header.module.css";

type NavigationItem = {
  label: string;
  href: string;
  children?: readonly NavigationItem[];
};

const serviceNavigationItems: readonly NavigationItem[] = [
  { label: "AI & LLM Automation", href: "/services/ai-llm-automation" },
  { label: "Software Development", href: "/services/software-development" },
  { label: "Mobile App Development", href: "/services/mobile-app-development" },
  { label: "CRM/ERP Solutions", href: "/services/crm-erp-solutions" },
  { label: "Design & Creative", href: "/services/design-creative" },
];

const navigationItems: readonly NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", children: serviceNavigationItems },
  { label: "Work", href: "/work" },
  { label: "Scale", href: "/scale" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

function isNavigationItemActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === href : pathname === href || pathname.startsWith(href + "/");
}

export function Header(): React.ReactNode {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = usePathname();

  function handleNavigation(label: string, destination: string): void {
    trackEvent({
      name: "navigation_clicked",
      properties: { label, destination, location: "header" },
    });
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }

  function handleMobileMenuToggle(): void {
    setMobileOpen((open) => !open);
    setMobileServicesOpen(false);
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

              if (!item.children) {
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
              }

              return (
                <li className={styles.siteHeaderNavItemWithMenu} key={item.href}>
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    aria-haspopup="true"
                    className={styles.siteHeaderLink}
                    data-state={isActive ? "active" : "inactive"}
                    href={item.href}
                    onClick={() => handleNavigation(item.label, item.href)}
                  >
                    {item.label}
                    <span aria-hidden="true" className={styles.siteHeaderLinkCaret} />
                  </Link>

                  <div
                    aria-label="Services pages"
                    className={styles.siteHeaderSubmenu}
                    data-testid="site-header-services-submenu"
                  >
                    <div className={styles.siteHeaderSubmenuPanel}>
                      {item.children.map((child) => {
                        const isChildActive = isNavigationItemActive(pathname, child.href);

                        return (
                          <Link
                            aria-current={isChildActive ? "page" : undefined}
                            className={styles.siteHeaderSubmenuLink}
                            data-state={isChildActive ? "active" : "inactive"}
                            href={child.href}
                            key={child.href}
                            onClick={() => handleNavigation(child.label, child.href)}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
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
          onClick={handleMobileMenuToggle}
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
          {navigationItems.map((item) => {
            const isActive = isNavigationItemActive(pathname, item.href);

            if (!item.children) {
              return (
                <li key={item.href}>
                  <Link
                    className={styles.siteHeaderMobileLink}
                    data-state={isActive ? "active" : "inactive"}
                    href={item.href}
                    onClick={() => handleNavigation(item.label, item.href)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }

            return (
              <li className={styles.siteHeaderMobileServiceItem} key={item.href}>
                <button
                  aria-controls="mobile-services-submenu"
                  aria-expanded={mobileServicesOpen}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    styles.siteHeaderMobileLink + " " + styles.siteHeaderMobileServiceTrigger
                  }
                  data-state={isActive ? "active" : "inactive"}
                  onClick={() => setMobileServicesOpen((open) => !open)}
                  type="button"
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={styles.siteHeaderMobileLinkCaret}
                    data-state={mobileServicesOpen ? "open" : "closed"}
                  />
                </button>
                <div
                  aria-label="Services pages"
                  aria-hidden={!mobileServicesOpen}
                  className={styles.siteHeaderMobileSubmenu}
                  data-testid="site-header-mobile-services-submenu"
                  id="mobile-services-submenu"
                  inert={!mobileServicesOpen}
                  data-state={mobileServicesOpen ? "open" : "closed"}
                >
                  <div className={styles.siteHeaderMobileSubmenuContent}>
                    <Link
                      aria-current={isActive && pathname === item.href ? "page" : undefined}
                      className={styles.siteHeaderMobileSubmenuLink}
                      data-state={pathname === item.href ? "active" : "inactive"}
                      href={item.href}
                      onClick={() => handleNavigation("All Services", item.href)}
                    >
                      All Services
                    </Link>
                    {item.children.map((child) => {
                      const isChildActive = isNavigationItemActive(pathname, child.href);

                      return (
                        <Link
                          aria-current={isChildActive ? "page" : undefined}
                          className={styles.siteHeaderMobileSubmenuLink}
                          data-state={isChildActive ? "active" : "inactive"}
                          href={child.href}
                          key={child.href}
                          onClick={() => handleNavigation(child.label, child.href)}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </li>
            );
          })}
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
