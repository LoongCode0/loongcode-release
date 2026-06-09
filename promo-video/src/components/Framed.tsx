import React from "react";
import { Img, staticFile } from "remotion";

// 真实截图统一相框：圆角 + 细描边 + 紫光 + 阴影 + 微 3D 倾斜；
// imgScale/panX 提供缓慢 Ken Burns（截图自带窗口 chrome，故不再叠标题栏）。
export const Framed: React.FC<{
  src: string;
  width: number;
  radius?: number;
  tilt?: number;
  imgScale?: number;
  panX?: number;
}> = ({ src, width, radius = 18, tilt = 0, imgScale = 1, panX = 0 }) => (
  <div style={{ perspective: 1800 }}>
    <div
      style={{
        width,
        borderRadius: radius,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow:
          "0 50px 130px rgba(0,0,0,0.6), 0 0 70px rgba(109,94,252,0.22)",
        transform: `rotateY(${-7 * tilt}deg) rotateX(${4 * tilt}deg)`,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          display: "block",
          transform: `scale(${imgScale}) translateX(${panX}px)`,
        }}
      />
    </div>
  </div>
);
