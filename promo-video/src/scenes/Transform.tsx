import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Framed } from "../components/Framed";
import { CodeRain } from "../components/CodeRain";
import { BilingualTitle } from "../components/BilingualTitle";
import { prog, fade, sceneFade } from "../util/anim";
import { COLORS, FONT, SCENES } from "../theme";

export const Transform: React.FC = () => {
  const f = useCurrentFrame();
  const typed = "▸ claude".slice(0, Math.floor(prog(f, 8, 55) * 8));
  const blink = Math.floor(f / 12) % 2 === 0;
  const burst = prog(f, 65, 135);
  const rain = fade(f, 65, 85, 130, 155) * 0.16;
  const titleP = prog(f, 170, 225);
  const showTerminal = f < 115;
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: sceneFade(f, SCENES.transform.dur),
      }}
    >
      <CodeRain seed={88} opacity={rain} />
      {showTerminal && (
        <div
          style={{
            position: "absolute",
            transform: `scale(${0.5 + burst * 0.5})`,
            opacity: 1 - burst,
            background: "rgba(0,0,0,0.55)",
            border: `1px solid ${COLORS.cardBorder}`,
            borderRadius: 18,
            padding: "40px 56px",
            fontFamily: FONT.en,
            fontSize: 40,
            color: COLORS.text,
          }}
        >
          <span style={{ color: COLORS.text3 }}>~/project </span>
          {typed}
          <span style={{ opacity: blink ? 1 : 0, background: COLORS.purple }}>
            &nbsp;
          </span>
        </div>
      )}
      {/* 终端炸开 → 揭示真实主界面 */}
      <div
        style={{
          opacity: burst,
          transform: `translateY(${(1 - burst) * 30}px) scale(${0.92 + burst * 0.08})`,
          marginTop: -40,
        }}
      >
        <Framed
          src="shots/01-chat.png"
          width={1000}
          height={600}
          ar={3840 / 2064}
          tilt={burst * 0.5}
          zoom={1.18 + 0.16 * burst}
          fy={0.46}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 150,
          width: "86%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <BilingualTitle
          zh="把 Agentic CLI 装进桌面"
          en="Bring agentic CLIs into a desktop GUI"
          progress={titleP}
          zhSize={60}
          enSize={27}
          gold
        />
        <div
          style={{
            opacity: interpolate(titleP, [0.5, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            fontFamily: FONT.zh,
            fontSize: 23,
            color: COLORS.text3,
            textAlign: "center",
          }}
        >
          现已支持 Claude Code · 更多 CLI 陆续接入　|　Claude Code today · more
          coming
        </div>
      </div>
    </AbsoluteFill>
  );
};
