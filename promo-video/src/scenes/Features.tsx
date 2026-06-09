import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FeatureCard } from "../components/FeatureCard";
import { DragonEmblem } from "../components/DragonEmblem";
import { IconName } from "../components/Icons";
import { sceneFade } from "../util/anim";
import { COLORS, FONT, SCENES } from "../theme";

const FEATURES: { icon: IconName; zh: string; en: string }[] = [
  { icon: "refresh", zh: "跨平台 · Windows / macOS · 自动更新", en: "Cross-platform, auto-updating" },
  { icon: "swap", zh: "任务归档 · 历史精确还原 · 会话分叉", en: "Archive, restore & fork sessions" },
  { icon: "layout", zh: "8 套主题 · 无边框透明 · 新手引导", en: "8 themes, frameless UI, onboarding" },
];

export const Features: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.min(FEATURES.length - 1, Math.floor(f / 95));
  const cardProg = (f - idx * 95) / 95;
  const drift = Math.sin(f / 60) * 30;
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: sceneFade(f, SCENES.features.dur),
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -120,
          opacity: 0.06,
          transform: `translateY(${drift}px)`,
        }}
      >
        <DragonEmblem size={760} reveal={1} shimmer={(f % 200) / 200} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 150,
          fontFamily: FONT.en,
          letterSpacing: 6,
          fontSize: 24,
          color: COLORS.text3,
        }}
      >
        核 心 能 力 · CORE FEATURES
      </div>
      <FeatureCard {...FEATURES[idx]} progress={cardProg} />
      {/* 进度点 */}
      <div style={{ position: "absolute", bottom: 150, display: "flex", gap: 12 }}>
        {FEATURES.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === idx ? 30 : 10,
              height: 10,
              borderRadius: 999,
              background: i === idx ? COLORS.purple : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
