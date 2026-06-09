import React from "react";
import { Img } from "remotion";
import logo from "../assets/logo.png";

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
