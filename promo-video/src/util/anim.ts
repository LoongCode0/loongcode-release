import { interpolate, Easing } from "remotion";

// 标准缓动（ease-out cubic），用于多数入场。
export const easeOut = (t: number) =>
  interpolate(t, [0, 1], [0, 1], { easing: Easing.out(Easing.cubic) });

// 区间淡入淡出，超出范围 clamp。
export function fade(
  frame: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number
): number {
  return interpolate(frame, [inStart, inEnd, outStart, outEnd], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// 单段进度 0→1，clamp。
export function prog(frame: number, start: number, end: number): number {
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// 幕级淡入淡出包络：起止各 edge 帧渐变。底层 GradientBG 常驻，
// 淡出时露出氛围背景，形成干净的章节转场。
export function sceneFade(frame: number, dur: number, edge = 8): number {
  return interpolate(frame, [0, edge, dur - edge, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}
