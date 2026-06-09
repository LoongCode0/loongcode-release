import React from "react";
import { GRAD, FONT } from "../theme";

export const Wordmark: React.FC<{
  size: number;
  opacity?: number;
  glow?: number;
}> = ({ size, opacity = 1, glow = 0 }) => (
  <span
    style={{
      fontFamily: FONT.display,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: size * 0.01,
      backgroundImage: GRAD.goldBright,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      opacity,
      filter: glow
        ? `drop-shadow(0 0 ${glow}px rgba(244,217,139,0.55))`
        : undefined,
      whiteSpace: "nowrap",
    }}
  >
    LoongCode
  </span>
);
