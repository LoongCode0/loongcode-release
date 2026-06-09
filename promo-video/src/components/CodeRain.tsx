import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { mulberry32, randRange } from "../util/rng";
import { COLORS, FONT } from "../theme";

const GLYPHS = "{}()<>=>;/—const async await fn task ▸ ✦ 龙".split("");

export const CodeRain: React.FC<{
  seed: number;
  opacity: number;
  columns?: number;
}> = ({ seed, opacity, columns = 14 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const rng = mulberry32(seed);
  const cols = Array.from({ length: columns }, (_, i) => ({
    x: (i + 0.5) * (width / columns),
    speed: randRange(rng, 1.2, 3.2),
    offset: randRange(rng, 0, height),
    glyphs: Array.from(
      { length: 22 },
      () => GLYPHS[Math.floor(rng() * GLYPHS.length)]
    ),
  }));
  return (
    <AbsoluteFill style={{ opacity, fontFamily: FONT.en, overflow: "hidden" }}>
      {cols.map((c, i) => {
        const y = ((frame * c.speed + c.offset) % (height + 400)) - 200;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c.x,
              top: y,
              color: i % 3 === 0 ? COLORS.purple : COLORS.text2,
              fontSize: 26,
              lineHeight: 1.5,
              textShadow: `0 0 8px ${COLORS.purple}`,
            }}
          >
            {c.glyphs.map((g, j) => (
              <div key={j} style={{ opacity: 1 - j / 24 }}>
                {g}
              </div>
            ))}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
