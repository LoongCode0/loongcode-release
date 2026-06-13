import React from "react";
import { Composition } from "remotion";
import { LoongCodePromo } from "./LoongCodePromo";
import { XhsCover } from "./xhs/XhsCover";
import { XhsFeatures } from "./xhs/XhsFeatures";
import { XhsCompare } from "./xhs/XhsCompare";
import { TOTAL, FPS } from "./theme";

// 小红书图文贴：1080×1440（3:4）静态单帧
const XHS = { width: 1080, height: 1440, fps: FPS, durationInFrames: 1 } as const;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="LoongCodePromo"
      component={LoongCodePromo}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition id="XhsCover" component={XhsCover} {...XHS} />
    <Composition id="XhsFeatures" component={XhsFeatures} {...XHS} />
    <Composition id="XhsCompare" component={XhsCompare} {...XHS} />
  </>
);
