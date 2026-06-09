import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Framed } from "../components/Framed";
import { DragonEmblem } from "../components/DragonEmblem";
import { BilingualTitle } from "../components/BilingualTitle";
import { sceneFade } from "../util/anim";
import { COLORS, FONT, SCENES } from "../theme";

const SHOTS: {
  src: string;
  zh: string;
  en: string;
  phone?: boolean;
}[] = [
  { src: "shots/02-split.png", zh: "分屏对话 · 多任务并行", en: "Split-pane chat, parallel tasks" },
  { src: "shots/03-skills.png", zh: "技能 · 插件 · MCP，可视化管理", en: "Skills, plugins & MCP, visually managed" },
  { src: "shots/04-providers.png", zh: "自由切换模型供应商", en: "Swap model providers freely" },
  { src: "shots/06-files.png", zh: "文件树 · 编辑 · 终端，全内置", en: "Files, editor & terminal, built in" },
  { src: "shots/07-mobile.png", zh: "微信 / 飞书 · 手机远程驱动", en: "Drive tasks from your phone", phone: true },
];

const PER = 95;

export const Showcase: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.min(SHOTS.length - 1, Math.floor(f / PER));
  const sp = (f - idx * PER) / PER;
  const enter = Math.min(1, sp / 0.2);
  const exit = Math.max(0, (sp - 0.82) / 0.18);
  const op = enter * (1 - exit);
  const y = (1 - enter) * 70 - exit * 70;
  const kb = 1.02 + 0.05 * sp;
  const panX = (sp - 0.5) * 16;
  const captionP = Math.min(1, Math.max(0, (sp - 0.12) / 0.2)) * (1 - exit);
  const drift = Math.sin(f / 55) * 22;
  const s = SHOTS[idx];
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: sceneFade(f, SCENES.showcase.dur),
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -120,
          opacity: 0.05,
          transform: `translateY(${drift}px)`,
        }}
      >
        <DragonEmblem size={720} reveal={1} shimmer={(f % 200) / 200} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 120,
          fontFamily: FONT.en,
          letterSpacing: 6,
          fontSize: 22,
          color: COLORS.text3,
        }}
      >
        界 面 一 览 · IN ACTION
      </div>
      <div style={{ opacity: op, transform: `translateY(${y}px)` }}>
        <Framed
          src={s.src}
          width={s.phone ? 540 : 980}
          radius={s.phone ? 38 : 18}
          tilt={enter}
          imgScale={s.phone ? 1 : kb}
          panX={s.phone ? 0 : panX}
        />
      </div>
      <div style={{ position: "absolute", bottom: 188, width: "84%" }}>
        <BilingualTitle zh={s.zh} en={s.en} progress={captionP} zhSize={40} enSize={23} />
      </div>
      <div style={{ position: "absolute", bottom: 128, display: "flex", gap: 11 }}>
        {SHOTS.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === idx ? 26 : 9,
              height: 9,
              borderRadius: 999,
              background: i === idx ? COLORS.purple : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
