import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT, GRAD } from "../theme";

export const BilingualTitle: React.FC<{
  zh: string;
  en: string;
  progress: number;
  zhSize?: number;
  enSize?: number;
  gold?: boolean;
  align?: "center" | "left";
}> = ({
  zh,
  en,
  progress,
  zhSize = 64,
  enSize = 30,
  gold = false,
  align = "center",
}) => {
  const y = interpolate(progress, [0, 1], [28, 0]);
  const blur = interpolate(progress, [0, 1], [8, 0]);
  return (
    <div
      style={{
        textAlign: align,
        opacity: progress,
        transform: `translateY(${y}px)`,
        filter: `blur(${blur}px)`,
      }}
    >
      <div
        style={{
          fontFamily: FONT.zh,
          fontWeight: 700,
          fontSize: zhSize,
          lineHeight: 1.2,
          ...(gold
            ? {
                backgroundImage: GRAD.gold,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }
            : { color: COLORS.text }),
        }}
      >
        {zh}
      </div>
      <div
        style={{
          fontFamily: FONT.en,
          fontWeight: 500,
          fontSize: enSize,
          letterSpacing: 1.5,
          color: COLORS.text2,
          marginTop: zhSize * 0.18,
        }}
      >
        {en}
      </div>
    </div>
  );
};
