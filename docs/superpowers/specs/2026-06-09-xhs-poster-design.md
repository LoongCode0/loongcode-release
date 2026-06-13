# LoongCode 小红书宣传图 + 文案 — 设计文档

> 日期：2026-06-09 ｜ 形式：小红书 3 图轮播笔记 ｜ 渲染：Remotion（静态 PNG）

## 1. 目标

为 LoongCode 产出一篇可直接发布的小红书种草笔记，包含 **3 张图片**（Remotion 渲染）+ **一份正文文案**。

- **标题策略**：冲突引流，犀利点名 Claude Code CLI。
- **内容主线**：介绍核心功能 + 相比「直接用 Claude Code CLI」的优势。
- **视觉策略**：封面用**亮色大字报**抢点击；内页 2 张用**暗黑鎏金**保品牌质感（混搭）。

## 2. 规格

| 项 | 设定 |
| --- | --- |
| 平台 / 形式 | 小红书 · 3 图轮播 |
| 尺寸 | **1080 × 1440（3:4 竖版）** —— 小红书点击率最优比例 |
| 渲染方式 | 在现有 `promo-video/` 工程内新增 3 个 Remotion `<Composition>`，用 `remotion still` 导出单帧 PNG |
| 复用资产 | 真实界面截图（`public/shots/02-split.png` 等）、龙纹 `DragonEmblem`、`theme.ts` 配色、字体加载 |

## 3. 三张图设计

### 图1 · 封面（亮色大字报 + 嵌一角暗色真实界面）

- 背景：浅暖白渐变 + 极淡紫蓝光晕角，科技感网格暗示。
- 主标题（深黑超大，Noto Sans SC 800）：
  > 别再直接对着**「小黑窗」**用 **Claude Code** 了
  - 「小黑窗」高亮（深色块/紫）；「Claude Code」紫蓝渐变。
- 副标题（**功能性、不夸张**）：
  > 把命令行里的 Claude Code，搬进一个真正的桌面 IDE
  > 多会话 · 分屏 · 终端 · 文件树 · Git Review，一个窗口全都有
- 右下：`02-split.png`（分屏对话）斜放露出一角 → 亮底嵌暗界面的反差。
- 底部品牌条：龙纹 + LoongCode（亮底深色版字标）+ 「免费 · Windows / macOS」。

### 图2 · 核心功能（暗黑鎏金 · 真实界面打底）

- 暗黑渐变背景 + 角落淡龙纹。
- 标题：**一个窗口，把 CLI 变成 IDE** ／ One window. CLI → IDE.
- 主视觉：`02-split.png`（招牌分屏功能）用 `Framed` 悬浮窗 + 光晕 + 轻 3D。
- 6 个功能点（鎏金图标圆 + 中文 + 英文小字，2×3 网格）：
  1. 多任务并行 / Parallel, resumable sessions
  2. 分屏对话 / Split-pane, cross-workspace
  3. 集成终端 + 文件树 / Terminal · Files · Monaco
  4. Git Review / Branch · diff · ✨ commit msg
  5. 可视化扩展 / MCP · Skills · Plugins · Subagents
  6. 手机远程驱动 / WeChat ClawBot · Lark
- 底部：小 wordmark。

### 图3 · CLI 对比（暗黑鎏金 · 左右对照 + CTA）

- 标题：**直接用 CLI　vs　用 LoongCode** ／ Raw CLI vs LoongCode
- 两列对照（左=暗灰痛点卡，右=紫蓝渐变解法卡），6 行：

  | 😮‍💨 Claude Code CLI | ✨ LoongCode |
  | --- | --- |
  | 单窗口单会话，切任务靠记忆 | 多任务多会话并行 + 分屏 |
  | 纯文字滚屏，diff 看到眼花 | 折叠卡 + Monaco diff 高亮 |
  | 终端 / 文件 / Git 来回切 | 同窗集成，选中即跟随 |
  | 配 MCP / 技能改 JSON | 可视化点选启停 |
  | 只能坐电脑前 | 手机微信 / 飞书远程驱动 |
  | 装环境手敲命令 | 依赖一键安装 |

