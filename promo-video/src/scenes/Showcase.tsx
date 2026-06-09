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
const DESKTOP_AR = 3840 / 2064;
const MOBILE_AR = 1080 / 2376;

export const Showcase: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.min(SHOTS.length - 1, Math.floor(f / PER));
  const sp = (f - idx * PER) / PER;
  const enter = Math.min(1, sp / 0.2);
  const exit = Math.max(0, (sp - 0.82) / 0.18);
  const op = enter * (1 - exit);
  const y = (1 - enter) * 70 - exit * 70;
  const zoom = 1.3 + 0.16 * sp; // 缓慢推进，主内容更大更清晰
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
          width={s.phone ? 540 : 1000}
          height={s.phone ? 1188 : 600}
          ar={s.phone ? MOBILE_AR : DESKTOP_AR}
          radius={s.phone ? 38 : 18}
          tilt={s.phone ? 0 : enter}
          zoom={s.phone ? 1 : zoom}
          fx={0.5}
          fy={s.phone ? 0.5 : 0.46}
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
