import { loadFont as loadSora } from "@remotion/google-fonts/Sora";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadNotoSC } from "@remotion/google-fonts/NotoSansSC";

// 触发加载；Remotion 内部用 delayRender 等字体就绪，避免 headless 缺字。
export const sora = loadSora("normal", { weights: ["600", "700", "800"] });
export const inter = loadInter("normal", { weights: ["400", "500", "600"] });
export const noto = loadNotoSC("normal", { weights: ["400", "500", "700"] });

export const fontsReady = Promise.all([
  sora.waitUntilDone(),
  inter.waitUntilDone(),
  noto.waitUntilDone(),
]);
