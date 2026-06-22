# LoongCode 版本时间线静态站 · 设计文档

> 日期 2026-06-09 · 状态:已通过头脑风暴确认,待编写实现计划
> 仓库:`loongcode-release`(发布仓库,本设计落地于此)
> 内容来源:`../longlong-ade`(源码主仓库,**全程只读,禁止修改**)

## 1. 目标

为 LoongCode 搭建一个**时间线静态站**,放在发布仓库并用 GitHub Pages 托管,用来:

- 以**时间线**形式展示每个已发布版本的**功能摘要**(0.1.0 → 0.6.0,共 6 个里程碑 + 13 个补丁);
- 展示**后续版本规划**(roadmap),与已发布版本同处一条时间线;
- 让访客一眼看清「已完成 / 待开发 / 进度」。

## 2. 关键约束

- **源仓库只读**:版本内容提炼自 `../longlong-ade/docs/RELEASE_NOTES_*.md`,但**不修改**该仓库;内容一次性提炼进本仓库的数据文件。
- **GitHub Pages CI 无源仓库**:发布仓库的 Pages 环境里不存在 `longlong-ade`,因此**不能**在线实时解析源仓库发布说明 → 采用「数据文件即唯一内容源」。
- **保持发布仓库干净**:发布仓库当前仅有 `README.md`,主职责是安装包发布与自动更新源(`latest.json`)。站点必须**零构建、零依赖、零 CI**,只新增静态文件。

## 3. 架构(零构建 · 数据驱动)

- 纯 `HTML + CSS + 原生 JS`,无框架、无打包、无构建步骤。
- 站点位于本仓库 `docs/` 目录;GitHub Pages 设为「**从分支 `main` 的 `/docs` 目录**发布」。
- 访问地址:`https://release.loongcode.cc`
- 加 `docs/.nojekyll` 空文件,禁用 GitHub Pages 的 Jekyll 处理,确保纯静态资源按原样服务。
- 内容与代码分离:页面渲染逻辑读取 JSON 数据文件,**新增版本 = 改一行 JSON,不碰代码**。

## 4. 文件结构

```
docs/
├─ index.html              # 页面骨架:<nav> / <section hero> / <div#timeline> / <footer>
├─ .nojekyll               # 禁用 Jekyll
├─ assets/
│  ├─ styles.css           # 深色蓝紫品牌样式(设计令牌见 §7)
│  └─ app.js               # 加载数据 → 排序 → 渲染时间线 + 折叠补丁;含容错
└─ data/
   ├─ site.json            # 站点级配置(品牌/标语/当前版本/各类链接)
   └─ versions.zh.json     # 唯一内容源:里程碑 + 补丁 + 规划项(中文)
```

> 文件组织遵循「小而专」:`index.html` 只放结构,样式与逻辑各自独立,数据单独成文件。

## 5. 数据模型

### 5.1 `site.json`(站点配置)

```json
{
  "brand": "LoongCode",
  "tagline": "把 Claude Code 装进桌面的 AI Agent IDE —— 后续规划与发布历程",
  "currentVersion": "0.6.0",
  "platforms": ["Windows", "macOS"],
  "techBadge": "Tauri 2 + React 19",
  "links": {
    "github": "https://github.com/LoongCode0/loongcode-release",
    "releases": "https://github.com/LoongCode0/loongcode-release/releases",
    "download": "https://github.com/LoongCode0/loongcode-release/releases/latest",
    "sourceRepo": ""
  },
  "releaseTagBase": "https://github.com/LoongCode0/loongcode-release/releases/tag/"
}
```

- `links.sourceRepo` 留空占位,由用户后续填入源码主仓库地址(为空时页脚该链接隐藏)。
- `releaseTagBase` 用于自动拼接每个版本的「完整发布说明」链接(GitHub Release 页;发布说明本就由源仓库 CI 组装进 Release 正文)。

### 5.2 `versions.zh.json`(内容源,数组)

