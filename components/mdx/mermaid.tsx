"use client";

import { use, useEffect, useId, useRef, useState } from "react";
import { useTheme } from "next-themes";
import type SvgPanZoom from "svg-pan-zoom";
import ZoomInIcon from "@/components/icons/ZoomIn";
import ZoomOutIcon from "@/components/icons/ZoomOut";
import ZoomResetIcon from "@/components/icons/ZoomReset";

export function Mermaid({ chart }: { chart: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return;
  return <MermaidContent chart={chart} />;
}

const cache = new Map<string, Promise<unknown>>();

function cachePromise<T>(
  key: string,
  setPromise: () => Promise<T>
): Promise<T> {
  const cached = cache.get(key);
  if (cached) return cached as Promise<T>;

  const promise = setPromise();
  cache.set(key, promise);
  return promise;
}

function MermaidContent({ chart }: { chart: string }) {
  const id = useId();
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const panZoomRef = useRef<ReturnType<typeof SvgPanZoom> | null>(null);

  const { default: mermaid } = use(
    cachePromise("mermaid", () => import("mermaid"))
  );

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    fontFamily: "inherit",
    themeCSS: "margin: 1.5rem auto 0;",
    theme: resolvedTheme === "dark" ? "dark" : "default",
  });

  const { svg, bindFunctions } = use(
    cachePromise(`${chart}-${resolvedTheme}`, () => {
      return mermaid.render(id, chart.replaceAll("\\n", "\n"));
    })
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const svgEl = container.querySelector("svg");
    if (!svgEl) return;

    // Make SVG fill the container so fit/center work correctly
    svgEl.setAttribute("width", "100%");
    svgEl.setAttribute("height", "100%");

    import("svg-pan-zoom").then(({ default: svgPanZoom }) => {
      panZoomRef.current = svgPanZoom(svgEl, {
        zoomEnabled: true,
        panEnabled: true,
        controlIconsEnabled: false,
        fit: true,
        center: true,
        minZoom: 0.1,
        maxZoom: 10,
        zoomScaleSensitivity: 0.3,
      });
    });

    return () => {
      panZoomRef.current?.destroy();
      panZoomRef.current = null;
    };
  }, [svg]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-fd-border bg-fd-card">
      {/* Controls */}
      <div className="absolute inset-e-2 top-2 z-10 flex gap-1">
        <button
          onClick={() => panZoomRef.current?.zoomIn()}
          className="flex size-7 items-center justify-center rounded-md border border-fd-border bg-fd-background/80 text-fd-muted-foreground backdrop-blur-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          aria-label="Zoom in"
        >
          <ZoomInIcon />
        </button>
        <button
          onClick={() => panZoomRef.current?.zoomOut()}
          className="flex size-7 items-center justify-center rounded-md border border-fd-border bg-fd-background/80 text-fd-muted-foreground backdrop-blur-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          aria-label="Zoom out"
        >
          <ZoomOutIcon />
        </button>
        <button
          onClick={() => {
            panZoomRef.current?.fit();
            panZoomRef.current?.center();
          }}
          className="flex size-7 items-center justify-center rounded-md border border-fd-border bg-fd-background/80 text-fd-muted-foreground backdrop-blur-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          aria-label="Reset zoom"
        >
          <ZoomResetIcon />
        </button>
      </div>

      {/* Diagram */}
      <div
        ref={(container) => {
          containerRef.current = container;
          if (container) bindFunctions?.(container);
        }}
        dangerouslySetInnerHTML={{ __html: svg }}
        style={{ width: "100%", height: "600px" }}
      />

      <p className="absolute bottom-2 inset-s-2 select-none text-[11px] text-fd-muted-foreground/60">
        Scroll to zoom · Drag to pan
      </p>
    </div>
  );
}
