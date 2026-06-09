# LoongCode 宣传片 · 设计文档（Spec）

> 日期：2026-06-09 · 状态：已通过头脑风暴评审，待实现
> 产物：竖屏暗黑鎏金风格动效宣传片（Remotion 生成 MP4）

## 1. 目标与定位

为 **LoongCode** 制作一支酷炫的、暗黑风格的竖屏宣传片，用纯动效（motion graphics）讲清楚产品价值并强化品牌记忆点（鎏金游龙）。

**产品定位（权威表述，落到文案）**：

> LoongCode 是**把 Agentic CLI 工具装进桌面 GUI 的工作台**。它给命令行里的 AI 编程 Agent 一个真正的 IDE 式界面。**现已支持 Claude Code，更多 CLI 后续陆续接入。**

- 不要表述为「仅 Claude Code 专属外壳」。Claude Code 是当前唯一支持的 CLI，但产品是面向「Agentic CLI harness」这一品类的通用工作台。
- 应用本身不直接调用模型 API；模型能力由被拉起的 CLI 子进程提供（宣传片不需强调这一技术细节，但文案不得与之矛盾）。

## 2. 成片规格

| 项 | 值 |
| --- | --- |
| 画幅 | 竖屏 1080 × 1920（9:16） |
| 帧率 | 30 fps |
| 时长 | ~58 秒（1740 帧） |
| 形式 | 纯 Remotion 动效，无需外部截图素材 |
| 文案 | 中英双语（中文主、英文副） |
| 风格 | 暗黑 + 蓝紫渐变 + 鎏金游龙 |
| 音频 | 预留音轨槽位（默认关闭）；静音即好看 |
| 输出 | `out/loongcode-promo.mp4`（H.264）+ 一张封面帧 PNG |

## 3. 品牌视觉令牌（取自真实代码库）

来源：`longlong-ade` 的 `src/styles/globals.css`、`public/logo.png`，以及发布站 `docs/assets/styles.css`、`docs/favicon.svg`。

```
背景       #08080d  (深空黑，带蓝调)
背景光晕   radial purple rgba(109,94,252,.20) @ 78% -8%
           radial blue   rgba(47,109,246,.13) @ 5% 16%
蓝紫渐变   linear 135deg #6d5efc → #2f6df6   （主点缀 / 描边 / 按钮 / 节点）
鎏金渐变   linear 135deg #f4d98b → #caa45a   （字标 / 龙 / 主标题）
规划金     #d8b370
文字       #ececf2 主 / #9a9ab0 次 / #6b6b82 弱
紫光       rgba(109,94,252,.35~.85)  （辉光 / 阴影 / 脉冲）
卡片       bg rgba(255,255,255,.045)  border rgba(255,255,255,.09)  毛玻璃 blur(8px)
```

- 龙：直接复用 `longlong-ade/public/logo.png`（鎏金中国龙，透明底），叠加辉光 / 流光 / 粒子，不做 3D 绑定。
- 字标：`LoongCode`，鎏金渐变文字（`-webkit-background-clip:text`）。

## 4. 四幕分镜（30fps 帧时间轴）

总时长 1740 帧。

### ① 冷开场 — 鎏金觉醒（帧 0–300，0–10s）

- 0–90：全黑起手；蓝紫粒子（种子化）从四周向中心吸入。
- 90–180：粒子凝聚成**金龙剪影/徽记**（logo.png 由暗到亮 + 鳞片鎏金流光横扫一遍）。
- 150–270：`LoongCode` 鎏金字标自下而上「点燃」浮现，紫蓝光晕向外扩散；副标淡入。
- 270–300：轻微呼吸 + 保持，准备转场。
- 文案：主 `LoongCode`（鎏金大字标）/ 副「AI Agent CLI 的桌面工作台」/ *The Desktop Workbench for Agentic CLIs*

### ② 蜕变 — 从 CLI 到 IDE（帧 300–660，10–22s）

- 300–390：场景收束为一个**孤独的终端窗口**，光标闪烁，逐字敲入 `▸ claude`。
- 390–480：终端框**炸裂 / 展开**（scale + 裂格 + 光爆）成竖屏 IDE 骨架轮廓。
- 480–600：面板自上而下逐个飞入归位——顶栏 → 对话气泡（用户/AI）→ 文件树 → 集成终端 → Git 变更条；龙气（鎏金光流）从顶贯下点亮各面板。
- 600–660：落版主标语。
- 文案：过场「命令行的力量，配得上一个真正的 IDE」/ *CLI power deserves a real IDE.*
  → 落版「**把 Agentic CLI 装进桌面**」/ *Bring agentic CLIs into a desktop GUI*
  → 角标「现已支持 Claude Code · 更多陆续接入」/ *Claude Code today · more harnesses coming*

### ③ 特性流 — 节奏卡点（帧 660–1500，22–50s）

- 6 张玻璃拟态卡片纵向滑过，每张约 140 帧（~4.67s）：入场（滑入+描边点亮）→ 停留（迷你动效）→ 出场（上滑虚化）。
- 背景：龙影缓慢游动贯穿；蓝紫渐变描边 + 金色高光扫过。
- 每卡内容（中文主 / 英文副 / 迷你视觉）：

| # | 中文 | English | 迷你动效 |
| --- | --- | --- | --- |
| 1 | 多会话并行 · 分屏自由平铺 | Parallel sessions, split-pane tiling | 多个对话分栏平铺/拖动 |
| 2 | 终端 · 文件树 · Git · 代码编辑，全内置 | Terminal · Files · Git · Editor, built in | 面板四宫格点亮 + 终端光标 |
| 3 | MCP · 插件 · 技能 · 子智能体 | MCP · Plugins · Skills · Subagents | 节点图/能力卡依次点亮 |
| 4 | 自由切换模型供应商 | Swap model providers freely | 供应商 chip 轮换切换 |
| 5 | 微信 / 飞书 · 手机远程驱动任务 | Drive tasks from your phone | 手机轮廓发光 + 消息气泡 |
| 6 | Windows · macOS · 内置自动更新 | Cross-platform, auto-updating | OS 徽标 + 更新脉冲 |

