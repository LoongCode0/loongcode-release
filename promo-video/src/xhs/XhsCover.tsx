import React from "react";
import { AbsoluteFill } from "remotion";
import { LightBG } from "./components/LightBG";
import { Framed } from "../components/Framed";
import { DragonEmblem } from "../components/DragonEmblem";
import { GRAD, FONT } from "../theme";
import "../util/fonts"; // 触发字体加载

const DESKTOP_AR = 3840 / 2064;

// 紫蓝渐变文字（品牌强调色，在亮底上对比清晰）
const accentText: React.CSSProperties = {
  backgroundImage: GRAD.accent,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

// 图1 · 封面（亮色大字报 + 嵌一块暗色真实界面，形成反差）
export const XhsCover: React.FC = () => (
  <AbsoluteFill>
    <LightBG />

    <AbsoluteFill
      style={{ padding: "98px 76px 0", display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* 顶部标签 */}
      <span
        style={{
          fontFamily: FONT.zh,
          fontWeight: 600,
          fontSize: 27,
          letterSpacing: 1,
          color: "#3a3a46",
          background: "rgba(20,20,32,0.05)",
          border: "1.5px solid rgba(20,20,32,0.14)",
          borderRadius: 999,
          padding: "13px 32px",
        }}
      >
        AI Agent 编程 · 桌面工作台
      </span>

      {/* 主标题 */}
      <div
        style={{
          marginTop: 60,
          textAlign: "center",
          fontFamily: FONT.zh,
          fontWeight: 800,
          fontSize: 82,
          lineHeight: 1.36,
          color: "#15151c",
        }}
      >
        <div>
          别再直接对着
          <span
            style={{
              display: "inline-block",
              background: "#15151c",
              color: "#f3ead0",
              borderRadius: 16,
              padding: "0 22px",
              margin: "0 2px 0 10px",
              boxShadow: "0 14px 32px rgba(0,0,0,0.30)",
              transform: "rotate(-1.6deg)",
            }}
          >
            小黑窗
          </span>
        </div>
        <div>
          用{" "}
          <span style={{ ...accentText, fontFamily: FONT.display }}>Claude&nbsp;Code</span> 了
        </div>
      </div>

      {/* 副标题（功能性、不夸张） */}
      <div style={{ marginTop: 46, textAlign: "center" }}>
        <div style={{ fontFamily: FONT.zh, fontWeight: 500, fontSize: 35, lineHeight: 1.5, color: "#4f4f5b" }}>
          把命令行里的 Claude Code，搬进一个
          <b style={{ color: "#15151c", fontWeight: 700 }}>真正的桌面 IDE</b>
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: FONT.zh,
            fontWeight: 500,
            fontSize: 27,
            color: "#86868f",
            letterSpacing: 0.4,
          }}
        >
          多会话 · 分屏 · 终端 · 文件树 · Git Review，一个窗口全都有
        </div>
      </div>

      {/* 暗色真实界面：亮底里嵌暗界面的高级反差 */}
      <div style={{ marginTop: 62 }}>
        <Framed
          src="shots/02-split.png"
          width={872}
          height={872 / DESKTOP_AR}
          ar={DESKTOP_AR}
          radius={20}
          tilt={0.7}
          zoom={1.18}
          fx={0.5}
          fy={0.46}
        />
      </div>
    </AbsoluteFill>

    {/* 底部品牌条 */}
    <div
      style={{
        position: "absolute",
        bottom: 62,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <DragonEmblem size={66} reveal={1} shimmer={0.5} />
      <span style={{ ...accentText, fontFamily: FONT.display, fontWeight: 800, fontSize: 50 }}>LoongCode</span>
      <span style={{ width: 2, height: 38, background: "rgba(20,20,32,0.20)" }} />
      <span style={{ fontFamily: FONT.zh, fontWeight: 600, fontSize: 30, color: "#4f4f5b" }}>
        免费 · Windows / macOS
      </span>
    </div>
  </AbsoluteFill>
);