每个条目字段:

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `version` | string \| null | 语义版本号(如 `"0.6.0"`)。规划项可为 `null`(无版本号) |
| `status` | `"released"` \| `"latest"` \| `"planned"` | 版本状态;`latest` 触发高亮 + 「最新」徽标 |
| `date` | string | 已发布为日期(`2026-06-09`);规划项为文本(`待排期` / `计划中`) |
| `title` | string | 一句话标题 |
| `summary` | string[] | 2–4 条功能摘要要点 |
| `tags` | string[] | 标签(如 `移动端`、`Git`) |
| `patches` | `{version, note}[]` | 该里程碑下折叠的补丁;无则空数组 |
| `fullNotesUrl` | string \| null | 完整说明链接。`null` = 不显示;省略/`"auto"` = 由 `releaseTagBase + "v" + version` 自动拼接(仅已发布) |

示例(节选):

```json
[
  { "version": null, "status": "planned", "date": "待排期",
    "title": "未排期构想（占位 · 待填充）",
    "summary": ["移动端富媒体 / 文件、复杂表单作答（当前纯文本）",
                "接入更多 CLI 工具（0.6 已预留每任务 CLI 结构）"],
    "tags": ["占位", "待填充"], "patches": [], "fullNotesUrl": null },

  { "version": "0.6.0", "status": "latest", "date": "2026-06-09",
    "title": "飞书机器人接入 · 分屏对话",
    "summary": ["飞书（Lark）机器人：扫码建应用、私聊转发 / 群 @ 触发，原生 Rust 长连接 + 健康灯",
                "分屏对话：主区二维平铺、跨工作区混排、布局持久化",
                "每任务独立 CLI 选择 · 机器人回复粒度按会话覆盖"],
    "tags": ["移动端", "多分栏", "Rust"], "patches": [] },

  { "version": "0.5.0", "status": "released", "date": "2026-06-07",
    "title": "移动端支持（微信 ClawBot）",
    "summary": ["绑定微信 ClawBot：手机远程新建 / 驱动任务、收 AI 回复、数字作答交互式提问",
                "worktree 任务跨重启恢复修复 · ✨ 一键生成提交消息",
                "pnpm 运行时版本管理调整 · 变更计数对齐"],
    "tags": ["移动端", "微信", "Git"],
    "patches": [ {"version":"0.5.1","note":"界面中英切换"},
                 {"version":"0.5.2","note":"子智能体管理 / 模型上下文窗口默认值"} ] }
]
```

### 5.3 排序规则(关键)

时间线按**版本号降序**(新 → 旧),自上而下:

1. 解析 `version` 为语义版本(`major.minor.patch`)。
2. **无版本号的 `planned`(`version: null`)视为最高 → 钉在最顶**;多个无版本号 `planned` 之间按数组原序。
3. 其余按语义版本**降序**排列。
   - 因此带版本号的规划项(如 `0.7.0`)版本号高于 `0.6.0`,自然排在已发布版本**之上**,落在时间树顶部。
4. 列表顶部因此呈现「规划区」→ 向下过渡到已发布版本 → `0.1.0` 在最底(标「起点」)。

### 5.4 国际化策略(i18n-ready,当前仅中文)

- 采用**按语言分文件**:当前只有 `versions.zh.json`。
- 日后加英文 = 新增 `versions.en.json` + 顶部语言开关 + 少量 UI 字符串的英文版;`app.js` 以 `lang` 参数化数据文件路径,**无需重构**。

## 6. 渲染逻辑(`app.js`,原生 JS)

1. `Promise.all` 加载 `data/site.json` 与 `data/versions.zh.json`。
2. 按 §5.3 排序。
3. 渲染:
   - `hero`:品牌、标语、`当前 vX` / 平台 / 技术栈 pill、下载 CTA、统计 meta(规划 N 项 · M 个里程碑 · K 个补丁)。
   - `#timeline`:遍历排序后数组,按**位置交替** `left / right`(偶 left、奇 right)生成节点。
     - `status==="latest"` → 卡片高亮 + 「最新」徽标 + 加大发光圆点。
     - `status==="planned"` → 琥珀色虚线卡片 + 空心琥珀圆点;主轴顶段用琥珀色渐变。
     - `patches.length` → 渲染折叠补丁小块。
     - 已发布且未显式给 `fullNotesUrl` → 自动拼接 GitHub Release 链接;规划项不显示链接。
   - `footer`:品牌 + 链接(`sourceRepo` 为空则隐藏该项)。
4. **响应式**:`<760px` 主轴移到左侧,节点全部塌为单列左对齐。

