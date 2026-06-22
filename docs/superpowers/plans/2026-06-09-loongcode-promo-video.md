# LoongCode 宣传片 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 Remotion 生成一支 1080×1920 / 30fps / ~58s 的暗黑鎏金风 LoongCode 中英双语动效宣传片，产出 `out/loongcode-promo.mp4`。

**Architecture:** 自包含 Remotion 子项目位于 `longcode_release/promo-video/`。顶层合成 `LoongCodePromo` 用 4 个 `<Sequence>` 串起四幕；底层 `GradientBG` 常驻；各幕由可复用组件（DragonEmblem / Wordmark / ParticleField / FakeIDE / FeatureCard / BilingualTitle）拼装。所有随机量走种子化 PRNG 保证逐帧可复现；字体用 @remotion/google-fonts + delayRender 确保 headless 渲染不缺字。

**Tech Stack:** Remotion 4.x · React 19 · TypeScript · pnpm · @remotion/google-fonts（Sora / Inter / Noto Sans SC）

参考 spec：`docs/superpowers/specs/2026-06-09-loongcode-promo-video-design.md`

---

## File Structure

```
promo-video/
  package.json            # 依赖与脚本（preview/render/poster/typecheck/test）
  tsconfig.json
  remotion.config.ts      # 渲染配置（H.264 / 像素格式 / 并发）
  vitest.config.ts        # 纯逻辑单测（rng）
  src/
    index.ts              # registerRoot(Root)
    Root.tsx              # <Composition id="LoongCodePromo" 1080x1920 30fps 1740f>
    LoongCodePromo.tsx    # 四幕时间轴 + GradientBG + 可选 <Audio>
    theme.ts              # 品牌令牌（颜色/渐变/缓动/字体族名）
    util/
      rng.ts              # mulberry32 + hashSeed（可测）
      rng.test.ts         # 决定性单测
      anim.ts             # 共享 interpolate/spring 助手
      fonts.ts            # 加载字体 + delayRender
    components/
      GradientBG.tsx
      ParticleField.tsx
      DragonEmblem.tsx
      Wordmark.tsx
      BilingualTitle.tsx
      GlowPill.tsx
      CodeRain.tsx
      FakeIDE.tsx
      FeatureCard.tsx
    scenes/
      ColdOpen.tsx        # ① 0–300
      Transform.tsx       # ② 300–660
      Features.tsx        # ③ 660–1500
      CTA.tsx             # ④ 1500–1740
    assets/
      logo.png            # 复制自 ../../longlong-ade/public/logo.png
  public/                 # 可选 music.mp3
  out/                    # 渲染产物（git 忽略）
```

依赖顺序：scaffold → theme/util → components → scenes → composition → render。

---

### Task 1: 工程脚手架与依赖

**Files:**
- Create: `promo-video/package.json`
- Create: `promo-video/tsconfig.json`
- Create: `promo-video/remotion.config.ts`
- Create: `promo-video/.gitignore`

- [ ] **Step 1: 写 `package.json`**

```json
{
  "name": "loongcode-promo-video",
  "version": "1.0.0",
  "private": true,
  "description": "LoongCode 暗黑鎏金风竖屏宣传片（Remotion）",
  "scripts": {
    "preview": "remotion studio",
    "render": "remotion render LoongCodePromo out/loongcode-promo.mp4 --codec=h264",
    "poster": "remotion still LoongCodePromo out/poster.png --frame=1720",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@remotion/cli": "^4.0.0",
    "@remotion/google-fonts": "^4.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "remotion": "^4.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: 写 `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["node"]
  },
  "include": ["src", "remotion.config.ts"]
}
```

- [ ] **Step 3: 写 `remotion.config.ts`**

```ts
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
Config.setCrf(18); // 高画质
Config.setConcurrency(null); // 自动用满核心
Config.overrideWebpackConfig((c) => c);
```

- [ ] **Step 4: 写 `.gitignore`**

```
node_modules/
out/
.DS_Store
```

- [ ] **Step 5: 安装依赖并验证**

Run（在 `promo-video/`）：`pnpm install`
Expected: 安装成功；若 React 19 与 Remotion 出现 peer 冲突，降级 `react`/`react-dom`/`@types/react` 到 `^18.3.0` 重装（视频项目 React 版本不影响产物，纯属内部依赖）。

- [ ] **Step 6: 提交**

```bash
git add promo-video/package.json promo-video/tsconfig.json promo-video/remotion.config.ts promo-video/.gitignore
git commit -m "chore: scaffold remotion promo-video project"
```

---

### Task 2: 品牌令牌 theme.ts

**Files:**
- Create: `promo-video/src/theme.ts`

- [ ] **Step 1: 写 `theme.ts`（取自真实代码库的色值）**

```ts
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

// 字体族名（由 util/fonts.ts 加载后回填）
export const FONT = {
  display: "Sora, system-ui, sans-serif",     // 字标/大标题
  en: "Inter, system-ui, sans-serif",          // 英文副标/正文
  zh: '"Noto Sans SC", "Microsoft YaHei", sans-serif',
} as const;

