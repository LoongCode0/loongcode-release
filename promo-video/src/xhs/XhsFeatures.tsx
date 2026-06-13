import React from "react";
import { AbsoluteFill } from "remotion";
import { GradientBG } from "../components/GradientBG";
import { DragonEmblem } from "../components/DragonEmblem";
import { Framed } from "../components/Framed";
import { Wordmark } from "../components/Wordmark";
import { BilingualTitle } from "../components/BilingualTitle";
import { Icon, IconName } from "../components/Icons";
import { COLORS, FONT, GRAD, GLOW } from "../theme";
import "../util/fonts"; // 触发字体加载

const DESKTOP_AR = 3840 / 2064;

const FEATURES: { icon: IconName; zh: string; en: string }[] = [
  { icon: "refresh", zh: "多任务并行", en: "Parallel, resumable sessions" },
  { icon: "layout", zh: "分屏对话", en: "Split-pane, cross-workspace" },
  { icon: "tools", zh: "终端 + 文件树", en: "Terminal · Files · Monaco" },
  { icon: "swap", zh: "Git Review", en: "Branch · diff · commit msg" },
  { icon: "puzzle", zh: "可视化扩展", en: "MCP · Skills · Plugins" },
  { icon: "phone", zh: "手机远程驱动", en: "WeChat ClawBot · Lark" },
];

const FeatureRow: React.FC<{ icon: IconName; zh: string; en: string }> = ({ icon, zh, en }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
    <div
      style={{
        width: 86,
        height: 86,
        flexShrink: 0,
        borderRadius: 22,
        background: GRAD.accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: GLOW.purpleSoft,
      }}
    >
      <Icon name={icon} size={46} />
    </div>
    <div>
      <div style={{ fontFamily: FONT.zh, fontWeight: 700, fontSize: 34, color: COLORS.text }}>{zh}</div>
      <div style={{ fontFamily: FONT.en, fontWeight: 500, fontSize: 21, color: COLORS.text2, marginTop: 5 }}>
        {en}
      </div>
    </div>
  </div>
);

// 图2 · 核心功能（暗黑鎏金 · 真实界面打底）
export const XhsFeatures: React.FC = () => (
  <AbsoluteFill>
    <GradientBG />

    {/* 角落淡龙纹 */}
    <div style={{ position: "absolute", top: -40, right: -130, opacity: 0.06 }}>
      <DragonEmblem size={680} reveal={1} shimmer={0.5} />
    </div>

    <AbsoluteFill style={{ padding: "120px 72px 92px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontFamily: FONT.en, letterSpacing: 6, fontSize: 22, color: COLORS.text3, marginBottom: 26 }}>
        核 心 功 能 · WHY LOONGCODE
      </div>

      <BilingualTitle
        zh="一个窗口，把 CLI 变成 IDE"
        en="One window. CLI → IDE."
        progress={1}
        gold
        zhSize={60}
        enSize={27}
      />

      <div style={{ marginTop: 50 }}>
        <Framed
          src="shots/02-split.png"
          width={866}
          height={866 / DESKTOP_AR}
          ar={DESKTOP_AR}
          radius={18}
          tilt={0.6}
          zoom={1.2}
          fx={0.5}
          fy={0.46}
        />
      </div>

      <div
        style={{
          marginTop: 56,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px 52px",
          width: 936,
        }}
      >
        {FEATURES.map((ft) => (
          <FeatureRow key={ft.zh} {...ft} />
        ))}
      </div>
    </AbsoluteFill>

    {/* 底部品牌条 */}
    <div
      style={{
        position: "absolute",
        bottom: 52,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 14,
      }}
    >
      <Wordmark size={38} glow={18} />
      <span style={{ fontFamily: FONT.zh, fontWeight: 500, fontSize: 25, color: COLORS.text3 }}>
        · 免费 · Windows / macOS
      </span>
    </div>
  </AbsoluteFill>
);
