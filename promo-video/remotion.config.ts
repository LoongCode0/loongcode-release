import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
Config.setCrf(18); // 高画质
Config.setConcurrency(null); // 自动用满核心

// 本机已装 Chrome；复用系统 Chrome，避免在受限网络下载无头 Shell。
// 可用环境变量 REMOTION_BROWSER 覆盖路径。
const sysChrome =
  (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env?.REMOTION_BROWSER ??
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
Config.setBrowserExecutable(sysChrome);