// 全片帧时间轴常量（30fps）
export const FPS = 30;
export const TOTAL = 1740;
export const SCENES = {
  coldOpen: { from: 0, dur: 300 },
  transform: { from: 300, dur: 360 },
  features: { from: 660, dur: 840 },
  cta: { from: 1500, dur: 240 },
} as const;
```

- [ ] **Step 2: 类型检查通过**

Run: `pnpm exec tsc --noEmit`
Expected: 无错误（此文件纯常量）。

- [ ] **Step 3: 提交**

```bash
git add promo-video/src/theme.ts
git commit -m "feat: brand design tokens for promo video"
```

---

### Task 3: 可复现随机 util/rng.ts（TDD）

**Files:**
- Create: `promo-video/src/util/rng.ts`
- Test: `promo-video/src/util/rng.test.ts`
- Create: `promo-video/vitest.config.ts`

- [ ] **Step 1: 写失败测试 `rng.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { mulberry32, hashSeed, randRange } from "./rng";

describe("rng", () => {
  it("mulberry32 is deterministic for same seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("different seeds diverge", () => {
    const a = mulberry32(1)();
    const b = mulberry32(2)();
    expect(a).not.toEqual(b);
  });

  it("randRange stays within bounds", () => {
    const r = mulberry32(7);
    for (let i = 0; i < 100; i++) {
      const v = randRange(r, 10, 20);
      expect(v).toBeGreaterThanOrEqual(10);
      expect(v).toBeLessThan(20);
    }
  });

  it("hashSeed is stable", () => {
    expect(hashSeed("dragon")).toEqual(hashSeed("dragon"));
    expect(hashSeed("a")).not.toEqual(hashSeed("b"));
  });
});
```

- [ ] **Step 2: 写 `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { environment: "node" } });
```

- [ ] **Step 3: 运行测试确认失败**

Run: `pnpm exec vitest run src/util/rng.test.ts`
Expected: FAIL（模块不存在）。

- [ ] **Step 4: 实现 `rng.ts`**

```ts
// 种子化 PRNG —— Remotion 渲染必须逐帧可复现，禁用 Math.random()。
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function randRange(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}
```

- [ ] **Step 5: 运行测试确认通过**

Run: `pnpm exec vitest run src/util/rng.test.ts`
Expected: PASS（4 用例）。

- [ ] **Step 6: 提交**

```bash
git add promo-video/src/util/rng.ts promo-video/src/util/rng.test.ts promo-video/vitest.config.ts
git commit -m "feat: deterministic seeded rng for reproducible rendering"
```

---

### Task 4: 动画助手 util/anim.ts + 字体 util/fonts.ts

**Files:**
- Create: `promo-video/src/util/anim.ts`
- Create: `promo-video/src/util/fonts.ts`

- [ ] **Step 1: 写 `anim.ts`**

```ts
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
  return interpolate(
    frame,
    [inStart, inEnd, outStart, outEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
}

// 单段进度 0→1，clamp。
export function prog(frame: number, start: number, end: number): number {
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}
```

- [ ] **Step 2: 写 `fonts.ts`（加载字体，回填 theme 族名）**

```ts
import { loadFont as loadSora } from "@remotion/google-fonts/Sora";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadNotoSC } from "@remotion/google-fonts/NotoSansSC";

// 触发加载；Remotion 内部用 delayRender 等字体就绪，避免 headless 缺字。
export const sora = loadSora("normal", { weights: ["600", "700", "800"] });
export const inter = loadInter("normal", { weights: ["400", "500", "600"] });
export const noto = loadNotoSC("normal", { weights: ["400", "500", "700"] });

export const fontsReady = Promise.all([
  sora.waitUntilDone(),
  inter.waitUntilDone(),
  noto.waitUntilDone(),
]);
```

> Fallback：若 `@remotion/google-fonts/NotoSansSC` 不可用，改用 `@remotion/fonts` 的 `loadFont` 指向本地 `assets/NotoSansSC.woff2`，并把 `FONT.zh` 设为加载返回的 fontFamily。

- [ ] **Step 3: 类型检查**

Run: `pnpm exec tsc --noEmit`
Expected: 无错误。

- [ ] **Step 4: 提交**

```bash
git add promo-video/src/util/anim.ts promo-video/src/util/fonts.ts
git commit -m "feat: animation helpers and font loading"
```

---

### Task 5: 复制龙 logo 资产 + GradientBG 背景

**Files:**
- Create: `promo-video/src/assets/logo.png`（复制）
- Create: `promo-video/src/components/GradientBG.tsx`

- [ ] **Step 1: 复制龙 logo**

Run: `cp ../longlong-ade/public/logo.png promo-video/src/assets/logo.png`
（Windows PowerShell：`Copy-Item ..\longlong-ade\public\logo.png promo-video\src\assets\logo.png`）
Expected: 文件存在，非空。

- [ ] **Step 2: 写 `GradientBG.tsx`（常驻底层）**

```tsx
import { AbsoluteFill } from "remotion";
import { COLORS } from "../theme";

export const GradientBG: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: COLORS.bg }}>
    <AbsoluteFill
      style={{
        backgroundImage: `
          radial-gradient(1000px 700px at 78% -8%, rgba(109,94,252,0.22), transparent 60%),
          radial-gradient(800px 700px at 5% 18%, rgba(47,109,246,0.14), transparent 55%),
          radial-gradient(700px 700px at 50% 110%, rgba(109,94,252,0.10), transparent 60%)
        `,
      }}
    />
    {/* 细微暗角 */}
    <AbsoluteFill
      style={{ boxShadow: "inset 0 0 300px 80px rgba(0,0,0,0.6)" }}
    />
    {children}
  </AbsoluteFill>
);
```

- [ ] **Step 3: 类型检查**

Run: `pnpm exec tsc --noEmit`
Expected: 无错误。

- [ ] **Step 4: 提交**

```bash
git add promo-video/src/assets/logo.png promo-video/src/components/GradientBG.tsx
git commit -m "feat: dragon logo asset and gradient background"
```

---

### Task 6: 基础品牌组件 — DragonEmblem / Wordmark / GlowPill

**Files:**
- Create: `promo-video/src/components/DragonEmblem.tsx`
- Create: `promo-video/src/components/Wordmark.tsx`
- Create: `promo-video/src/components/GlowPill.tsx`

- [ ] **Step 1: 写 `Wordmark.tsx`（鎏金文字）**

```tsx
import { GRAD, FONT } from "../theme";