### 6.1 容错(显式处理,不静默吞错)

- 任一 `fetch` 失败 → 在 `#timeline` 内显示友好提示(「内容加载失败,请刷新重试」),并 `console.error` 详情;**不留白屏**。
- 单条数据缺失可选字段(`patches`/`tags`/`summary`)→ 安全降级跳过。
- `version` 非法/无法解析 → 当作 `null`(置顶),不中断整体渲染(遵循「生产代码无 console」规范,静默处理而非 `console.warn`)。
- JSON 解析失败 → 同 fetch 失败处理。

## 7. 视觉设计(设计令牌)

深色 + 蓝紫渐变 + 鎏金字标,呼应 LoongCode 品牌(已通过浏览器对比稿确认,采用「居中交错 zigzag」布局)。

```
背景      #08080d + 蓝紫径向辉光(右上紫 / 左中蓝)
主文/次/弱 #ececf2 / #9a9ab0 / #6b6b82
品牌渐变   linear-gradient(135deg,#6d5efc,#2f6df6)   // 圆点/版本 pill/CTA
鎏金字标   linear-gradient(135deg,#f4d98b,#caa45a)   // wordmark
规划琥珀   #d8b370                                    // planned 节点 + 主轴顶段
卡片      rgba(255,255,255,.045) + 1px 边 + 18px 圆角 + backdrop-blur
```

- 主轴:顶段琥珀(未来/未建)→ 向下蓝紫渐变(已发布),一眼区分规划与已发布。
- 卡片 hover 轻微上浮;`latest` 卡片紫色描边光晕。
- 布局:`<nav>`(粘顶,字标 + GitHub + 下载)/ `hero` / 居中交错时间线 / `footer`。

> 已确认的视觉稿(实现期可参照):头脑风暴产出的 `full-page-v2.html` 对比稿。

## 8. 内容计划

- 从 `../longlong-ade/docs/RELEASE_NOTES_0.1.0 … 0.6.0` 提炼 **6 个里程碑**的中文摘要(每版 2–4 条要点)。各里程碑要点已在头脑风暴期核对。
- 补丁(`0.2.1–0.2.6` / `0.3.1–0.3.2` / `0.4.1–0.4.3` / `0.5.1–0.5.2`)折叠进所属里程碑,一句话带过。
- 规划项:初始为**占位骨架**——含一个无版本号「未排期」节点 + 一个带版本号示例节点(`v0.7.0`);占位要点取自各版「已知限制 / 为日后预留」(macOS/Linux 自动更新、增量更新、更多 CLI 工具、移动端富媒体等),内容后续由用户填充。
- 每个已发布里程碑「完整发布说明 →」链接到本仓库 GitHub Release 页。

## 9. 部署

1. 站点文件提交到 `main` 分支 `docs/`。
2. GitHub 仓库 Settings → Pages → Source 选「Deploy from a branch」,分支 `main`、目录 `/docs`。
3. `docs/.nojekyll` 保证纯静态服务。
4. 访问 `https://release.loongcode.cc` 验证。

## 10. 日常维护

- **发新版本**:`versions.zh.json` 加一条 `released`(或 `latest`),并把上一个 `latest` 改为 `released`;补丁追加进对应里程碑的 `patches`。
- **填规划**:编辑 / 增删 `planned` 条目;排期后给它补上版本号即自动归位到时间树。
- 全程不动 `index.html` / `app.js` / `styles.css`。

## 11. 不做(YAGNI)

- 不引入框架 / 打包器 / SSG / CI 构建。
- 不在线解析源仓库发布说明(改为一次性提炼进数据文件)。
- 暂不做英文内容(仅预留 i18n 文件结构)。
- 不做搜索 / 过滤 / 分页 / 评论 / 统计埋点。

## 12. 验证计划

- 本地以 `file://` 及静态服务器各开一次,核对:6 里程碑 + 2 规划项全部渲染、排序为版本号降序、规划项在顶、`latest` 高亮。
- 窄屏(375px)塌为单列且不错位。
- `site.json` / `versions.zh.json` 通过 JSON 合法性校验。
- 「完整发布说明 →」「下载」「GitHub」链接指向正确。
- 模拟数据文件加载失败,确认显示友好提示而非白屏。
