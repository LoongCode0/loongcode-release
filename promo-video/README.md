# LoongCode 宣传片（Remotion）

竖屏 1080×1920 / 30fps / ~58s 的暗黑鎏金风 LoongCode 中英双语动效宣传片，纯 Remotion 生成。

设计与实现文档见仓库 `docs/superpowers/`：
- 设计：`docs/superpowers/specs/2026-06-09-loongcode-promo-video-design.md`
- 计划：`docs/superpowers/plans/2026-06-09-loongcode-promo-video.md`

## 命令（在本目录 `promo-video/` 下运行）

```bash
pnpm install        # 安装依赖（首次会提示允许 esbuild 构建，已在 pnpm-workspace.yaml 放行）
pnpm preview        # Remotion Studio 实时预览/调参
pnpm render         # 渲染成片 → out/loongcode-promo.mp4（H.264）
pnpm poster         # 导出封面帧 → out/poster.png（第 1720 帧）
pnpm typecheck      # tsc 类型检查
pnpm test           # vitest（rng 可复现性单测）
```

> 渲染复用**系统 Chrome**（`remotion.config.ts` 已指向 `C:\Program Files\Google\Chrome\Application\chrome.exe`，避免在受限网络下载无头 Shell）。
> 换机器或路径：设置环境变量 `REMOTION_BROWSER` 覆盖，或改 `remotion.config.ts`。

## 配乐（程序化生成）

配乐由脚本按视频时间轴合成（暗黑电影感，卡四幕 + 切屏节点），已用 `<Audio>` 接入：

```bash
python bin/gen_audio.py                                  # numpy 合成 → out/loongcode-promo.wav
ffmpeg -y -i out/loongcode-promo.wav -q:a 2 public/music.mp3   # 转 mp3 供 Remotion <Audio>
pnpm render                                              # 渲染并嵌入音频
```

- 依赖 `numpy`（`uv pip install numpy` 或 `pip install numpy`）。
- 改配乐：编辑 `bin/gen_audio.py` 顶部的 `SECTIONS`（和声时段）/ `ACCENTS`（冲击）/ `TICKS`（切屏点）。
- 想用自己的音乐：直接替换 `public/music.mp3` 即可（跳过脚本）。
- 不想重渲：可用 ffmpeg 把 wav 直接合成进现有 mp4（`-c:v copy -c:a aac -shortest`）。视觉已自带节拍卡点，静音也成立。

## 结构

```
src/
  Root.tsx            # 注册合成 LoongCodePromo（1080×1920@30fps，1740 帧）
  LoongCodePromo.tsx  # 四幕时间轴 + 常驻 GradientBG + 可选 <Audio>
  theme.ts            # 品牌令牌（取自真实代码库的暗背景/蓝紫/鎏金色值）
  scenes/             # ① ColdOpen ② Transform ③ Features ④ CTA
  components/         # DragonEmblem / Wordmark / FakeIDE / FeatureCard / Icons …
  util/               # rng(种子化可复现) / anim(缓动·转场) / fonts(字体加载)
```

改文案在各 `scenes/*.tsx` 与 `components/Features` 的 `FEATURES`；改配色在 `theme.ts`。

## 字体说明

中文用 Noto Sans SC、英文用 Sora/Inter，经 `@remotion/google-fonts` 加载（渲染期联网取字）。
若需**离线/更快**重渲（不依赖外网），可改为本地内嵌字体——见 `src/util/fonts.ts` 注释或按需替换为 `public/fonts/*.woff2` + `@remotion/fonts`。