### ④ CTA 收束 — 龙印定版（帧 1500–1740，50–58s）

- 1500–1590：背景特性卡退散，金龙游回中心**盘绕收成印章/徽记**。
- 1560–1680：鎏金字标定版；双语 slogan 浮现；下载引导 + 平台徽标脉冲发光。
- 1680–1740：整体轻呼吸保持，末帧定格（用作封面）。
- 文案：「让每个 CLI Agent，住进你的桌面」/ *Every agentic CLI, at home on your desktop.*
  CTA「**立即下载** · Get LoongCode」 + 平台 `Windows / macOS`

## 5. 技术架构

### 位置与栈

- 位置：`longcode_release/promo-video/`（自包含 Remotion 子项目，**不**进入已发布的 `docs/` 站点）。
- 栈：Remotion 4.x + React 19 + TypeScript；包管理 pnpm。
- 合成：`1080×1920 @ 30fps`，`durationInFrames=1740`。

### 目录结构

```
promo-video/
  package.json
  tsconfig.json
  remotion.config.ts
  src/
    index.ts              # registerRoot
    Root.tsx              # <Composition> 注册
    LoongCodePromo.tsx    # 顶层时间轴：四幕 <Sequence>
    theme.ts              # 品牌令牌（颜色/渐变/字体/缓动）
    util/
      rng.ts              # mulberry32 种子化 PRNG（保证可复现渲染）
      easing.ts           # 共享缓动/插值助手
      fonts.ts            # @remotion/google-fonts 加载 + delayRender 等字体
    scenes/
      ColdOpen.tsx        # ①
      Transform.tsx       # ②
      Features.tsx        # ③（驱动 6 张 FeatureCard）
      CTA.tsx             # ④
    components/
      GradientBG.tsx      # 暗背景 + 双径向光晕（全片底层）
      ParticleField.tsx   # 种子化粒子（吸入/汇聚）
      DragonEmblem.tsx    # 金龙：logo.png + 辉光 + 鎏金流光 mask
      Wordmark.tsx        # 鎏金 LoongCode 文字
      BilingualTitle.tsx  # 中文主 + 英文副 动态排版
      CodeRain.tsx        # 品牌色代码流（②背景点缀）
      FakeIDE.tsx         # 竖屏重绘 IDE（顶栏/对话/文件树/终端/Git）
      FeatureCard.tsx     # 玻璃拟态卡 + 迷你动效插槽
      GlowPill.tsx        # 平台/标签胶囊
    assets/
      logo.png            # 复制自 longlong-ade/public/logo.png
  public/
    (music.mp3 可选，用户自备)
  out/
    loongcode-promo.mp4   # 渲染产物
    poster.png            # 封面帧
```

### 关键约束与做法

- **可复现渲染**：禁止渲染期 `Math.random()`/`Date.now()`；粒子等随机量一律走 `mulberry32(seed)`。
- **字体就绪**：中文 Noto Sans SC + 英文几何无衬线，经 `@remotion/google-fonts` 加载并 `delayRender`/`continueRender` 包裹，避免 headless Chrome 缺字。
- **性能**：大面积 blur/glow 控制层数；优先用预合成的渐变/阴影而非每帧重算重滤镜。
- **音轨**：`LoongCodePromo.tsx` 内含被注释的 `<Audio src={staticFile('music.mp3')} />`；放开即生效。视觉在每幕边界自带节拍卡点，静音可独立成片。

### 脚本与产出

```
pnpm install
pnpm preview     # = remotion studio（实时预览/调参）
pnpm render      # = remotion render LoongCodePromo out/loongcode-promo.mp4 (H.264)
pnpm poster      # = remotion still LoongCodePromo out/poster.png --frame=1720
```

- 首次渲染 Remotion 会自动拉取无头 Chromium。
- 渲染产物 `out/loongcode-promo.mp4`；末段定格帧导出封面。

## 6. 验收标准

- [ ] `pnpm preview` 可在 Remotion Studio 正常打开并逐帧预览四幕。
- [ ] `pnpm render` 成功产出 1080×1920、~58s、30fps 的 H.264 MP4。
- [ ] 画面与品牌令牌一致（暗背景 / 蓝紫渐变 / 鎏金龙与字标）。
- [ ] 文案为中英双语，且定位表述与「Agentic CLI 工作台 / 现支持 Claude Code，更多陆续接入」一致。
- [ ] 渲染可复现（同帧两次渲染像素一致），无缺字、无明显跳帧。
- [ ] 预留音轨槽位，放入 mp3 即可发声。

## 7. 风险与权衡

- **龙的表现力**：不做 3D 绑定，用真实金龙 PNG + 辉光/流光/粒子达成电影感；若静态龙偏「贴图感」，用呼吸缩放 + 鳞片流光 mask + 视差缓解。
- **CJK 字体体积**：Noto Sans SC 较大，仅本地渲染使用，可接受；必要时按字幕子集化。
- **渲染时长**：1740 帧含较多滤镜，单机多核数分钟级，可接受。
- **配乐**：本地无法生成音频，成片以视觉节拍为主；文档另附免版税配乐渠道，用户自备 mp3 卡点。

## 8. 后续（非本次范围）

- 横屏 16:9 / 方形 1:1 衍生版（复用组件，换合成尺寸与排版）。
- 真实 app 截图穿插的「混合版」。
- 多语言纯英文版 / 纯中文版切换。
