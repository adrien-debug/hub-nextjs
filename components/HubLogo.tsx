type HubLogoProps = {
  className?: string;
  textColor?: string;
};

export default function HubLogo({ className = "", textColor = "#ffffff" }: HubLogoProps) {
  return (
    <svg
      className={`h-[100px] w-auto overflow-visible md:h-[120px] ${className}`}
      viewBox="560 455 380 170"
      role="img"
      aria-label="HUB"
    >
      <polygon
        fill="#5eead4"
        points="601.74 466.87 572.6 466.87 572.6 609.73 601.74 609.73 601.74 549.07 633.11 579.43 665.76 579.43 601.74 517.46 601.74 466.87"
      />
      <polygon
        fill="#5eead4"
        points="672.72 466.87 672.72 528.12 644.63 500.93 611.98 500.93 672.72 559.72 672.72 609.73 701.86 609.73 701.86 466.87 672.72 466.87"
      />
      <text
        x={715}
        y={609.73}
        fill={textColor}
        fontFamily="var(--font-hub-logo), Montserrat, sans-serif"
        fontWeight={800}
        fontSize={195}
        letterSpacing="-0.02em"
      >
        UB
      </text>
    </svg>
  );
}
