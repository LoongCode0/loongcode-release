import React from "react";
import { interpolate } from "remotion";
import { COLORS, GRAD, FONT, GLOW } from "../theme";
import { Icon, IconName } from "./Icons";

export const FeatureCard: React.FC<{
  zh: string;
  en: string;
  icon: IconName;
  progress: number;
}> = ({ zh, en, icon, progress }) => {
  const enter = Math.min(1, progress / 0.18);
  const exit = Math.max(0, (progress - 0.82) / 0.18);
  const y = (1 - enter) * 60 - exit * 60;
  const opacity = enter * (1 - exit);
  const borderGlow = interpolate(enter, [0.4, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        width: 820,
        transform: `translateY(${y}px)`,
        opacity,
        background: COLORS.cardBg,
        border: `1.5px solid rgba(109,94,252,${0.15 + borderGlow * 0.5})`,
        borderRadius: 30,
        padding: "54px 48px",
        backdropFilter: "blur(10px)",
        boxShadow: borderGlow ? "0 24px 70px rgba(109,94,252,0.22)" : "none",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 116,
          height: 116,
          margin: "0 auto 30px",
          borderRadius: "50%",
          background: GRAD.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: GLOW.purpleSoft,
        }}
      >
        <Icon name={icon} size={58} />
      </div>
      <div
        style={{
          fontFamily: FONT.zh,
          fontWeight: 700,
          fontSize: 58,
          lineHeight: 1.25,
          color: COLORS.text,
        }}
      >
        {zh}
      </div>
      <div
        style={{
          fontFamily: FONT.en,
          fontWeight: 500,
          fontSize: 30,
          letterSpacing: 1,
          color: COLORS.text2,
          marginTop: 18,
        }}
      >
        {en}
      </div>
      <div
        style={{
          height: 5,
          width: `${enter * 100}%`,
          margin: "34px auto 0",
          borderRadius: 999,
          background: GRAD.accent,
          boxShadow: GLOW.purpleSoft,
        }}
      />
    </div>
  );
};
