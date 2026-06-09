import React from "react";
import { AbsoluteFill, useVideoConfig, interpolate } from "remotion";
import { mulberry32, randRange } from "../util/rng";
import { COLORS } from "../theme";

export const ParticleField: React.FC<{
  count: number;
  progress: number; // 0 散 -> 1 聚
  seed: number;
}> = ({ count, progress, seed }) => {
  const { width, height } = useVideoConfig();
  const rng = mulberry32(seed);
  const cx = width / 2;
  const cy = height * 0.42;
  const dots = Array.from({ length: count }, () => {
    const sx = randRange(rng, 0, width);
    const sy = randRange(rng, 0, height);
    const size = randRange(rng, 2, 6);
    const purple = rng() > 0.5;
    return { sx, sy, size, purple, jitter: randRange(rng, -30, 30) };
  });
  return (
    <AbsoluteFill>
      {dots.map((d, i) => {
        const x = interpolate(progress, [0, 1], [d.sx, cx + d.jitter]);
        const y = interpolate(progress, [0, 1], [d.sy, cy + d.jitter]);
        const op = interpolate(progress, [0, 0.2, 1], [0, 0.9, 0.15]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: d.size,
              height: d.size,
              borderRadius: "50%",
              background: d.purple ? COLORS.purple : COLORS.blue,
              boxShadow: `0 0 ${d.size * 3}px ${d.purple ? COLORS.purple : COLORS.blue}`,
              opacity: op,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