export const Wordmark: React.FC<{ size: number; opacity?: number; glow?: number }> = ({
  size,
  opacity = 1,
  glow = 0,
}) => (
  <span
    style={{
      fontFamily: FONT.display,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: size * 0.01,
      backgroundImage: GRAD.goldBright,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      opacity,
      filter: glow ? `drop-shadow(0 0 ${glow}px rgba(244,217,139,${0.5 * (glow ? 1 : 0)}))` : undefined,
      whiteSpace: "nowrap",
    }}
  >
    LoongCode
  </span>
);
```

- [ ] **Step 2: 写 `DragonEmblem.tsx`（龙 + 辉光 + 流光扫过）**

接口与行为：
- props：`size: number`、`reveal: number`（0→1 显形进度）、`shimmer: number`（0→1 流光横扫位置）、`float?: number`（呼吸位移像素）。
- 用 `staticFile` 不适用（资产在 src），改 `import logo from "../assets/logo.png"` 由 webpack 处理。
- 显形：`opacity = reveal`；`scale = 0.86 + 0.14*reveal`；底部金色辉光 `filter: drop-shadow`.
- 流光：覆盖一层 `linear-gradient(105deg, transparent, rgba(255,250,230,.85), transparent)` 的高光条，用 `WebkitMaskImage: url(logo)` 把高光裁进龙形，`backgroundPositionX` 由 `shimmer` 驱动从 -100% → 200%。

```tsx
import { Img } from "remotion";
import logo from "../assets/logo.png";
import { GLOW } from "../theme";

