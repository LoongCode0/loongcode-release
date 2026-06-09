export const COLORS = {
  bg: "#08080d",
  bgDeep: "#050509",
  text: "#ececf2",
  text2: "#9a9ab0",
  text3: "#6b6b82",
  purple: "#6d5efc",
  blue: "#2f6df6",
  gold1: "#f4d98b",
  gold2: "#caa45a",
  planGold: "#d8b370",
  cardBg: "rgba(255,255,255,0.045)",
  cardBorder: "rgba(255,255,255,0.09)",
} as const;

export const GRAD = {
  accent: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.blue})`,
  gold: `linear-gradient(135deg, ${COLORS.gold1}, ${COLORS.gold2})`,
  goldBright: `linear-gradient(135deg, #fff3cf, ${COLORS.gold1} 45%, ${COLORS.gold2})`,
} as const;

export const GLOW = {
  purpleSoft: "0 0 40px rgba(109,94,252,0.45)",
  purpleHard: "0 0 80px rgba(109,94,252,0.85)",
  gold: "0 0 50px rgba(244,217,139,0.55)",
} as const;

// 字体族名（由 util/fonts.ts 加载后回填实际 family）
export const FONT = {
  display: "Sora, system-ui, sans-serif", // 字标/大标题
  en: "Inter, system-ui, sans-serif", // 英文副标/正文
  zh: '"Noto Sans SC", "Microsoft YaHei", sans-serif',
};

// 全片帧时间轴常量（30fps）
export const FPS = 30;
export const TOTAL = 1740;
export const SCENES = {
  coldOpen: { from: 0, dur: 300 },
  transform: { from: 300, dur: 360 },
  features: { from: 660, dur: 840 },
  cta: { from: 1500, dur: 240 },
} as const;
