import React from "react";
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