- 底部 CTA：🐉 LoongCode · 免费下载 · Win / macOS ＋ 版本时间线短链。
- 说明角标：模型能力 = 原版（它就是拉起本机 `claude` CLI），变的只是体验。

## 4. 正文文案（复制即发）

**标题**：别再直接对着小黑窗用 Claude Code 了😮‍💨 我把它塞进了桌面 IDE

**正文**：
用了大半年 Claude Code，能力是真强，但每天对着小黑窗敲命令、滚屏看 diff、切任务全靠脑子记……是真的累😮‍💨
后来换成 LoongCode —— 它本质就是 Claude Code 的「桌面 IDE 外壳」👇
✅ 多任务并行 + 分屏对话，左右两个会话同时跑
✅ 终端 + 文件树 + Monaco + Git Review，全集成在一个窗口
✅ MCP / 技能 / 插件 / 子智能体，全部可视化点选，不用再改 JSON
✅ 出门在外，微信 / 飞书手机就能远程发任务
✅ 没装 Claude Code CLI / Git？应用内一键装好
模型能力完全等于原版（它就是拉起你本机的 `claude` CLI），变的只是体验——从命令行跨到 IDE。
免费，Windows / macOS 都有，自带自动更新🚀

**标签**：#ClaudeCode #AI编程 #AIAgent #vibecoding #程序员 #Cursor替代 #效率工具 #AI工具

## 5. 技术实现

### 文件结构（新增）

```
promo-video/src/xhs/
  XhsRoot.tsx          # 注册 3 个 1080×1440 Composition（也可并入现有 Root.tsx）
  XhsCover.tsx         # 图1 封面（亮色）
  XhsFeatures.tsx      # 图2 功能（暗黑鎏金）
  XhsCompare.tsx       # 图3 对比（暗黑鎏金）
  components/
    LightBG.tsx        # 封面亮色背景
    FeatureRow.tsx     # 功能行（紧凑）
    CompareRow.tsx     # 对比行
```

- 复用：`theme.ts`、`util/fonts`、`DragonEmblem`、`Framed`、`Wordmark`、`Icons`。
- 静态图：动画组件传终态参数（`progress=1` / `reveal=1` / `enter=1`），不依赖 `useCurrentFrame`。
- 字体：各组件 `import "../util/fonts"` 触发加载，Remotion 用 `delayRender` 等字体就绪，避免 headless 缺字。

### 注册与渲染

在 `Root.tsx` 追加 3 个 `<Composition>`（width=1080, height=1440, durationInFrames=1, fps=30）。

新增 npm scripts：
```jsonc
"xhs:cover":    "remotion still XhsCover    out/xhs/01-cover.png    --frame=0",
"xhs:features": "remotion still XhsFeatures out/xhs/02-features.png --frame=0",
"xhs:compare":  "remotion still XhsCompare  out/xhs/03-compare.png  --frame=0",
"xhs":          "pnpm xhs:cover && pnpm xhs:features && pnpm xhs:compare"
```

输出：`promo-video/out/xhs/01-cover.png`、`02-features.png`、`03-compare.png`。

## 6. 交付物清单

- [ ] `promo-video/out/xhs/01-cover.png`（封面）
- [ ] `promo-video/out/xhs/02-features.png`（核心功能）
- [ ] `promo-video/out/xhs/03-compare.png`（CLI 对比）
- [ ] `docs/xhs/2026-06-09-xhs-copy.md`（正文文案，复制即发）
- [ ] 新增 Remotion 源码（`promo-video/src/xhs/**`）+ Root 注册 + npm scripts

## 7. 不做（YAGNI）

- 不做动图 / 视频（本次只要静态图文贴）。
- 不改动现有宣传片 `LoongCodePromo` 及其资产。
- 不引入新字体 / 新依赖（沿用已装的 Sora / Inter / Noto Sans SC）。
