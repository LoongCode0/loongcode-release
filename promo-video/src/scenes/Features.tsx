import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FeatureCard } from "../components/FeatureCard";
import { DragonEmblem } from "../components/DragonEmblem";
import { IconName } from "../components/Icons";
import { sceneFade } from "../util/anim";
import { COLORS, FONT, SCENES } from "../theme";

const FEATURES: { icon: IconName; zh: string; en: string }[] = [
  { icon: "layout", zh: "多会话并行 · 分屏自由平铺", en: "Parallel sessions, split-pane tiling" },
  { icon: "tools", zh: "终端 · 文件树 · Git · 代码编辑，全内置", en: "Terminal · Files · Git · Editor, built in" },
  { icon: "puzzle", zh: "MCP · 插件 · 技能 · 子智能体", en: "MCP · Plugins · Skills · Subagents" },
  { icon: "swap", zh: "自由切换模型供应商", en: "Swap model providers freely" },
  { icon: "phone", zh: "微信 / 飞书 · 手机远程驱动任务", en: "Drive tasks from your phone" },
  { icon: "refresh", zh: "Windows · macOS · 内置自动更新", en: "Cross-platform, auto-updating" },
];

export const Features: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.min(FEATURES.length - 1, Math.floor(f / 140));
  const cardProg = (f - idx * 140) / 140;
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
