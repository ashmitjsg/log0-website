"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import Button from "./ui/Button";
import GitHubIcon from "./icons/GitHub";
import { links } from "@/lib/links";

const navLinks = [
  { label: "Documentation", href: links.docs },
  { label: "Blog", href: links.blog },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Scroll-aware border + backdrop
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled || menuOpen
            ? "border-b border-white/10 bg-[#020617]/90 shadow-[0_4px_60px_0_rgba(0,0,0,0.9)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        ].join(" ")}
      >
        <div className="container flex items-center justify-between py-4">
          {/* Left — logo + desktop nav */}
          <div className="flex items-center gap-10">
            <a
              href="/"
              aria-label="log0 homepage"
              onClick={close}
              className="group"
            >
              <Logo
                variant="line"
                className="text-3xl text-white/70 transition-colors duration-200 group-hover:text-emerald-400"
              />
            </a>

            <nav aria-label="Main navigation">
              <ul className="hidden items-center gap-6 lg:flex" role="list">
                {navLinks.map(({ label, href }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="rounded-sm text-base font-normal tracking-[-0.02em] text-neutral-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617]"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right — CTA + hamburger */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <Button
                variant="primary"
                size="sm"
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contribute on GitHub"
              >
                <GitHubIcon />
                Contribute
              </Button>
            </div>

            {/* Hamburger — hidden on lg+ */}
            <button
              className="relative flex size-8 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 lg:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className="sr-only">
                {menuOpen ? "Close menu" : "Open menu"}
              </span>
              <div className="relative h-5 w-5">
                {/* Top bar */}
                <span
                  className={[
                    "absolute left-0 block h-0.5 w-5 rounded-full bg-white transition-all duration-300",
                    menuOpen ? "top-2.25 rotate-45" : "top-1 rotate-0",
                  ].join(" ")}
                />
                {/* Bottom bar */}
                <span
                  className={[
                    "absolute left-0 block h-0.5 w-5 rounded-full bg-white transition-all duration-300",
                    menuOpen ? "top-2.25 -rotate-45" : "top-1.25 rotate-0",
                  ].join(" ")}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav panel */}
      <div
        id="mobile-nav"
        ref={menuRef}
        aria-hidden={!menuOpen}
        className={[
          "fixed inset-x-0 bottom-0 top-14.25 z-40 overflow-y-auto transition-all duration-200 lg:hidden",
          "bg-[radial-gradient(41.3%_17.62%_at_50%_0%,#0D1E1D_0%,#0A0A0A_100%)]",
          menuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        ].join(" ")}
      >
        <nav aria-label="Mobile navigation" className="container">
          <ul
            role="list"
            className="mt-8 flex flex-col gap-6 text-base font-normal tracking-[-0.02em] text-neutral-400"
          >
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={close}
                  className="block transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="my-6 border-t border-white/10" />

          <div className="flex justify-center">
            <Button
              variant="primary"
              size="md"
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contribute on GitHub"
              onClick={close}
            >
              <GitHubIcon />
              Contribute
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
