import React from "react";

const GrainBackground = () => {
  return (
    <>
      {/* Base background */}
      <div className="fixed inset-0 -z-20 bg-[#020617]" />

      {/* Global teal glow centered on page */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55.8% 55.49% at 50% 55.49%, #264d4c 0%, rgba(25, 48, 47, 0) 100%)",
        }}
      />

      {/* Grain overlay — SVG feTurbulence with mix-blend-overlay */}
      <svg
        className="pointer-events-none fixed inset-0 z-[99] h-screen mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="noise-filter">
            <feTurbulence
              type="turbulence"
              baseFrequency="1"
              numOctaves="1"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="coloredNoise"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#noise-filter)" />
      </svg>
    </>
  );
};

export default GrainBackground;