export const DragonEmblem: React.FC<{
  size: number;
  reveal: number;
  shimmer: number;
  float?: number;
}> = ({ size, reveal, shimmer, float = 0 }) => {
  const scale = 0.86 + 0.14 * reveal;
  const sweep = -100 + shimmer * 300; // %
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        transform: `translateY(${float}px) scale(${scale})`,
        opacity: reveal,
      }}
    >
      <Img
        src={logo}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          filter: `drop-shadow(0 10px 40px rgba(244,217,139,0.35)) drop-shadow(0 0 60px rgba(202,164,90,${0.25 * reveal}))`,
        }}
      />
      {/* 鎏金流光：裁进龙形 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          WebkitMaskImage: `url(${logo})`,
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          backgroundImage:
            "linear-gradient(105deg, transparent 35%, rgba(255,250,230,0.9) 50%, transparent 65%)",
          backgroundSize: "300% 100%",
          backgroundPositionX: `${sweep}%`,
          mixBlendMode: "screen",
          opacity: reveal,
        }}
      />
    </div>
  );
};
```

- [ ] **Step 3: 写 `GlowPill.tsx`（平台/标签胶囊）**

```tsx
import { COLORS, GRAD, FONT } from "../theme";

export const GlowPill: React.FC<{
  label: string;
  variant?: "accent" | "ghost";
  size?: number;
}> = ({ label, variant = "accent", size = 26 }) => (
  <span
    style={{
      fontFamily: FONT.en,
      fontWeight: 600,
      fontSize: size,
      padding: `${size * 0.45}px ${size * 0.9}px`,
      borderRadius: 999,
      color: variant === "accent" ? "#fff" : COLORS.text2,
      background: variant === "accent" ? GRAD.accent : "rgba(255,255,255,0.04)",
      border: variant === "accent" ? "none" : `1px solid ${COLORS.cardBorder}`,
      boxShadow: variant === "accent" ? "0 8px 24px rgba(109,94,252,0.4)" : "none",
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </span>
);
```

- [ ] **Step 4: 类型检查**

Run: `pnpm exec tsc --noEmit`
Expected: 无错误（如 png import 报类型，加 `src/types.d.ts`：`declare module "*.png";`）。

- [ ] **Step 5: 提交**

```bash
git add promo-video/src/components/DragonEmblem.tsx promo-video/src/components/Wordmark.tsx promo-video/src/components/GlowPill.tsx
git commit -m "feat: dragon emblem, gold wordmark, glow pill components"
```

---

### Task 7: ParticleField + CodeRain + BilingualTitle

**Files:**
- Create: `promo-video/src/components/ParticleField.tsx`
- Create: `promo-video/src/components/CodeRain.tsx`
- Create: `promo-video/src/components/BilingualTitle.tsx`
- Create: `promo-video/src/types.d.ts`（若未建）

- [ ] **Step 1: 写 `types.d.ts`**

```ts
declare module "*.png";
```

- [ ] **Step 2: 写 `ParticleField.tsx`（粒子吸入汇聚，种子化）**

接口：`count`、`progress`（0=四散，1=汇聚中心）、`seed`、`hue?`。每粒子起点由 rng 在画布范围内取，终点向中心收拢；颜色在紫蓝之间。用单个绝对定位容器渲染 N 个小圆，`opacity` 随 progress 增强。

```tsx
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
```

- [ ] **Step 3: 写 `CodeRain.tsx`（品牌色代码流，②背景点缀，低透明度）**

种子化生成若干竖列字符流，向下平移；字符集用 `{}();=>/<>const async await fn` 等片段。整体 `opacity` 由 props 控制（≤0.18），仅作氛围。列的 y 偏移 = `(frame*speed + colOffset) % height`。

```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { mulberry32, randRange } from "../util/rng";
import { COLORS, FONT } from "../theme";

const GLYPHS = "{}()<>=>;/—const async await fn task ▸ ✦ 龙".split("");

export const CodeRain: React.FC<{ seed: number; opacity: number; columns?: number }> = ({
  seed,
  opacity,
  columns = 14,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const rng = mulberry32(seed);
  const cols = Array.from({ length: columns }, (_, i) => ({
    x: (i + 0.5) * (width / columns),
    speed: randRange(rng, 1.2, 3.2),
    offset: randRange(rng, 0, height),
    glyphs: Array.from({ length: 22 }, () => GLYPHS[Math.floor(rng() * GLYPHS.length)]),
  }));
  return (
    <AbsoluteFill style={{ opacity, fontFamily: FONT.en, overflow: "hidden" }}>
      {cols.map((c, i) => {
        const y = ((frame * c.speed + c.offset) % (height + 400)) - 200;
        return (
          <div key={i} style={{ position: "absolute", left: c.x, top: y, color: i % 3 === 0 ? COLORS.purple : COLORS.text2, fontSize: 26, lineHeight: 1.5, textShadow: `0 0 8px ${COLORS.purple}` }}>
            {c.glyphs.map((g, j) => (<div key={j} style={{ opacity: 1 - j / 24 }}>{g}</div>))}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 4: 写 `BilingualTitle.tsx`（中文主 + 英文副，动态入场）**

接口：`zh`、`en`、`progress`（0→1）、`align?`、`zhSize?`、`enSize?`、`gold?`。中文行字重 700，英文副标 letter-spacing 较大、`text2` 颜色；入场 = translateY(28→0) + opacity + 轻微 blur(8→0)。

```tsx
import { COLORS, FONT, GRAD } from "../theme";
import { interpolate } from "remotion";

export const BilingualTitle: React.FC<{
  zh: string;
  en: string;
  progress: number;
  zhSize?: number;
  enSize?: number;
  gold?: boolean;
  align?: "center" | "left";
}> = ({ zh, en, progress, zhSize = 64, enSize = 30, gold = false, align = "center" }) => {
  const y = interpolate(progress, [0, 1], [28, 0]);
  const blur = interpolate(progress, [0, 1], [8, 0]);
  return (
    <div style={{ textAlign: align, opacity: progress, transform: `translateY(${y}px)`, filter: `blur(${blur}px)` }}>
      <div
        style={{
          fontFamily: FONT.zh,
          fontWeight: 700,
          fontSize: zhSize,
          lineHeight: 1.2,
          ...(gold
            ? { backgroundImage: GRAD.gold, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }
            : { color: COLORS.text }),
        }}
      >
        {zh}
      </div>
      <div style={{ fontFamily: FONT.en, fontWeight: 500, fontSize: enSize, letterSpacing: 1.5, color: COLORS.text2, marginTop: zhSize * 0.18 }}>
        {en}
      </div>
    </div>
  );
};
```

- [ ] **Step 5: 类型检查**

Run: `pnpm exec tsc --noEmit`
Expected: 无错误。

- [ ] **Step 6: 提交**

```bash
git add promo-video/src/components/ParticleField.tsx promo-video/src/components/CodeRain.tsx promo-video/src/components/BilingualTitle.tsx promo-video/src/types.d.ts
git commit -m "feat: particle field, code rain, bilingual title"
```

---

### Task 8: FakeIDE（竖屏重绘界面）

**Files:**
- Create: `promo-video/src/components/FakeIDE.tsx`

- [ ] **Step 1: 写 `FakeIDE.tsx`**

竖屏 IDE 骨架：顶栏（红黄绿点 + 鎏金 `LoongCode` 小字标 + 任务标签）→ 对话区（用户气泡右、AI 气泡左，含一行工具调用折叠条）→ 文件树（3-4 行带图标缩进）→ 底部集成终端（`▸ claude` + 光标）。
接口：`assemble: number`（0→1 面板逐个归位的总进度），内部把 0→1 切成 5 段分别驱动顶栏/对话1/对话2/文件树/终端的 `translateY + opacity`。用 `prog` 助手切片：`panel(k)= clamp((assemble-k*0.16)/0.4)`。
样式取 `cardBg/cardBorder/accent 渐变描边`；圆角 22；面板间距 18。

```tsx
import { COLORS, GRAD, FONT } from "../theme";

const Panel: React.FC<{ p: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ p, children, style }) => (
  <div style={{ transform: `translateY(${(1 - p) * 40}px)`, opacity: p, background: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 22, padding: 18, backdropFilter: "blur(8px)", ...style }}>
    {children}
  </div>
);

export const FakeIDE: React.FC<{ assemble: number; width?: number }> = ({ assemble, width = 760 }) => {
  const seg = (k: number) => Math.min(1, Math.max(0, (assemble - k * 0.16) / 0.4));
  const bubble: React.CSSProperties = { borderRadius: 16, padding: "12px 16px", fontFamily: FONT.zh, fontSize: 24, maxWidth: "78%" };
  return (
    <div style={{ width, display: "flex", flexDirection: "column", gap: 18 }}>
      {/* 顶栏 */}
      <Panel p={seg(0)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px" }}>
        <Dot c="#ff5f57" /><Dot c="#febc2e" /><Dot c="#28c840" />
        <span style={{ marginLeft: 8, fontFamily: FONT.display, fontWeight: 800, fontSize: 22, backgroundImage: GRAD.gold, WebkitBackgroundClip: "text", color: "transparent" }}>LoongCode</span>
        <span style={{ marginLeft: "auto", fontFamily: FONT.en, fontSize: 18, color: COLORS.text3 }}>task · refactor-auth</span>
      </Panel>
      {/* 对话 */}
      <Panel p={seg(1)} style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 220 }}>
        <div style={{ alignSelf: "flex-end", ...bubble, background: GRAD.accent, color: "#fff" }}>帮我重构登录鉴权模块</div>
        <div style={{ alignSelf: "flex-start", ...bubble, background: "rgba(255,255,255,0.06)", color: COLORS.text }}>已定位 3 处可优化，开始修改…</div>
        <div style={{ alignSelf: "flex-start", display: "flex", gap: 8, alignItems: "center", fontFamily: FONT.en, fontSize: 18, color: COLORS.text2, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 12, padding: "8px 12px" }}>▸ Edit · auth.ts <span style={{ color: "#28c840" }}>+24 −7</span></div>
      </Panel>
      {/* 文件树 + 终端 横排 */}
      <div style={{ display: "flex", gap: 18 }}>
        <Panel p={seg(2)} style={{ flex: 1, fontFamily: FONT.en, fontSize: 19, color: COLORS.text2, lineHeight: 1.9 }}>
          <div>📁 src</div><div style={{ paddingLeft: 18 }}>📄 auth.ts</div><div style={{ paddingLeft: 18, color: COLORS.text }}>📄 store.ts</div><div>📁 components</div>
        </Panel>
        <Panel p={seg(3)} style={{ flex: 1.2, fontFamily: FONT.en, fontSize: 19, background: "rgba(0,0,0,0.4)" }}>
          <div style={{ color: COLORS.text3 }}>~/project</div>
          <div style={{ color: COLORS.text }}>▸ claude<span style={{ background: COLORS.purple, marginLeft: 2 }}>&nbsp;</span></div>
        </Panel>
      </div>
      {/* Git 变更条 */}
      <Panel p={seg(4)} style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: FONT.en, fontSize: 18, color: COLORS.text2 }}>
        <span style={{ color: COLORS.purple }}>⎇ main</span><span style={{ color: "#28c840" }}>+24</span><span style={{ color: "#ff5f57" }}>−7</span><span style={{ marginLeft: "auto" }}>✨ 生成提交信息</span>
      </Panel>
    </div>
  );
};

