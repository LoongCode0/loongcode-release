import React from "react";
import { COLORS, GRAD, FONT } from "../theme";

const Dot: React.FC<{ c: string }> = ({ c }) => (
  <span
    style={{
      width: 14,
      height: 14,
      borderRadius: "50%",
      background: c,
      display: "inline-block",
    }}
  />
);

const Panel: React.FC<{
  p: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ p, children, style }) => (
  <div
    style={{
      transform: `translateY(${(1 - p) * 40}px)`,
      opacity: p,
      background: COLORS.cardBg,
      border: `1px solid ${COLORS.cardBorder}`,
      borderRadius: 22,
      padding: 18,
      backdropFilter: "blur(8px)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const FakeIDE: React.FC<{ assemble: number; width?: number }> = ({
  assemble,
  width = 760,
}) => {
  const seg = (k: number) => Math.min(1, Math.max(0, (assemble - k * 0.16) / 0.4));
  const bubble: React.CSSProperties = {
    borderRadius: 16,
    padding: "12px 16px",
    fontFamily: FONT.zh,
    fontSize: 24,
    maxWidth: "78%",
  };
  return (
    <div style={{ width, display: "flex", flexDirection: "column", gap: 18 }}>
      {/* 顶栏 */}
      <Panel
        p={seg(0)}
        style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px" }}
      >
        <Dot c="#ff5f57" />
        <Dot c="#febc2e" />
        <Dot c="#28c840" />
        <span
          style={{
            marginLeft: 8,
            fontFamily: FONT.display,
            fontWeight: 800,
            fontSize: 22,
            backgroundImage: GRAD.gold,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          LoongCode
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: FONT.en,
            fontSize: 18,
            color: COLORS.text3,
          }}
        >
          task · refactor-auth
        </span>
      </Panel>
      {/* 对话 */}
      <Panel
        p={seg(1)}
        style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 220 }}
      >
        <div style={{ alignSelf: "flex-end", ...bubble, background: GRAD.accent, color: "#fff" }}>
          帮我重构登录鉴权模块
        </div>
        <div
          style={{
            alignSelf: "flex-start",
            ...bubble,
            background: "rgba(255,255,255,0.06)",
            color: COLORS.text,
          }}
        >
          已定位 3 处可优化，开始修改…
        </div>
        <div
          style={{
            alignSelf: "flex-start",
            display: "flex",
            gap: 8,
            alignItems: "center",
            fontFamily: FONT.en,
            fontSize: 18,
            color: COLORS.text2,
            border: `1px solid ${COLORS.cardBorder}`,
            borderRadius: 12,
            padding: "8px 12px",
          }}
        >
          ▸ Edit · auth.ts <span style={{ color: "#28c840" }}>+24 −7</span>
        </div>
      </Panel>
      {/* 文件树 + 终端 横排 */}
      <div style={{ display: "flex", gap: 18 }}>
        <Panel
          p={seg(2)}
          style={{
            flex: 1,
            fontFamily: FONT.en,
            fontSize: 19,
            color: COLORS.text2,
            lineHeight: 1.9,
          }}
        >
          <div>📁 src</div>
          <div style={{ paddingLeft: 18 }}>📄 auth.ts</div>
          <div style={{ paddingLeft: 18, color: COLORS.text }}>📄 store.ts</div>
          <div>📁 components</div>
        </Panel>
        <Panel
          p={seg(3)}
          style={{
            flex: 1.2,
            fontFamily: FONT.en,
            fontSize: 19,
            background: "rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ color: COLORS.text3 }}>~/project</div>
          <div style={{ color: COLORS.text }}>
            ▸ claude
            <span style={{ background: COLORS.purple, marginLeft: 2 }}>&nbsp;</span>
          </div>
        </Panel>
      </div>
      {/* Git 变更条 */}
      <Panel
        p={seg(4)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: FONT.en,
          fontSize: 18,
          color: COLORS.text2,
        }}
      >
        <span style={{ color: COLORS.purple }}>⎇ main</span>
        <span style={{ color: "#28c840" }}>+24</span>
        <span style={{ color: "#ff5f57" }}>−7</span>
        <span style={{ marginLeft: "auto" }}>✨ 生成提交信息</span>
      </Panel>
    </div>
  );
};
