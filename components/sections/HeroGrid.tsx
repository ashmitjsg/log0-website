"use client";

import { useEffect, useState } from "react";

// bg-hero/4 ≈ rgba(255,255,255,0.04)  |  bg-hero/6 ≈ rgba(255,255,255,0.06)
const C4 = "rgba(255, 255, 255, 0.04)";

// Build a "to bottom" linear-gradient:
//   grad(75)      → solid 0-75%, fade to transparent 75-100%   (cmw-1353, 1128)
//   grad(75, 90)  → solid 0-75%, fade to transparent 75-90%    (681)
//   grad(60, 90)  → solid 0-60%, fade to transparent 60-90%    (905)
const grad = (from: number, to?: number) =>
  to
    ? `linear-gradient(to bottom, ${C4} ${from}%, transparent ${to}%)`
    : `linear-gradient(to bottom, ${C4} ${from}%, transparent)`;

// centering-w-N: absolute, exact pixel width, centered from viewport midpoint
const cw = (n: number): React.CSSProperties => ({
  position: "absolute",
  width: n,
  left: `calc(50% - ${n / 2}px)`,
});

export default function HeroGrid() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    // inset-0 fills the hero section; overflow-hidden clips the w-screen H line
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden${revealed ? " hero-revealed" : ""}`}
      aria-hidden="true"
    >
      {/*
       * HORIZONTAL LINE 1 - full-viewport width
       * Mobile: top 557.5px  |  lg (≥1024px): top 683.5px
       */}
      <div
        className="hero-line hero-line-h absolute left-0 h-px w-screen top-[557.5px] lg:top-[683.5px]"
        style={{ background: C4, transitionDelay: "400ms" }}
      />

      {/*
       * cmw-1353 CONTAINER - top 75px, height 1096px, 16px side-padding
       * Shrinks responsively when viewport < 1353+32px (stays 16px from each edge).
       * Contains:
       *   • 1 pair of vertical lines  (always visible, delay-500)
       *   • 1 pair of H brackets at 224.5px  (xl+ only, max-xl:hidden)
       */}
      <div
        className="absolute top-18.75 h-274"
        style={{
          width: "min(1353px, calc(100% - 32px))",
          left: "max(16px, calc(50% - 676.5px))",
        }}
      >
        {/* cmw-1353 - left vertical */}
        <div
          className="hero-line hero-line-v absolute top-0 left-0 h-full w-px"
          style={{ background: grad(75), transitionDelay: "500ms" }}
        />
        {/* cmw-1353 - right vertical */}
        <div
          className="hero-line hero-line-v absolute top-0 right-0 h-full w-px"
          style={{ background: grad(75), transitionDelay: "500ms" }}
        />
        {/* cmw-1353 - H bracket LEFT at 224.5px (xl+ only) */}
        <div
          className="hero-line hero-line-h absolute left-0 h-px w-84.25 top-[224.5px] max-xl:hidden"
          style={{ background: C4, transitionDelay: "100ms" }}
        />
        {/* cmw-1353 - H bracket RIGHT at 224.5px (xl+ only) */}
        <div
          className="hero-line hero-line-h-r absolute right-0 h-px w-84.25 top-[224.5px] max-xl:hidden"
          style={{ background: C4, transitionDelay: "100ms" }}
        />
      </div>

      {/*
       * INNER CONTAINERS - visible only at xl+ (≥1280px)
       * `hidden xl:contents` makes this div transparent in layout so its
       * absolutely-positioned children are placed relative to the section.
       */}
      <div className="hidden xl:contents">
        {/*
         * centering-w-1128 - top 0, height 1096px
         * Contains:
         *   • 1 pair of vertical lines  (delay-400, grad from-75%)
         *   • 1 pair of H brackets at 555.5px  (delay-100)
         */}
        <div className="absolute top-0 h-274" style={cw(1128)}>
          <div
            className="hero-line hero-line-v absolute top-0 left-0 h-full w-px"
            style={{ background: grad(75), transitionDelay: "400ms" }}
          />
          <div
            className="hero-line hero-line-v absolute top-0 right-0 h-full w-px"
            style={{ background: grad(75), transitionDelay: "400ms" }}
          />
          {/* H bracket LEFT at 555.5px */}
          <div
            className="hero-line hero-line-h absolute left-0 h-px w-56 top-[555.5px]"
            style={{ background: C4, transitionDelay: "100ms" }}
          />
          {/* H bracket RIGHT at 555.5px */}
          <div
            className="hero-line hero-line-h-r absolute right-0 h-px w-56 top-[555.5px]"
            style={{ background: C4, transitionDelay: "100ms" }}
          />
        </div>

        {/*
         * centering-w-681 - top 75px, height 853px
         * Gradient: from-75% to-90% (fades out faster than the outer pairs)
         */}
        <div className="absolute top-18.75 h-213.25" style={cw(681)}>
          <div
            className="hero-line hero-line-v absolute top-0 left-0 h-full w-px"
            style={{ background: grad(75, 90), transitionDelay: "200ms" }}
          />
          <div
            className="hero-line hero-line-v absolute top-0 right-0 h-full w-px"
            style={{ background: grad(75, 90), transitionDelay: "200ms" }}
          />
        </div>

        {/*
         * centering-w-905 - top 155px, height 773px
         * Gradient: from-60% to-90% (starts fading earliest)
         */}
        <div className="absolute top-38.75 h-193.25" style={cw(905)}>
          <div
            className="hero-line hero-line-v absolute top-0 left-0 h-full w-px"
            style={{ background: grad(60, 90), transitionDelay: "300ms" }}
          />
          <div
            className="hero-line hero-line-v absolute top-0 right-0 h-full w-px"
            style={{ background: grad(60, 90), transitionDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}
