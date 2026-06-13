import React from "react";
import { AbsoluteFill } from "remotion";
import { GradientBG } from "../components/GradientBG";
import { DragonEmblem } from "../components/DragonEmblem";
import { Wordmark } from "../components/Wordmark";
import { BilingualTitle } from "../components/BilingualTitle";
import { COLORS, FONT, GRAD, GLOW } from "../theme";
import "../util/fonts"; // 触发字体加载

const ROWS: { bad: string; good: string }[] = [
  { bad: "单窗口单会话，切任务靠记忆", good: "多任务多会话并行 + 分屏" },
  { bad: "纯文字滚屏，diff 看到眼花", good: "折叠卡 + Monaco diff 高亮" },
  { bad: "终端 / 文件 / Git 来回切", good: "同窗集成，选中即跟随" },
  { bad: "配 MCP / 技能改 JSON", good: "可视化点选启停" },
  { bad: "只能坐在电脑前", good: "手机微信 / 飞书远程驱动" },
  { bad: "装环境手敲命令", good: "依赖一键安装" },
];

const Cross: React.FC = () => (
  <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#e9728f" strokeWidth={2.6} strokeLinecap="round">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

const Check: React.FC = () => (
  <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#f4d98b" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const cellBase: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "22px 26px",
  borderRadius: 18,
  minHeight: 92,
  boxSizing: "border-box",
};

const Header: React.FC<{ children: React.ReactNode; good?: boolean }> = ({ children, good }) => (
  <div
    style={{
      textAlign: "center",
      padding: "16px 0",
      borderRadius: 16,
      fontFamily: FONT.display,
      fontWeight: 700,
      fontSize: 34,
      color: good ? "#fff" : COLORS.text2,
      background: good ? GRAD.accent : "rgba(255,255,255,0.05)",
      border: good ? "none" : `1px solid ${COLORS.cardBorder}`,
      boxShadow: good ? "0 12px 34px rgba(109,94,252,0.40)" : "none",
    }}
  >
    {children}
  </div>
);

// 图3 · CLI 对比（暗黑鎏金 · 左右对照 + CTA）
export const XhsCompare: React.FC = () => (
  <AbsoluteFill>
    <GradientBG />

    <div style={{ position: "absolute", top: -50, left: -150, opacity: 0.05 }}>
      <DragonEmblem size={640} reveal={1} shimmer={0.5} />
    </div>

    <AbsoluteFill style={{ padding: "112px 72px 86px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontFamily: FONT.en, letterSpacing: 6, fontSize: 22, color: COLORS.text3, marginBottom: 24 }}>
        正 面 对 比 · VS RAW CLI
      </div>

      <BilingualTitle
        zh="直接用 CLI vs 用 LoongCode"
        en="Raw CLI  vs  LoongCode"
        progress={1}
        zhSize={54}
        enSize={25}
      />

      {/* 对照表 */}
      <div style={{ marginTop: 46, display: "flex", flexDirection: "column", gap: 16, width: 936 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
          <Header>Claude Code CLI</Header>
          <Header good>LoongCode</Header>
        </div>

        {ROWS.map((r) => (
          <div key={r.bad} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            <div style={{ ...cellBase, background: "rgba(255,255,255,0.035)", border: `1px solid ${COLORS.cardBorder}` }}>
              <Cross />
              <span style={{ fontFamily: FONT.zh, fontWeight: 500, fontSize: 28, color: COLORS.text2, lineHeight: 1.3 }}>
                {r.bad}
              </span>
            </div>
            <div
              style={{
                ...cellBase,
                background: "rgba(109,94,252,0.10)",
                border: "1.5px solid rgba(109,94,252,0.42)",
              }}
            >
              <Check />
              <span style={{ fontFamily: FONT.zh, fontWeight: 600, fontSize: 28, color: COLORS.text, lineHeight: 1.3 }}>
                {r.good}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          padding: "30px 60px",
          borderRadius: 26,
          background: COLORS.cardBg,
          border: `1.5px solid rgba(244,217,139,0.30)`,
          boxShadow: GLOW.gold,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Wordmark size={48} glow={22} />
          <span style={{ fontFamily: FONT.zh, fontWeight: 700, fontSize: 32, color: COLORS.text }}>
            免费下载 · Win / macOS
          </span>
        </div>
        <div style={{ fontFamily: FONT.zh, fontWeight: 500, fontSize: 26, letterSpacing: 0.5, color: COLORS.gold1 }}>
          下载方式 → 主页简介 / 评论区
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