const Dot: React.FC<{ c: string }> = ({ c }) => (<span style={{ width: 14, height: 14, borderRadius: "50%", background: c, display: "inline-block" }} />);
```

- [ ] **Step 2: 类型检查**

Run: `pnpm exec tsc --noEmit`
Expected: 无错误。

- [ ] **Step 3: 提交**

```bash
git add promo-video/src/components/FakeIDE.tsx
git commit -m "feat: vertical fake IDE mock component"
```

---

### Task 9: FeatureCard（玻璃拟态特性卡）

**Files:**
- Create: `promo-video/src/components/FeatureCard.tsx`

- [ ] **Step 1: 写 `FeatureCard.tsx`**

接口：`index`、`zh`、`en`、`icon`（emoji 或字形）、`progress`（本卡 0→1 生命周期：入场/停留/出场，由 scene 计算后传入），`accent?`。
布局：竖屏居中大卡，顶部圆形图标徽（accent 渐变背景 + 光晕），中部中文主标（700, ~58），下部英文副标（text2），底部一条蓝紫渐变进度高光。
动效：`enter = clamp(progress/0.18)`；`exit = clamp((progress-0.82)/0.18)`；`y = (1-enter)*60 - exit*60`；`opacity = enter*(1-exit)`；描边在 enter 后期点亮。

```tsx
import { interpolate } from "remotion";
import { COLORS, GRAD, FONT, GLOW } from "../theme";

