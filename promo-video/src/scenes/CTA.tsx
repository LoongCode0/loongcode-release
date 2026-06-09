import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { DragonEmblem } from "../components/DragonEmblem";
import { Wordmark } from "../components/Wordmark";
import { GlowPill } from "../components/GlowPill";
import { BilingualTitle } from "../components/BilingualTitle";
import { prog } from "../util/anim";
import { COLORS, GRAD, FONT, GLOW } from "../theme";

export const CTA: React.FC = () => {
  const f = useCurrentFrame();
  const reveal = prog(f, 0, 70);
  const wm = prog(f, 40, 110);
  const slogan = prog(f, 70, 140);
  const cta = prog(f, 100, 165);
  const float = Math.sin(f / 22) * 6;
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: prog(f, 0, 12), // 只淡入，结尾保持
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        <DragonEmblem
          size={440}
          reveal={reveal}
          shimmer={(f % 180) / 180}
          float={float}
        />
        <Wordmark size={130} opacity={wm} glow={interpolate(wm, [0, 1], [0, 50])} />
        <BilingualTitle
          zh="让每个 CLI Agent，住进你的桌面"
          en="Every agentic CLI, at home on your desktop."
          progress={slogan}
          zhSize={44}
          enSize={26}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            opacity: cta,
            transform: `translateY(${(1 - cta) * 20}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT.zh,
              fontWeight: 700,
              fontSize: 40,
              color: "#fff",
              background: GRAD.accent,
              padding: "18px 52px",
              borderRadius: 16,
              boxShadow: GLOW.purpleHard,
            }}
          >
            立即下载 · Get LoongCode
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <GlowPill label="Windows" variant="ghost" />
            <GlowPill label="macOS" variant="ghost" />
            <GlowPill label="自动更新 Auto-update" variant="ghost" />
          </div>
          <div
            style={{
              fontFamily: FONT.en,
              fontSize: 22,
              color: COLORS.text3,
              marginTop: 6,
            }}
          >
            loongcode0.github.io/loongcode-release
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
