"use client";

import { motion } from "framer-motion";
import HeroGrid from "./HeroGrid";
import Button from "@/components/ui/Button";
import GitHubIcon from "@/components/icons/GitHub";
import { links } from "@/lib/links";

const EASE = [0.25, 0.1, 0.25, 1] as const;

// Shared: blur + lift + fade in
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.6, ease: EASE, delay },
});

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden hero-bg">
      {/* Teal radial glow */}
      <div className="glow-orb" />

      {/* Animated grid lines */}
      <HeroGrid />

      {/* Content */}
      <div className="container relative z-10 flex min-h-screen flex-col items-center pt-19 pb-16 text-center">
        {/* Pill */}
        <motion.a
          href={links.blog}
          className="mt-11 mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-neutral-400 transition-colors hover:border-white/20 hover:text-white"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
        >
          <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-medium text-neutral-950">
            New
          </span>
          Intelligent incident response for engineering teams
          <span className="text-neutral-500">→</span>
        </motion.a>

        {/* Headline */}
        <motion.div className="mt-10 max-w-170" {...fadeUp(0.85)}>
          <h1 className="mb-6 text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Turn raw logs into{" "}
            <span className="text-emerald-400">actionable incidents</span>
          </h1>
        </motion.div>

        {/* Subtext */}
        <motion.p
          className="mb-10 max-w-170 text-lg leading-relaxed text-neutral-400"
          {...fadeUp(1.0)}
        >
          log0 investigates, correlates, and resolves incidents by connecting
          your logs, traces, and alerts — before your users notice.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          {...fadeUp(1.15)}
        >
          <Button variant="primary" size="lg" href={links.github}>
            <GitHubIcon />
            Get started
          </Button>
          <Button variant="ghost" size="lg" href={links.docs}>
            Read the docs
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
