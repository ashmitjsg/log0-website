import GrainBackground from "@/components/GrainBackground";
import Navbar from "@/components/Navbar";
import type { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--site-bg)",
        color: "var(--site-text)",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <GrainBackground />
      <Navbar />
      {children}
    </div>
  );
}
