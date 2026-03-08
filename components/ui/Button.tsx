import React from "react";

const variants = {
  ghost:
    "border border-white/10 bg-white/5 text-neutral-300 " +
    "hover:bg-white/10 hover:text-white " +
    "focus-visible:ring-white/50",
  primary:
    "border border-[#155dfc] bg-[#155dfc] text-white " +
    "hover:bg-[#155dfc]/90 active:bg-[#1a4fd6] " +
    "focus-visible:ring-[#155dfc]",
};

const sizes = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-base gap-2",
};

interface ButtonBaseProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = ButtonBaseProps &
  (
    | ({ href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
    | ({ href?: never } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  );

export default function Button({
  variant = "ghost",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium whitespace-nowrap " +
    "transition-colors active:translate-y-px " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617] " +
    "disabled:pointer-events-none disabled:opacity-50 ";

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorProps } = props as {
      href: string;
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
