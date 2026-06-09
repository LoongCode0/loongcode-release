import React from "react";
import { Img, staticFile } from "remotion";

// 真实截图相框：圆角 + 细描边 + 紫光 + 阴影 + 轻 3D 倾斜。
// 用 zoom/fx/fy 在固定视口内做「聚焦裁切」——放大主内容区，让密集 UI 更可读。
export const Framed: React.FC<{
  src: string;
  width: number;
  height: number;
  ar: number; // 图片宽高比 (w/h)
  radius?: number;
  tilt?: number; // 0..1
  zoom?: number; // >=1 放大裁切
  fx?: number; // 焦点 x 0..1
  fy?: number; // 焦点 y 0..1
}> = ({ src, width, height, ar, radius = 18, tilt = 0, zoom = 1, fx = 0.5, fy = 0.5 }) => {
  const imgW = width * zoom;
  const imgH = imgW / ar;
  return (
    <div style={{ perspective: 1900 }}>
      <div
        style={{
          width,
          height,
          position: "relative",
          overflow: "hidden",
          borderRadius: radius,
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 50px 130px rgba(0,0,0,0.6), 0 0 70px rgba(109,94,252,0.22)",
          transform: `rotateY(${-4 * tilt}deg) rotateX(${2.5 * tilt}deg)`,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            position: "absolute",
            width: imgW,
            height: imgH,
            left: width / 2 - fx * imgW,
            top: height / 2 - fy * imgH,
          }}
        />
      </div>
    </div>
  );
};
