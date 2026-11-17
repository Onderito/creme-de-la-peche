"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { collectionLinks } from "@/lib/shopify/collection-pages";

const shopUrl = "https://cremedelapeche.shop";

export function SiteHeader({ home = false }: { home?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [pastHero, setPastHero] = useState(!home);
  const collectionsRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!home) return;
    const hero = document.querySelector(".hero");
    if (!hero) return;
    function update() {
      setPastHero(hero!.getBoundingClientRect().bottom <= (headerRef.current?.offsetHeight ?? 60));
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [home]);

  useEffect(() => {
    if (!menuOpen && !collectionsOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false);
        setCollectionsOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (collectionsOpen) {
          setCollectionsOpen(false);
          collectionsRef.current?.focus();
        } else {
          setMenuOpen(false);
          toggleRef.current?.focus();
        }
      }
    }

    const desktop = window.matchMedia("(min-width: 701px)");
    function onResize() {
      setMenuOpen(false);
      setCollectionsOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [menuOpen, collectionsOpen]);

  return (
    <header ref={headerRef} className={`site-header${home ? " site-header--home" : ""}${pastHero ? " site-header--full" : ""}${menuOpen ? " site-header--menu-open" : ""}`}>
      <Link className="wordmark" href="/" aria-label="Crème de la pêche — home" onClick={() => setMenuOpen(false)}>
        Crème de la pêche
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        <div
          className="collections-menu"
          onPointerEnter={(event) => { if (event.pointerType === "mouse") setCollectionsOpen(true); }}
          onPointerLeave={(event) => { if (event.pointerType === "mouse") setCollectionsOpen(false); }}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setCollectionsOpen(false); }}
        >
          <button ref={collectionsRef} className="collections-link" type="button" aria-expanded={collectionsOpen} aria-controls="desktop-collections" onClick={() => setCollectionsOpen((open) => !open)}>
            Collections
            <svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m3 4.5 3 3 3-3" /></svg>
          </button>
          <div id="desktop-collections" className="collections-panel" hidden={!collectionsOpen}>
            {collectionLinks.map((item) => <Link key={item.href} href={item.href} onClick={() => setCollectionsOpen(false)}>{item.label}</Link>)}
          </div>
        </div>
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
            <div className="mobile-collections-label">Collections</div>
            <div className="mobile-collections-links">{collectionLinks.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}</div>
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
