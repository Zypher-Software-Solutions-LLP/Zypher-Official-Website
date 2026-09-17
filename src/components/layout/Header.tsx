"use client";

import Image from "next/image";
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
    <header className="site-header site-header--compact" data-width="responsive">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <div className="site-header__inner">
        <Link
          aria-label="Zypher Software Solutions home"
          className="site-header__brand"
          href="/"
          onClick={() => handleNavigation("Home", "/")}
        >
          <Image
            alt="Zypher Software Solutions"
            className="site-header__logo"
            height={28}
            priority
            src="/brand/Zypher%20Software%20Solutions%20Logo%20Dark.svg"
            width={105}
          />
        </Link>

        <nav aria-label="Primary navigation" className="site-header__nav">
          <ul className="site-header__nav-list">
            {navigationItems.map((item) => {
              const isActive = isNavigationItemActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={`site-header__link${isActive ? " is-active" : ""}`}
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
          className="site-header__contact"
          href="/contact"
          onClick={() => handleNavigation("Contact", "/contact")}
        >
          Contact Us
        </Link>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          className="site-header__menu-button"
          onClick={() => setMobileOpen((open) => !open)}
          type="button"
        >
          <span
            aria-hidden="true"
            className={`site-header__menu-icon${mobileOpen ? " is-open" : ""}`}
          >
            <span className="site-header__menu-line site-header__menu-line--top" />
            <span className="site-header__menu-line site-header__menu-line--middle" />
            <span className="site-header__menu-line site-header__menu-line--bottom" />
          </span>
        </button>
      </div>

      <nav
        aria-hidden={!mobileOpen}
        aria-label="Mobile navigation"
        className={`site-header__mobile-nav ${mobileOpen ? "is-open" : "is-closed"}`}
        id="mobile-navigation"
        inert={!mobileOpen}
      >
        <ul className="site-header__mobile-list">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                className="site-header__mobile-link"
                href={item.href}
                onClick={() => handleNavigation(item.label, item.href)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              className="site-header__mobile-contact"
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