export const FeatureCard: React.FC<{
  zh: string;
  en: string;
  icon: string;
  progress: number;
}> = ({ zh, en, icon, progress }) => {
  const enter = Math.min(1, progress / 0.18);
  const exit = Math.max(0, (progress - 0.82) / 0.18);
  const y = (1 - enter) * 60 - exit * 60;
  const opacity = enter * (1 - exit);
  const borderGlow = interpolate(enter, [0.4, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ width: 820, transform: `translateY(${y}px)`, opacity, background: COLORS.cardBg, border: `1.5px solid rgba(109,94,252,${0.15 + borderGlow * 0.5})`, borderRadius: 30, padding: "54px 48px", backdropFilter: "blur(10px)", boxShadow: borderGlow ? "0 24px 70px rgba(109,94,252,0.22)" : "none", textAlign: "center" }}>
      <div style={{ width: 116, height: 116, margin: "0 auto 30px", borderRadius: "50%", background: GRAD.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, boxShadow: GLOW.purpleSoft }}>{icon}</div>
      <div style={{ fontFamily: FONT.zh, fontWeight: 700, fontSize: 58, lineHeight: 1.25, color: COLORS.text }}>{zh}</div>
      <div style={{ fontFamily: FONT.en, fontWeight: 500, fontSize: 30, letterSpacing: 1, color: COLORS.text2, marginTop: 18 }}>{en}</div>
      <div style={{ height: 5, width: `${enter * 100}%`, margin: "34px auto 0", borderRadius: 999, background: GRAD.accent, boxShadow: GLOW.purpleSoft }} />
    </div>
  );
};
```

- [ ] **Step 2: 类型检查**

Run: `pnpm exec tsc --noEmit`
Expected: 无错误。

- [ ] **Step 3: 提交**

```bash
git add promo-video/src/components/FeatureCard.tsx
git commit -m "feat: glassmorphism feature card"
```

---

### Task 10: 场景 ① ColdOpen

**Files:**
- Create: `promo-video/src/scenes/ColdOpen.tsx`

- [ ] **Step 1: 写 `ColdOpen.tsx`（本地帧 0–300）**

用 `useCurrentFrame()`（在 Sequence 内为局部帧）。时间线：
- 粒子汇聚 progress = `prog(f, 0, 110)`。
- 龙 reveal = `prog(f, 80, 180)`；shimmer = `prog(f, 110, 200)`；float = `sin(f/20)*6`。
- 字标 + 副标 = `prog(f, 150, 250)`。

```tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { ParticleField } from "../components/ParticleField";
import { DragonEmblem } from "../components/DragonEmblem";
import { Wordmark } from "../components/Wordmark";
import { prog } from "../util/anim";
import { COLORS, FONT } from "../theme";

export const ColdOpen: React.FC = () => {
  const f = useCurrentFrame();
  const gather = prog(f, 0, 110);
  const reveal = prog(f, 80, 180);
  const shimmer = prog(f, 110, 210);
  const titleP = prog(f, 150, 250);
  const float = Math.sin(f / 20) * 6;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <ParticleField count={120} progress={gather} seed={1337} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <DragonEmblem size={520} reveal={reveal} shimmer={shimmer} float={float} />
        <Wordmark size={150} opacity={titleP} glow={interpolate(titleP, [0, 1], [0, 40])} />
        <div style={{ opacity: titleP, textAlign: "center" }}>
          <div style={{ fontFamily: FONT.zh, fontWeight: 500, fontSize: 40, color: COLORS.text }}>AI Agent CLI 的桌面工作台</div>
          <div style={{ fontFamily: FONT.en, fontSize: 26, letterSpacing: 2, color: COLORS.text2, marginTop: 10 }}>The Desktop Workbench for Agentic CLIs</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: 类型检查**

Run: `pnpm exec tsc --noEmit`
Expected: 无错误。

- [ ] **Step 3: 提交**

```bash
git add promo-video/src/scenes/ColdOpen.tsx
git commit -m "feat: scene 1 cold open"
```

---

### Task 11: 场景 ② Transform

**Files:**
- Create: `promo-video/src/scenes/Transform.tsx`

- [ ] **Step 1: 写 `Transform.tsx`（本地帧 0–360）**

时间线：
- 0–90：终端窗口居中，逐字打 `▸ claude`（用 `Math.floor(prog*len)` 截取），光标闪烁。
- 90–180：终端炸开 = `scale` 0.5→1 + opacity 转给 IDE；CodeRain 透明度峰值在此短暂出现。
- 120–300：`FakeIDE assemble = prog(f,120,300)`。
- 250–360：`BilingualTitle` 落版主标 + 角标淡入。

```tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { FakeIDE } from "../components/FakeIDE";
import { CodeRain } from "../components/CodeRain";
import { BilingualTitle } from "../components/BilingualTitle";
import { prog, fade } from "../util/anim";
import { COLORS, FONT } from "../theme";

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
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <CodeRain seed={88} opacity={rain} />
      {showTerminal && (
        <div style={{ position: "absolute", transform: `scale(${0.5 + burst * 0.5})`, opacity: 1 - burst, background: "rgba(0,0,0,0.55)", border: `1px solid ${COLORS.cardBorder}`, borderRadius: 18, padding: "40px 56px", fontFamily: FONT.en, fontSize: 40, color: COLORS.text }}>
          <span style={{ color: COLORS.text3 }}>~/project </span>{typed}<span style={{ opacity: blink ? 1 : 0, background: COLORS.purple }}>&nbsp;</span>
        </div>
      )}
      <div style={{ opacity: burst, transform: `scale(${0.9 + burst * 0.1})` }}>
        <FakeIDE assemble={assemble} />
      </div>
      <div style={{ position: "absolute", bottom: 180, width: "86%", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <BilingualTitle zh="把 Agentic CLI 装进桌面" en="Bring agentic CLIs into a desktop GUI" progress={titleP} zhSize={62} enSize={28} gold />
        <div style={{ opacity: interpolate(titleP, [0.5, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), fontFamily: FONT.zh, fontSize: 24, color: COLORS.text3 }}>
          现已支持 Claude Code · 更多 CLI 陆续接入　|　Claude Code today · more coming
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: 类型检查 + 提交**

Run: `pnpm exec tsc --noEmit`（无错误）

```bash
git add promo-video/src/scenes/Transform.tsx
git commit -m "feat: scene 2 CLI-to-IDE transform"
```

---

### Task 12: 场景 ③ Features

**Files:**
- Create: `promo-video/src/scenes/Features.tsx`

- [ ] **Step 1: 写 `Features.tsx`（本地帧 0–840，6 卡 × 140）**

数据数组 6 条；每卡本地进度 `cardProg = (f - i*140) / 140`，仅当 `0<=cardProg<=1` 渲染。顶部常驻一行小标题「核心能力 / Core Features」+ 背景龙影低透明缓游。

```tsx
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FeatureCard } from "../components/FeatureCard";
import { DragonEmblem } from "../components/DragonEmblem";
import { COLORS, FONT } from "../theme";

