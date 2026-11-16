"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const shopUrl = "https://cremedelapeche.shop";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    }

    const desktop = window.matchMedia("(min-width: 701px)");
    function onResize(event: MediaQueryListEvent) {
      if (event.matches) setMenuOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [menuOpen]);

  return (
    <header ref={headerRef} className={`site-header${menuOpen ? " site-header--menu-open" : ""}`}>
      <Link className="wordmark" href="/" aria-label="Crème de la pêche — home" onClick={() => setMenuOpen(false)}>
        Crème de la pêche
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        <Link className="collections-link" href="/#collections">
          Collections
          <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="m3 4.5 3 3 3-3" />
          </svg>
        </Link>
        <Link href="/#charlotte">My story</Link>
      </nav>
      <div className="shop-nav">
        <div className="mobile-menu">
          <button
            ref={toggleRef}
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path className="menu-line menu-line--top" d="M4 8h16" />
              <path className="menu-line menu-line--bottom" d="M4 16h16" />
            </svg>
          </button>
          <nav id="mobile-navigation" className="mobile-menu-panel" aria-label="Mobile navigation" hidden={!menuOpen}>
            <Link href="/#collections" onClick={() => setMenuOpen(false)}>Collections</Link>
            <Link href="/#charlotte" onClick={() => setMenuOpen(false)}>My story</Link>
            <a href={`${shopUrl}/account`} onClick={() => setMenuOpen(false)}>Account</a>
          </nav>
        </div>
        <a className="desktop-account" href={`${shopUrl}/account`}>Account</a>
        <Link className="cart-link" href="/cart">Cart</Link>
      </div>
    </header>
  );
}
