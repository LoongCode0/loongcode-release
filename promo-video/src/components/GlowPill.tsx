import React from "react";
import { COLORS, GRAD, FONT } from "../theme";

export const GlowPill: React.FC<{
  label: string;
  variant?: "accent" | "ghost";
  size?: number;
}> = ({ label, variant = "accent", size = 26 }) => (
  <span
    style={{
      fontFamily: FONT.en,
      fontWeight: 600,
      fontSize: size,
      padding: `${size * 0.45}px ${size * 0.9}px`,
      borderRadius: 999,
      color: variant === "accent" ? "#fff" : COLORS.text2,
      background: variant === "accent" ? GRAD.accent : "rgba(255,255,255,0.04)",
      border: variant === "accent" ? "none" : `1px solid ${COLORS.cardBorder}`,
      boxShadow: variant === "accent" ? "0 8px 24px rgba(109,94,252,0.4)" : "none",
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </span>
);
