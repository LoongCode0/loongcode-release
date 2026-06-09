import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../theme";

export const GradientBG: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill style={{ background: COLORS.bg }}>
    <AbsoluteFill
      style={{
        backgroundImage: `
          radial-gradient(1000px 700px at 78% -8%, rgba(109,94,252,0.22), transparent 60%),
          radial-gradient(800px 700px at 5% 18%, rgba(47,109,246,0.14), transparent 55%),
          radial-gradient(700px 700px at 50% 110%, rgba(109,94,252,0.10), transparent 60%)
        `,
      }}
    />
    {/* 细微暗角 */}
    <AbsoluteFill style={{ boxShadow: "inset 0 0 300px 80px rgba(0,0,0,0.6)" }} />
    {children}
  </AbsoluteFill>
);