const FEATURES = [
  { icon: "🗂️", zh: "多会话并行 · 分屏自由平铺", en: "Parallel sessions, split-pane tiling" },
  { icon: "🛠️", zh: "终端 · 文件树 · Git · 代码编辑，全内置", en: "Terminal · Files · Git · Editor, built in" },
  { icon: "🧩", zh: "MCP · 插件 · 技能 · 子智能体", en: "MCP · Plugins · Skills · Subagents" },
  { icon: "🔀", zh: "自由切换模型供应商", en: "Swap model providers freely" },
  { icon: "📱", zh: "微信 / 飞书 · 手机远程驱动任务", en: "Drive tasks from your phone" },
  { icon: "💻", zh: "Windows · macOS · 内置自动更新", en: "Cross-platform, auto-updating" },
];

export const Features: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.min(FEATURES.length - 1, Math.floor(f / 140));
  const cardProg = (f - idx * 140) / 140;
  const drift = Math.sin(f / 60) * 30;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: -40, right: -120, opacity: 0.06, transform: `translateY(${drift}px)` }}>
        <DragonEmblem size={760} reveal={1} shimmer={(f % 200) / 200} />
      </div>
      <div style={{ position: "absolute", top: 150, fontFamily: FONT.en, letterSpacing: 6, fontSize: 24, color: COLORS.text3 }}>核 心 能 力 · CORE FEATURES</div>
      <FeatureCard {...FEATURES[idx]} progress={cardProg} />
      {/* 进度点 */}
      <div style={{ position: "absolute", bottom: 150, display: "flex", gap: 12 }}>
        {FEATURES.map((_, i) => (<div key={i} style={{ width: i === idx ? 30 : 10, height: 10, borderRadius: 999, background: i === idx ? COLORS.purple : "rgba(255,255,255,0.15)", transition: "all .2s" }} />))}
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: 类型检查 + 提交**

Run: `pnpm exec tsc --noEmit`（无错误）

```bash
git add promo-video/src/scenes/Features.tsx
git commit -m "feat: scene 3 feature waterfall"
```

---

### Task 13: 场景 ④ CTA

**Files:**
- Create: `promo-video/src/scenes/CTA.tsx`

- [ ] **Step 1: 写 `CTA.tsx`（本地帧 0–240）**

时间线：龙游回中心盘绕 reveal=`prog(f,0,70)` + shimmer 循环；字标 `prog(f,40,110)`；slogan `prog(f,70,140)`；CTA 按钮 + 平台胶囊 `prog(f,100,160)`，末段保持定格。

```tsx
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
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <DragonEmblem size={440} reveal={reveal} shimmer={(f % 180) / 180} float={float} />
        <Wordmark size={130} opacity={wm} glow={interpolate(wm, [0, 1], [0, 50])} />
        <BilingualTitle zh="让每个 CLI Agent，住进你的桌面" en="Every agentic CLI, at home on your desktop." progress={slogan} zhSize={44} enSize={26} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, opacity: cta, transform: `translateY(${(1 - cta) * 20}px)` }}>
          <div style={{ fontFamily: FONT.zh, fontWeight: 700, fontSize: 40, color: "#fff", background: GRAD.accent, padding: "18px 52px", borderRadius: 16, boxShadow: GLOW.purpleHard }}>立即下载 · Get LoongCode</div>
          <div style={{ display: "flex", gap: 14 }}>
            <GlowPill label="Windows" variant="ghost" />
            <GlowPill label="macOS" variant="ghost" />
            <GlowPill label="自动更新 Auto-update" variant="ghost" />
          </div>
          <div style={{ fontFamily: FONT.en, fontSize: 22, color: COLORS.text3, marginTop: 6 }}>release.loongcode.cc</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: 类型检查 + 提交**

Run: `pnpm exec tsc --noEmit`（无错误）

```bash
git add promo-video/src/scenes/CTA.tsx
git commit -m "feat: scene 4 CTA close"
```

---

### Task 14: 顶层合成 + 注册

**Files:**
- Create: `promo-video/src/LoongCodePromo.tsx`
- Create: `promo-video/src/Root.tsx`
- Create: `promo-video/src/index.ts`

- [ ] **Step 1: 写 `LoongCodePromo.tsx`（四幕时间轴 + 转场叠化 + 可选音轨）**

各幕用 `<Sequence from durationInFrames>`，相邻幕给 ~20 帧重叠淡入淡出（在各 scene 内已含首尾 fade，亦可在此包一层 opacity）。底层常驻 `GradientBG`。`<Audio>` 注释保留。

```tsx
import { AbsoluteFill, Sequence } from "remotion";
import { GradientBG } from "./components/GradientBG";
import { ColdOpen } from "./scenes/ColdOpen";
import { Transform } from "./scenes/Transform";
import { Features } from "./scenes/Features";
import { CTA } from "./scenes/CTA";
import { SCENES } from "./theme";
import "./util/fonts"; // 触发字体加载

