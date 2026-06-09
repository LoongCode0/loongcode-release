import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { ParticleField } from "../components/ParticleField";
import { DragonEmblem } from "../components/DragonEmblem";
import { Wordmark } from "../components/Wordmark";
import { prog, sceneFade } from "../util/anim";
import { COLORS, FONT, SCENES } from "../theme";

export const ColdOpen: React.FC = () => {
  const f = useCurrentFrame();
  const gather = prog(f, 0, 110);
  const reveal = prog(f, 80, 180);
  const shimmer = prog(f, 110, 210);
  const titleP = prog(f, 150, 250);
  const float = Math.sin(f / 20) * 6;
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: sceneFade(f, SCENES.coldOpen.dur),
      }}
    >
      <ParticleField count={120} progress={gather} seed={1337} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        <DragonEmblem size={520} reveal={reveal} shimmer={shimmer} float={float} />
        <Wordmark
          size={150}
          opacity={titleP}
          glow={interpolate(titleP, [0, 1], [0, 40])}
        />
        <div style={{ opacity: titleP, textAlign: "center" }}>
          <div
            style={{
              fontFamily: FONT.zh,
              fontWeight: 500,
              fontSize: 40,
              color: COLORS.text,
            }}
          >
            AI Agent CLI 的桌面工作台
          </div>
          <div
            style={{
              fontFamily: FONT.en,
              fontSize: 26,
              letterSpacing: 2,
              color: COLORS.text2,
              marginTop: 10,
            }}
          >
            The Desktop Workbench for Agentic CLIs
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
