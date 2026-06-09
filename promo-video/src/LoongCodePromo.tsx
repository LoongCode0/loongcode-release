import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { GradientBG } from "./components/GradientBG";
import { ColdOpen } from "./scenes/ColdOpen";
import { Transform } from "./scenes/Transform";
import { Showcase } from "./scenes/Showcase";
import { Features } from "./scenes/Features";
import { CTA } from "./scenes/CTA";
import { SCENES } from "./theme";
import "./util/fonts"; // 触发字体加载

export const LoongCodePromo: React.FC = () => (
  <AbsoluteFill>
    <GradientBG />
    {/* <Audio src={staticFile("music.mp3")} /> 放入 public/music.mp3 后启用 */}
    <Sequence from={SCENES.coldOpen.from} durationInFrames={SCENES.coldOpen.dur}>
      <ColdOpen />
    </Sequence>
    <Sequence from={SCENES.transform.from} durationInFrames={SCENES.transform.dur}>
      <Transform />
    </Sequence>
    <Sequence from={SCENES.showcase.from} durationInFrames={SCENES.showcase.dur}>
      <Showcase />
    </Sequence>
    <Sequence from={SCENES.features.from} durationInFrames={SCENES.features.dur}>
      <Features />
    </Sequence>
    <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.dur}>
      <CTA />
    </Sequence>
  </AbsoluteFill>
);
