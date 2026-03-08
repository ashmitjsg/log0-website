import {
  GeistPixelLine,
  GeistPixelGrid,
  GeistPixelCircle,
} from "geist/font/pixel";

const fontVariants = {
  line: GeistPixelLine,
  grid: GeistPixelGrid,
  circle: GeistPixelCircle,
} as const;

type FontVariant = keyof typeof fontVariants;

interface LogoProps {
  variant?: FontVariant;
  className?: string;
}

export default function Logo({ variant = "line", className }: LogoProps) {
  const font = fontVariants[variant];
  return (
    <span
      className={`${font.className} ${className ?? ""}`}
      style={{ letterSpacing: "-0.03em" }}
    >
      log0
    </span>
  );
}