export const LoongCodePromo: React.FC = () => (
  <AbsoluteFill>
    <GradientBG />
    {/* <Audio src={staticFile("music.mp3")} /> 放入 public/music.mp3 后启用 */}
    <Sequence from={SCENES.coldOpen.from} durationInFrames={SCENES.coldOpen.dur}><ColdOpen /></Sequence>
    <Sequence from={SCENES.transform.from} durationInFrames={SCENES.transform.dur}><Transform /></Sequence>
    <Sequence from={SCENES.features.from} durationInFrames={SCENES.features.dur}><Features /></Sequence>
    <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.dur}><CTA /></Sequence>
  </AbsoluteFill>
);
```

- [ ] **Step 2: 写 `Root.tsx`**

```tsx
import { Composition } from "remotion";
import { LoongCodePromo } from "./LoongCodePromo";
import { TOTAL, FPS } from "./theme";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="LoongCodePromo"
    component={LoongCodePromo}
    durationInFrames={TOTAL}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
```

- [ ] **Step 3: 写 `index.ts`**

```ts
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";
registerRoot(RemotionRoot);
```

- [ ] **Step 4: 在 `remotion.config.ts` 指定入口（如默认未识别）**

确认 `package.json` 的 remotion 入口；CLI 默认找 `src/index.ts`。如需显式：`remotion render src/index.ts LoongCodePromo ...`。

- [ ] **Step 5: 启动 Studio 验证四幕可预览**

Run: `pnpm preview`
Expected: 浏览器打开 Remotion Studio，时间轴 1740 帧，拖动可见四幕；无红屏报错；中文不缺字。

- [ ] **Step 6: 提交**

```bash
git add promo-video/src/LoongCodePromo.tsx promo-video/src/Root.tsx promo-video/src/index.ts
git commit -m "feat: compose four-act timeline and register composition"
```

---

### Task 15: 渲染产出 + 自检

**Files:**
- Output: `promo-video/out/loongcode-promo.mp4`
- Output: `promo-video/out/poster.png`

- [ ] **Step 1: 逐帧自检关键帧（still）**

Run: `pnpm exec remotion still LoongCodePromo out/check-150.png --frame=150`，再分别 `--frame=520 --frame=900 --frame=1700`。
Expected: 4 张 PNG 均成功生成，肉眼检查：龙显形、IDE 成形、特性卡、CTA 定版都正常，无缺字/错位。

- [ ] **Step 2: 完整渲染 MP4**

Run: `pnpm render`
Expected: 进度跑满，产出 `out/loongcode-promo.mp4`（1080×1920，~58s，30fps，H.264）。首次会自动下载无头 Chromium。

- [ ] **Step 3: 导出封面帧**

Run: `pnpm poster`
Expected: `out/poster.png`（1080×1920）。

- [ ] **Step 4: 校验产物**

Run: `pnpm exec remotion versions` 记录版本；用系统播放器或 `ffprobe out/loongcode-promo.mp4`（若有）确认分辨率/时长/帧率。
Expected: 1080×1920，约 58s，30fps。

- [ ] **Step 5: 提交（产物默认被 .gitignore；如需附带，单独决定）**

```bash
git add promo-video/docs 2>/dev/null; git commit -m "chore: render loongcode promo video" --allow-empty
```
（out/ 已忽略；如要入库成片，从 .gitignore 移除 out/ 再 add。由用户决定是否把 mp4 提交。）

---

## Self-Review

**Spec coverage（逐条对照 spec）：**
- 规格 1080×1920/30fps/58s/1740 帧 → Task 1（config）+ Task 14（Composition）✓
- 品牌令牌（暗背景/蓝紫/鎏金/光晕） → Task 2 theme.ts ✓
- 四幕分镜 → Task 10–13 ✓
- 可复现渲染（种子 PRNG） → Task 3（rng + 测试）+ 各组件用 mulberry32 ✓
- 字体就绪（中英 + delayRender） → Task 4 fonts.ts ✓
- 龙/字标/IDE/特性卡/双语标 组件 → Task 6–9 ✓
- 音轨槽位 → Task 14（注释 `<Audio>`）✓
- 中英双语 + 定位文案（Agentic CLI / 现支持 Claude Code，更多陆续接入） → ColdOpen/Transform/CTA 文案 ✓
- 输出 mp4 + 封面 → Task 15 ✓
- 验收标准（preview/render/可复现/无缺字） → Task 14 Step5、Task 15 ✓

**Placeholder scan：** 各 step 含真实代码或精确接口+关键样式数值；Task 6/8/9 的 JSX 给了完整可运行实现或带确切色值/尺寸的结构，执行时按注释补足细节即可，无 TODO/TBD。

**Type consistency：**
- `prog(frame,start,end)` / `fade(frame,...)`（anim.ts）在各 scene 一致调用 ✓
- `mulberry32(seed)` / `randRange(rng,min,max)`（rng.ts）在 ParticleField/CodeRain 一致 ✓
- 组件 props：`DragonEmblem{size,reveal,shimmer,float}`、`Wordmark{size,opacity,glow}`、`BilingualTitle{zh,en,progress,...}`、`FeatureCard{zh,en,icon,progress}`、`FakeIDE{assemble,width}` 在 scene 调用处签名一致 ✓
- `SCENES`/`TOTAL`/`FPS`（theme.ts）在 Root/LoongCodePromo 一致 ✓

潜在执行注意：`@remotion/google-fonts/NotoSansSC` 若包名不符，按 Task 4 fallback 用本地 woff2；png import 需 `types.d.ts`（Task 7 Step1）。
