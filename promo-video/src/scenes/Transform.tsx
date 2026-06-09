import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { FakeIDE } from "../components/FakeIDE";
import { CodeRain } from "../components/CodeRain";
import { BilingualTitle } from "../components/BilingualTitle";
import { prog, fade, sceneFade } from "../util/anim";
import { COLORS, FONT, SCENES } from "../theme";

export const Transform: React.FC = () => {
  const f = useCurrentFrame();
  const typed = "▸ claude".slice(0, Math.floor(prog(f, 10, 80) * 8));
  const blink = Math.floor(f / 12) % 2 === 0;
  const burst = prog(f, 90, 180);
  const assemble = prog(f, 120, 300);
  const rain = fade(f, 90, 110, 170, 200) * 0.16;
  const titleP = prog(f, 255, 320);
  const showTerminal = f < 150;
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
      <div style={{ opacity: burst, transform: `scale(${0.9 + burst * 0.1})` }}>
        <FakeIDE assemble={assemble} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 180,
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
          zhSize={62}
          enSize={28}
          gold
        />
        <div
          style={{
            opacity: interpolate(titleP, [0.5, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            fontFamily: FONT.zh,
            fontSize: 24,
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
