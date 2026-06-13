import React from "react";
import { AbsoluteFill } from "remotion";

// 封面专用亮色背景：浅暖白渐变 + 极淡紫蓝/鎏金光晕角 + 中心淡出的科技网格。
// 与内页的暗黑 GradientBG 形成「亮封面 / 暗内页」混搭。
export const LightBG: React.FC = () => (
  <AbsoluteFill
    style={{ background: "linear-gradient(162deg, #f8f5ee 0%, #efe9dd 58%, #e7dfcf 100%)" }}
  >
    <AbsoluteFill
      style={{
        backgroundImage: `
          radial-gradient(880px 620px at 86% -6%, rgba(109,94,252,0.20), transparent 60%),
          radial-gradient(720px 620px at -4% 14%, rgba(47,109,246,0.13), transparent 56%),
          radial-gradient(680px 520px at 50% 118%, rgba(202,164,90,0.16), transparent 60%)
        `,
      }}
    />
    {/* 细网格暗示科技感，向中心淡出，避免压住文字 */}
    <AbsoluteFill
      style={{
        backgroundImage: `
          linear-gradient(rgba(20,20,32,0.045) 1px, transparent 1px),
          linear-gradient(90deg, rgba(20,20,32,0.045) 1px, transparent 1px)
        `,
        backgroundSize: "56px 56px",
        WebkitMaskImage: "radial-gradient(circle at 50% 42%, #000 26%, transparent 76%)",
        maskImage: "radial-gradient(circle at 50% 42%, #000 26%, transparent 76%)",
      }}
    />
  </AbsoluteFill>
);
