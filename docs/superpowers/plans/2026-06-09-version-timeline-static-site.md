# LoongCode 版本时间线静态站 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在发布仓库 `loongcode-release` 的 `docs/` 下搭建一个零构建、数据驱动的版本时间线静态站,经 GitHub Pages 发布。

**Architecture:** 纯 HTML/CSS/原生 ES Module + 两个 JSON 数据文件。`timeline.js` 放纯逻辑(版本解析 / 排序 / URL / 统计,可单测),`app.js` 负责 `fetch` 数据并渲染 DOM。内容一次性从只读源仓库 `../longlong-ade/docs/RELEASE_NOTES_*.md` 提炼进 `docs/data/versions.zh.json`。

**Tech Stack:** HTML5 + CSS3(深色蓝紫品牌)+ 原生 JS(ES Module)+ JSON;Node 内置测试器 `node --test`(零外部依赖)做纯逻辑单测;一个零依赖 Node 静态服务器用于本地验证;GitHub Pages 从 `main` 分支 `/docs` 部署。

> **关于「零依赖」**:根 `package.json` **不含任何依赖**、无需 `install`、无打包步骤;它只用于开启 ESM 与 Node 自带测试器。部署目录 `docs/` 始终是纯静态文件。
>
> **关于本地验证为何要起服务器**:站点用到 `fetch()` 与 `<script type="module">`,二者在 `file://` 协议下会被浏览器 CORS 拦截(`origin 'null'`)。因此本地验证必须经 HTTP(`node bin/serve.mjs`);GitHub Pages 是 HTTPS,线上无此问题。

---

## 文件结构

| 文件 | 职责 | 是否部署 |
| --- | --- | --- |
| `package.json` | 根配置:`type:module` + `test` 脚本(无依赖) | 否 |
| `bin/serve.mjs` | 零依赖本地静态服务器(仅本地验证用) | 否 |
| `tests/timeline.test.js` | `timeline.js` 纯逻辑 + 数据完整性单测 | 否 |
| `docs/.nojekyll` | 关闭 GitHub Pages 的 Jekyll | 是 |
| `docs/index.html` | 页面骨架 + 挂载点(`#hero` / `#tl` / `#footer`) | 是 |
| `docs/assets/styles.css` | 深色蓝紫品牌样式 + 居中交错时间线 + 响应式 | 是 |
| `docs/assets/timeline.js` | 纯逻辑 ESM:`parseVersion` / `sortEntries` / `buildFullNotesUrl` / `normalizeEntry` / `computeStats` | 是 |
| `docs/assets/app.js` | `fetch` 数据 → 渲染 hero / 时间线 / 页脚 / nav,含容错 | 是 |
| `docs/data/site.json` | 站点级配置(品牌 / 链接 / 当前版本) | 是 |
| `docs/data/versions.zh.json` | 唯一内容源:里程碑 + 补丁 + 规划项 | 是 |

**函数签名(贯穿全计划,务必一致):**

```
parseVersion(v: string|null) -> [number,number,number] | null
compareEntriesDesc(a, b) -> number          // 无版本号在最前;其余语义版本降序
sortEntries(entries: Entry[]) -> Entry[]      // 返回新数组(不可变)
buildFullNotesUrl(entry, site) -> string | null
normalizeEntry(entry) -> Entry               // 返回带默认值的新对象
computeStats(entries) -> { plannedCount, milestoneCount, patchCount }
```

---

## Task 1: 项目脚手架与本地验证工具

**Files:**
- Create: `package.json`
- Create: `bin/serve.mjs`
- Create: `docs/.nojekyll`

- [ ] **Step 1: 创建根 `package.json`(无依赖)**

```json
{
  "name": "loongcode-release-site",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "LoongCode 版本时间线静态站(GitHub Pages, docs/)",
  "scripts": {
    "test": "node --test tests/*.test.js",
    "serve": "node bin/serve.mjs"
  }
}
```

- [ ] **Step 2: 创建零依赖本地静态服务器 `bin/serve.mjs`**

```js
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../docs/', import.meta.url));
const PORT = process.env.PORT || 8080;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
};

createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const file = normalize(join(ROOT, p));
    if (file !== ROOT.slice(0, -1) && !file.startsWith(ROOT.endsWith(sep) ? ROOT : ROOT + sep)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not Found');
  }
}).listen(PORT, () => console.log(`Serving docs/ at http://localhost:${PORT}/`));
```

- [ ] **Step 3: 创建 `docs/.nojekyll`(空文件)**

内容为空(0 字节)。它让 GitHub Pages 跳过 Jekyll、按原样服务静态资源。

- [ ] **Step 4: 验证 Node 版本与服务器可用**

Run: `node --version`
Expected: `v20.x` 或更高(可靠支持 `node --test <目录>` 的测试发现与 `node:fs/promises`;v18 亦可但建议 v20+)。

Run: `node bin/serve.mjs`(随后 `Ctrl+C` 结束)
Expected: 打印 `Serving docs/ at http://localhost:8080/`,无报错。

- [ ] **Step 5: Commit**

```bash
git add package.json bin/serve.mjs docs/.nojekyll
git commit -m "chore: 时间线站脚手架(package.json/本地静态服务器/.nojekyll)"
```

---

## Task 2: `timeline.js` — 版本解析与排序

**Files:**
- Create: `docs/assets/timeline.js`
- Test: `tests/timeline.test.js`

- [ ] **Step 1: 写失败测试(版本解析与排序)**

创建 `tests/timeline.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseVersion, sortEntries } from '../docs/assets/timeline.js';

test('parseVersion 解析语义版本', () => {
  assert.deepEqual(parseVersion('0.6.0'), [0, 6, 0]);
  assert.deepEqual(parseVersion('v0.6.0'), [0, 6, 0]); // 容忍 v 前缀
  assert.deepEqual(parseVersion('1.2'), [1, 2, 0]);    // 补 0
  assert.equal(parseVersion(null), null);
  assert.equal(parseVersion('规划中'), null);
  assert.equal(parseVersion(undefined), null);
});

test('sortEntries: 无版本号置顶,其余版本号降序', () => {
  const input = [
    { version: '0.1.0', status: 'released' },
    { version: null, status: 'planned' },
    { version: '0.6.0', status: 'latest' },
    { version: '0.7.0', status: 'planned' },
  ];
  const out = sortEntries(input);
  assert.deepEqual(out.map((e) => e.version), [null, '0.7.0', '0.6.0', '0.1.0']);
});

test('sortEntries 不修改原数组(不可变)', () => {
  const input = [{ version: '0.1.0' }, { version: '0.6.0' }];
  const snapshot = input.map((e) => e.version);
  sortEntries(input);
  assert.deepEqual(input.map((e) => e.version), snapshot);
});

test('sortEntries: 多个无版本号项按原序', () => {
  const input = [
    { version: null, status: 'planned', title: 'A' },
    { version: '0.6.0', status: 'latest' },
    { version: null, status: 'planned', title: 'B' },
  ];
  const out = sortEntries(input);
  assert.deepEqual(out.map((e) => e.title || e.version), ['A', 'B', '0.6.0']);
});
```

- [ ] **Step 2: 运行测试,确认失败**

Run: `node --test tests/*.test.js`
Expected: FAIL — `Cannot find module '../docs/assets/timeline.js'` 或导出不存在。

- [ ] **Step 3: 实现 `parseVersion` / `compareEntriesDesc` / `sortEntries`**

创建 `docs/assets/timeline.js`:

```js
// 纯逻辑模块:浏览器与 Node 共用(ES Module)。

/** 解析语义版本为 [major,minor,patch];无法解析返回 null。容忍 'v' 前缀与缺省的 patch。 */
export function parseVersion(v) {
  if (typeof v !== 'string') return null;
  const m = v.trim().replace(/^v/i, '').match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?$/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2] || 0), Number(m[3] || 0)];
}

/** 排序比较器:无版本号(null)置顶;其余按语义版本降序。 */
export function compareEntriesDesc(a, b) {
  const av = parseVersion(a && a.version);
  const bv = parseVersion(b && b.version);
  if (av === null && bv === null) return 0;   // 都无版本号 → 保持原序(稳定排序)
  if (av === null) return -1;                 // a 无版本号 → 置顶
  if (bv === null) return 1;
  for (let i = 0; i < 3; i++) {
    if (bv[i] !== av[i]) return bv[i] - av[i]; // 降序
  }
  return 0;
}

/** 返回排序后的新数组(不修改入参)。 */
export function sortEntries(entries) {
  return [...entries].sort(compareEntriesDesc);
}
```

- [ ] **Step 4: 运行测试,确认通过**

Run: `node --test tests/*.test.js`
Expected: PASS — 4 个测试全过(`# pass 4`)。

- [ ] **Step 5: Commit**

```bash
git add docs/assets/timeline.js tests/timeline.test.js
git commit -m "feat(timeline): 版本解析与降序排序(无版本号置顶)+ 单测"
```

---

## Task 3: `timeline.js` — 链接 / 归一化 / 统计

**Files:**
- Modify: `docs/assets/timeline.js`
- Test: `tests/timeline.test.js`

- [ ] **Step 1: 追加失败测试**

在 `tests/timeline.test.js` 顶部 import 改为:

```js
import {
  parseVersion, sortEntries, buildFullNotesUrl, normalizeEntry, computeStats,
} from '../docs/assets/timeline.js';
```

在文件末尾追加:

```js
const SITE = { releaseTagBase: 'https://example.com/releases/tag/' };

test('buildFullNotesUrl: 已发布自动拼接 Release 链接', () => {
  const e = { version: '0.5.0', status: 'released' };
  assert.equal(buildFullNotesUrl(e, SITE), 'https://example.com/releases/tag/v0.5.0');
});

test('buildFullNotesUrl: 显式链接优先', () => {
  const e = { version: '0.5.0', status: 'released', fullNotesUrl: 'https://x.test/n' };
  assert.equal(buildFullNotesUrl(e, SITE), 'https://x.test/n');
});

test('buildFullNotesUrl: 显式 null 表示不显示', () => {
  const e = { version: '0.5.0', status: 'released', fullNotesUrl: null };
  assert.equal(buildFullNotesUrl(e, SITE), null);
});

test('buildFullNotesUrl: 规划项无链接', () => {
  assert.equal(buildFullNotesUrl({ version: '0.7.0', status: 'planned' }, SITE), null);
  assert.equal(buildFullNotesUrl({ version: null, status: 'planned' }, SITE), null);
});

test('normalizeEntry 补全数组默认值且不可变', () => {
  const e = { version: '0.6.0', status: 'latest', title: 'X' };
  const n = normalizeEntry(e);
  assert.deepEqual(n.summary, []);
  assert.deepEqual(n.tags, []);
  assert.deepEqual(n.patches, []);
  assert.equal(n.title, 'X');
  assert.equal('summary' in e, false); // 原对象未被改动
});

test('computeStats 统计规划/里程碑/补丁数', () => {
  const entries = [
    { version: null, status: 'planned' },
    { version: '0.7.0', status: 'planned' },
    { version: '0.6.0', status: 'latest', patches: [] },
    { version: '0.5.0', status: 'released', patches: [{ version: '0.5.1' }, { version: '0.5.2' }] },
  ];
  assert.deepEqual(computeStats(entries), { plannedCount: 2, milestoneCount: 2, patchCount: 2 });
});
```

- [ ] **Step 2: 运行测试,确认失败**

Run: `node --test tests/*.test.js`
Expected: FAIL — `buildFullNotesUrl is not a function` 等。

- [ ] **Step 3: 在 `docs/assets/timeline.js` 末尾追加实现**

```js
/** 完整发布说明链接:显式 string 优先;显式 null 隐藏;否则已发布按 releaseTagBase 自动拼接,规划项无链接。 */
export function buildFullNotesUrl(entry, site) {
  const u = entry.fullNotesUrl;
  if (u === null) return null;
  if (typeof u === 'string' && u !== '' && u !== 'auto') return u;
  if (entry.status === 'planned') return null;
  const base = (site && site.releaseTagBase) || '';
  if (!base || !parseVersion(entry.version)) return null;
  return `${base}v${entry.version}`;
}

/** 返回带数组默认值的新条目,不修改入参。 */
export function normalizeEntry(entry) {
  return {
    ...entry,
    summary: Array.isArray(entry.summary) ? entry.summary : [],
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    patches: Array.isArray(entry.patches) ? entry.patches : [],
  };
}

/** 统计:规划项数 / 已发布里程碑数(有版本号)/ 补丁总数。 */
export function computeStats(entries) {
  let plannedCount = 0, milestoneCount = 0, patchCount = 0;
  for (const e of entries) {
    if (e.status === 'planned') plannedCount++;
    else if ((e.status === 'released' || e.status === 'latest') && parseVersion(e.version)) milestoneCount++;
    patchCount += Array.isArray(e.patches) ? e.patches.length : 0;
  }
  return { plannedCount, milestoneCount, patchCount };
}
```

- [ ] **Step 4: 运行测试,确认通过**

Run: `node --test tests/*.test.js`
Expected: PASS — 共 10 个测试通过。

- [ ] **Step 5: Commit**

```bash
git add docs/assets/timeline.js tests/timeline.test.js
git commit -m "feat(timeline): Release 链接拼接/条目归一化/统计 + 单测"
```

---

## Task 4: 数据文件 + 数据完整性测试

**Files:**
- Create: `docs/data/site.json`
- Create: `docs/data/versions.zh.json`
- Test: `tests/timeline.test.js`

- [ ] **Step 1: 写数据完整性失败测试**

在 `tests/timeline.test.js` 顶部追加 import:

```js
import { readFileSync } from 'node:fs';
```

在文件末尾追加:

```js
const versionsZh = JSON.parse(
  readFileSync(new URL('../docs/data/versions.zh.json', import.meta.url)),
);
const siteJson = JSON.parse(
  readFileSync(new URL('../docs/data/site.json', import.meta.url)),
);

test('versions.zh.json 计数正确:6 里程碑 / 13 补丁 / 2 规划', () => {
  const stats = computeStats(versionsZh);
  assert.equal(stats.milestoneCount, 6);
  assert.equal(stats.patchCount, 13);
  assert.equal(stats.plannedCount, 2);
});

test('versions.zh.json 排序后:首项为无版本号规划,末项为 0.1.0,latest 为 0.6.0', () => {
  const sorted = sortEntries(versionsZh);
  assert.equal(sorted[0].version, null);
  assert.equal(sorted[sorted.length - 1].version, '0.1.0');
  const latest = versionsZh.filter((e) => e.status === 'latest');
  assert.equal(latest.length, 1);
  assert.equal(latest[0].version, '0.6.0');
});

test('site.json 含必要字段', () => {
  assert.ok(siteJson.brand && siteJson.releaseTagBase && siteJson.links);
  assert.ok(siteJson.links.download && siteJson.links.github);
});
```

- [ ] **Step 2: 运行测试,确认失败**

Run: `node --test tests/*.test.js`
Expected: FAIL — `ENOENT ... versions.zh.json`(文件尚未创建)。

- [ ] **Step 3: 创建 `docs/data/site.json`**

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

- [ ] **Step 4: 创建 `docs/data/versions.zh.json`**

```json
[
  {
    "version": null,
    "status": "planned",
    "date": "待排期",
    "title": "未排期构想（占位 · 待填充）",
    "summary": [
      "移动端富媒体 / 文件、复杂表单作答（当前为纯文本交互）",
      "接入更多 CLI 工具（0.6 已预留每任务 CLI 结构）"
    ],
    "tags": ["占位", "待填充"],
    "patches": [],
    "fullNotesUrl": null
  },
  {
    "version": "0.7.0",
    "status": "planned",
    "date": "计划中",
    "title": "下一里程碑（占位示例 · 待填充）",
    "summary": [
      "macOS / Linux 自动更新 · 增量（diff）更新（当前仅 Windows / 完整安装包）",
      "（规划要点之后填充）"
    ],
    "tags": ["占位"],
    "patches": [],
    "fullNotesUrl": null
  },
  {
    "version": "0.6.0",
    "status": "latest",
    "date": "2026-06-09",
    "title": "飞书机器人接入 · 分屏对话",
    "summary": [
      "飞书（Lark）机器人：扫码建应用、私聊转发 / 群 @ 触发，原生 Rust 长连接 + 连接健康灯",
      "分屏对话：主区二维平铺、跨工作区混排、布局持久化、Ctrl+Shift+T 撤销关闭",
      "每任务独立 CLI 选择 · 机器人回复粒度按会话覆盖"
    ],
    "tags": ["移动端", "多分栏", "Rust"],
    "patches": []
  },
  {
    "version": "0.5.0",
    "status": "released",
    "date": "2026-06-07",
    "title": "移动端支持（微信 ClawBot）",
    "summary": [
      "绑定微信 ClawBot：手机远程新建 / 驱动任务、收发 AI 回复、对交互式提问回数字作答",
      "worktree 任务跨重启恢复修复 · 提交对话框 ✨ 一键生成提交消息",
      "pnpm 运行时版本管理调整 · 变更计数与审查面板对齐"
    ],
    "tags": ["移动端", "微信", "Git"],
    "patches": [
      { "version": "0.5.1", "note": "界面中英切换" },
      { "version": "0.5.2", "note": "子智能体管理" }
    ]
  },
  {
    "version": "0.4.0",
    "status": "released",
    "date": "2026-06-04",
    "title": "全应用右键菜单 · 依赖运行时管理",
    "summary": [
      "对话区 / 文件树 / 任务行全场景自定义右键;文件树多选 + 系统剪贴板复制剪切粘贴",
      "依赖管理升级:uv / pnpm / bun 多版本列出 / 安装 / 切换,依赖按必须·可选分层",
      "后台任务栏闪烁提醒 · 新建任务记住上次配置"
    ],
    "tags": ["右键菜单", "依赖管理"],
    "patches": [
      { "version": "0.4.1", "note": "优雅中断 · 环境变量" },
      { "version": "0.4.2", "note": "新建任务草稿态" },
      { "version": "0.4.3", "note": "任务归档" }
    ]
  },
  {
    "version": "0.3.0",
    "status": "released",
    "date": "2026-06-02",
    "title": "内嵌浏览器 · 选元素喂给 AI",
    "summary": [
      "右侧面板内嵌浏览器(地址栏 + 原生前进 / 后退 / 刷新)",
      "页面选元素 → 生成 chip 插入对话;AI 回复链接就地打开",
      "内置命令与技能识别 · 侧栏版本号 + 应用内 changelog"
    ],
    "tags": ["内嵌浏览器", "命令"],
    "patches": [
      { "version": "0.3.1", "note": "扩展思考 · 上下文自动恢复" },
      { "version": "0.3.2", "note": "用量指示器 · 依赖管理" }
    ]
  },
  {
    "version": "0.2.0",
    "status": "released",
    "date": "2026-05-31",
    "title": "Git Worktree 侦测与跟随",
    "summary": [
      "Agent 执行 git worktree add 后,文件树 / Git / 终端 / 面板整体自动跟随(可撤销)",
      "统一分支 / worktree 切换器、应用内新建 / 移除、worktree 移除后自动反向脱离",
      "进程与会话零风险:跟随仅在 UI 层,Claude 进程 cwd 恒为主仓库"
    ],
    "tags": ["worktree", "Git"],
    "patches": [
      { "version": "0.2.1", "note": "worktree 跟随打磨" },
      { "version": "0.2.2", "note": "更新检查提速" },
      { "version": "0.2.3", "note": "代理设置 · 回合工具栏" },
      { "version": "0.2.4", "note": "更名 LoongCode" },
      { "version": "0.2.5", "note": "多平台 CI 构建" },
      { "version": "0.2.6", "note": "多主题 · 代码回滚" }
    ]
  },
  {
    "version": "0.1.0",
    "status": "released",
    "date": "2026-05-30",
    "title": "首个公开版本 · Claude Code 桌面外壳",
    "summary": [
      "图形化 Claude Code 会话:多任务 / 多工作区、Token 级流式、工具调用折叠卡片",
      "集成终端 · 文件树 · Git 审查 · 斜杠命令 / @文件面板 · Todo 聚合 · 用量统计",
      "模型供应商(内置 8 家)· 技能 / MCP / 插件 · 自动更新 · 新手引导"
    ],
    "tags": ["基石", "IDE"],
    "patches": []
  }
]
```

- [ ] **Step 5: 运行测试,确认通过**

Run: `node --test tests/*.test.js`
Expected: PASS — 共 13 个测试通过;计数 6/13/2、排序与 latest 断言全过。

- [ ] **Step 6: Commit**

```bash
git add docs/data/site.json docs/data/versions.zh.json tests/timeline.test.js
git commit -m "feat(data): 站点配置与 6 里程碑/13 补丁/2 规划内容 + 完整性单测"
```

---

## Task 5: 页面骨架 `index.html` + 样式 `styles.css`

**Files:**
- Create: `docs/index.html`
- Create: `docs/assets/styles.css`

- [ ] **Step 1: 创建 `docs/index.html`**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LoongCode · 版本时间线</title>
  <link rel="stylesheet" href="./assets/styles.css">
</head>
<body>
  <nav><div class="inner">
    <a href="#hero" class="wordmark">LoongCode</a>
    <span class="pill navtag">版本时间线</span>
    <span class="spacer"></span>
    <a class="btn ghost" id="nav-github" href="#">GitHub</a>
    <a class="btn" id="nav-download" href="#">下载最新版</a>
  </div></nav>

  <section class="hero" id="hero"></section>
  <main class="tl" id="tl"></main>
  <footer id="footer"></footer>

  <script type="module" src="./assets/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: 创建 `docs/assets/styles.css`**

```css
:root{
  --bg:#08080d; --txt:#ececf2; --txt2:#9a9ab0; --txt3:#6b6b82;
  --card:rgba(255,255,255,.045); --card-border:rgba(255,255,255,.09);
  --grad:linear-gradient(135deg,#6d5efc,#2f6df6);
  --gold1:#f4d98b; --gold2:#caa45a; --plan:#d8b370;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{
  font-family:-apple-system,"Segoe UI",system-ui,"Microsoft YaHei",sans-serif;
  background:var(--bg);color:var(--txt);line-height:1.6;
  background-image:
    radial-gradient(1000px 600px at 78% -8%, rgba(109,94,252,.20), transparent 60%),
    radial-gradient(800px 600px at 5% 16%, rgba(47,109,246,.13), transparent 55%);
  background-attachment:fixed;
}
a{color:inherit;text-decoration:none}

nav{position:sticky;top:0;z-index:30;backdrop-filter:blur(14px);
  background:rgba(8,8,13,.7);border-bottom:1px solid var(--card-border)}
nav .inner{max-width:1080px;margin:0 auto;padding:13px 28px;display:flex;align-items:center;gap:14px}
.wordmark{font-size:20px;font-weight:800;letter-spacing:.5px;
  background:linear-gradient(135deg,var(--gold1),var(--gold2));-webkit-background-clip:text;background-clip:text;color:transparent}
nav .spacer{flex:1}
.navtag{padding:4px 11px}
.btn{font-size:13px;font-weight:600;padding:8px 16px;border-radius:10px;background:var(--grad);color:#fff;
  box-shadow:0 6px 18px rgba(109,94,252,.35);transition:transform .15s,box-shadow .15s}
.btn:hover{transform:translateY(-1px);box-shadow:0 10px 26px rgba(109,94,252,.5)}
.btn.ghost{background:transparent;border:1px solid var(--card-border);box-shadow:none;color:var(--txt2)}

.hero{max-width:1080px;margin:0 auto;padding:74px 28px 30px;text-align:center}
.hero .big{font-size:54px;font-weight:850;letter-spacing:1px;line-height:1.1;
  background:linear-gradient(135deg,var(--gold1),var(--gold2) 70%);-webkit-background-clip:text;background-clip:text;color:transparent}
.hero .tag{margin-top:16px;font-size:17px;color:var(--txt2);max-width:600px;margin-left:auto;margin-right:auto}
.pills{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:24px}
.pill{font-size:12.5px;padding:6px 13px;border-radius:999px;border:1px solid var(--card-border);color:var(--txt2);background:rgba(255,255,255,.03)}
.pill.cur{color:#fff;background:var(--grad);border:none;box-shadow:0 4px 14px rgba(109,94,252,.4)}
.hero .cta{margin-top:28px;display:flex;gap:12px;justify-content:center}
.hero .meta{margin-top:26px;font-size:13px;color:var(--txt3)}

.tl{position:relative;max-width:1080px;margin:18px auto 0;padding:20px 28px 10px}
.tl::before{content:"";position:absolute;left:50%;top:0;bottom:40px;width:2px;transform:translateX(-50%);
  background:linear-gradient(180deg,
    rgba(216,179,112,.5) 0,rgba(216,179,112,.5) 130px,
    #6d5efc 230px,#2f6df6 92%,rgba(47,109,246,.15));}
.topcap{position:relative;text-align:center;margin-bottom:8px;color:var(--plan);font-size:11.5px;letter-spacing:3px}
.row{position:relative;display:flex;margin-bottom:32px;min-height:66px}
.row .dot{position:absolute;left:50%;top:18px;width:16px;height:16px;border-radius:50%;transform:translateX(-50%);
  background:var(--grad);box-shadow:0 0 0 5px rgba(109,94,252,.16),0 0 18px rgba(109,94,252,.55);z-index:2}
.row.cur .dot{width:20px;height:20px;top:16px;box-shadow:0 0 0 6px rgba(109,94,252,.22),0 0 26px rgba(109,94,252,.85)}
.row.plan .dot{background:transparent;border:2px solid var(--plan);box-shadow:0 0 0 5px rgba(216,179,112,.1),0 0 14px rgba(216,179,112,.4)}
.cardwrap{width:50%}
.row.left .cardwrap{padding-right:46px}
.row.right{justify-content:flex-end}
.row.right .cardwrap{padding-left:46px}

.card{background:var(--card);border:1px solid var(--card-border);border-radius:18px;padding:20px 22px;
  backdrop-filter:blur(8px);box-shadow:0 14px 36px rgba(0,0,0,.3);transition:transform .18s,border-color .18s}
.card:hover{transform:translateY(-3px);border-color:rgba(109,94,252,.4)}
.card.curcard{border-color:rgba(109,94,252,.5);box-shadow:0 14px 40px rgba(109,94,252,.18)}
.vrow{display:flex;align-items:center;gap:11px;margin-bottom:9px;flex-wrap:wrap}
.vpill{font-weight:800;font-size:14px;padding:4px 13px;border-radius:999px;color:#fff;background:var(--grad);box-shadow:0 4px 14px rgba(109,94,252,.35)}
.latest{font-size:10.5px;letter-spacing:1px;color:#b9aef9;border:1px solid rgba(109,94,252,.45);padding:2px 8px;border-radius:999px}
.date{color:var(--txt3);font-size:12.5px;font-variant-numeric:tabular-nums;margin-left:auto}
.card h3{font-size:18px;font-weight:750;margin-bottom:11px}
.card ul{list-style:none;display:flex;flex-direction:column;gap:7px;margin:2px 0 13px}
.card li{font-size:13.6px;color:var(--txt2);padding-left:18px;position:relative}
.card li::before{content:"";position:absolute;left:2px;top:9px;width:6px;height:6px;border-radius:50%;background:var(--grad)}
.tags{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:4px}
.tag{font-size:11px;padding:3px 10px;border-radius:7px;background:rgba(109,94,252,.12);border:1px solid rgba(109,94,252,.25);color:#b9aef9}
.patch{margin-top:12px;font-size:12px;color:var(--txt2);background:rgba(255,255,255,.035);border:1px dashed var(--card-border);
  padding:7px 12px;border-radius:9px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.patch b{color:var(--txt);font-weight:600}
.patch .pp{font-size:11px;padding:1px 7px;border-radius:6px;background:rgba(255,255,255,.05);color:var(--txt2);font-variant-numeric:tabular-nums}
.full{display:inline-block;margin-top:13px;font-size:12.5px;color:#8f9bff}
.full:hover{text-decoration:underline}

.card.plan{background:rgba(216,179,112,.05);border:1.5px dashed rgba(216,179,112,.42)}
.card.plan .vpill{background:transparent;color:var(--plan);border:1px solid rgba(216,179,112,.55);box-shadow:none}
.card.plan li::before{background:var(--plan)}
.card.plan .tag{background:rgba(216,179,112,.1);border-color:rgba(216,179,112,.3);color:var(--plan)}
.plabel{font-size:10.5px;letter-spacing:1px;color:var(--plan);border:1px solid rgba(216,179,112,.45);padding:2px 8px;border-radius:999px}
.plabel.start{color:var(--gold2);border-color:rgba(202,164,90,.45)}

.loaderr{max-width:560px;margin:60px auto;text-align:center;color:var(--txt2);
  background:var(--card);border:1px solid var(--card-border);border-radius:16px;padding:28px}
.loaderr small{color:var(--txt3)}

footer{max-width:1080px;margin:50px auto 0;padding:30px 28px 60px;border-top:1px solid var(--card-border);
  display:flex;gap:18px;align-items:center;flex-wrap:wrap;color:var(--txt3);font-size:13px}
footer a{color:var(--txt2)} footer a:hover{color:#8f9bff}
footer .spacer{flex:1}

@media(max-width:760px){
  .hero .big{font-size:38px}
  .tl::before{left:9px}
  .row{display:block}
  .cardwrap{width:100%}
  .row.left .cardwrap,.row.right .cardwrap{padding:0 0 0 34px}
  .row .dot{left:9px}
  .date{margin-left:0}
  .topcap{text-align:left;padding-left:2px}
}
```

- [ ] **Step 3: 起服务器并在浏览器核对骨架**

Run: `node bin/serve.mjs`(后台保持运行)
打开 `http://localhost:8080/`。
Expected:此时 `#hero` / `#tl` / `#footer` 为空(app.js 尚未实现),但 **nav 可见、背景辉光与字体生效、无控制台报错**(404 仅 app.js 可接受,下个 Task 补)。

- [ ] **Step 4: Commit**

```bash
git add docs/index.html docs/assets/styles.css
git commit -m "feat(ui): 页面骨架 index.html + 深色蓝紫品牌样式 styles.css"
```

---

## Task 6: 渲染逻辑 `app.js`

**Files:**
- Create: `docs/assets/app.js`

- [ ] **Step 1: 创建 `docs/assets/app.js`**

```js
import { sortEntries, normalizeEntry, computeStats, buildFullNotesUrl } from './timeline.js';

const SOURCES = { site: './data/site.json', versions: './data/versions.zh.json' };

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

async function loadJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} → HTTP ${r.status}`);
  return r.json();
}

function renderHero(site, stats) {
  const platforms = (site.platforms || []).map((p) => `<span class="pill">${escapeHtml(p)}</span>`).join('');
  const tech = site.techBadge ? `<span class="pill">${escapeHtml(site.techBadge)}</span>` : '';
  return `
    <div class="big">${escapeHtml(site.brand)}</div>
    <div class="tag">${escapeHtml(site.tagline)}</div>
    <div class="pills">
      <span class="pill cur">当前 v${escapeHtml(site.currentVersion)}</span>
      ${platforms}${tech}
    </div>
    <div class="cta">
      <a class="btn" href="${escapeHtml(site.links.download)}">↓ 下载安装包</a>
      <a class="btn ghost" href="#tl">查看时间线</a>
    </div>
    <div class="meta">规划中 ${stats.plannedCount} 项 · ${stats.milestoneCount} 个已发布里程碑 · ${stats.patchCount} 个补丁</div>`;
}

function renderPatches(patches) {
  if (!patches.length) return '';
  const chips = patches.map((p) => {
    const note = p.note ? ` ${escapeHtml(p.note)}` : '';
    return `<span class="pp">${escapeHtml(p.version)}${note}</span>`;
  }).join('');
  return `<div class="patch"><b>＋ ${patches.length} 个补丁</b>${chips}</div>`;
}

function renderCard(entry, site, isOldest) {
  const planned = entry.status === 'planned';
  const latest = entry.status === 'latest';
  const url = buildFullNotesUrl(entry, site);
  const vlabel = entry.version ? `v${escapeHtml(entry.version)}` : '规划中';

  const badges = [];
  if (latest) badges.push('<span class="latest">最新</span>');
  if (planned) badges.push(`<span class="plabel">${entry.version ? '规划中' : '未排期'}</span>`);
  if (isOldest) badges.push('<span class="plabel start">起点</span>');

  const summary = entry.summary.map((s) => `<li>${escapeHtml(s)}</li>`).join('');
  const tags = entry.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('');
  const full = url ? `<a class="full" href="${escapeHtml(url)}">完整发布说明 →</a>` : '';

  return `
    <div class="card${planned ? ' plan' : ''}${latest ? ' curcard' : ''}">
      <div class="vrow"><span class="vpill">${vlabel}</span>${badges.join('')}<span class="date">${escapeHtml(entry.date)}</span></div>
      <h3>${escapeHtml(entry.title)}</h3>
      <ul>${summary}</ul>
      <div class="tags">${tags}</div>
      ${renderPatches(entry.patches)}
      ${full}
    </div>`;
}

function renderTimeline(entries, site) {
  // 排序后最末一个已发布条目即版本号最小者 → 标「起点」。
  let oldestIdx = -1;
  entries.forEach((e, i) => { if (e.status === 'released' || e.status === 'latest') oldestIdx = i; });

  const rows = entries.map((e, i) => {
    const side = i % 2 === 0 ? 'left' : 'right';
    const cls = ['row', side, e.status === 'latest' ? 'cur' : '', e.status === 'planned' ? 'plan' : '']
      .filter(Boolean).join(' ');
    return `<div class="${cls}"><span class="dot"></span><div class="cardwrap">${renderCard(e, site, i === oldestIdx)}</div></div>`;
  }).join('');

  return `<div class="topcap">▲ 规划 · FUTURE</div>${rows}`;
}

function renderFooter(site) {
  const L = site.links || {};
  const items = [
    L.github ? `<a href="${escapeHtml(L.github)}">发布仓库</a>` : '',
    L.releases ? `<a href="${escapeHtml(L.releases)}">Releases 下载</a>` : '',
    L.sourceRepo ? `<a href="${escapeHtml(L.sourceRepo)}">源码主仓库</a>` : '',
  ].filter(Boolean).join('');
  return `<span class="wordmark" style="font-size:16px">${escapeHtml(site.brand)}</span><span>· 版本时间线</span><span class="spacer"></span>${items}`;
}

function setNavLinks(site) {
  const g = document.getElementById('nav-github');
  const d = document.getElementById('nav-download');
  if (g && site.links && site.links.github) g.href = site.links.github;
  if (d && site.links && site.links.download) d.href = site.links.download;
}

async function main() {
  const tl = document.getElementById('tl');
  try {
    const [site, rawVersions] = await Promise.all([loadJson(SOURCES.site), loadJson(SOURCES.versions)]);
    const entries = sortEntries(rawVersions.map(normalizeEntry));
    const stats = computeStats(entries);

    document.getElementById('hero').innerHTML = renderHero(site, stats);
    tl.innerHTML = renderTimeline(entries, site);
    document.getElementById('footer').innerHTML = renderFooter(site);
    setNavLinks(site);
    document.title = `${site.brand} · 版本时间线`;
  } catch (err) {
    console.error('时间线内容加载失败:', err);
    tl.innerHTML = `<div class="loaderr">内容加载失败,请刷新重试。<br><small>${escapeHtml(err.message)}</small></div>`;
  }
}

main();
```

- [ ] **Step 2: 浏览器核对完整渲染**

确保 `node bin/serve.mjs` 在运行,刷新 `http://localhost:8080/`。
Expected,逐项确认:
- hero 显示金色「LoongCode」字标、标语、`当前 v0.6.0` / `Windows` / `macOS` / `Tauri 2 + React 19` pill、下载按钮、meta「规划中 2 项 · 6 个已发布里程碑 · 13 个补丁」。
- 时间线自上而下:`▲ 规划 · FUTURE` → 未排期(琥珀虚线)→ v0.7.0(琥珀虚线)→ v0.6.0(紫色高亮 +「最新」)→ v0.5.0 → v0.4.0 → v0.3.0 → v0.2.0 → v0.1.0(带「起点」)。
- 折叠补丁块数量正确(0.5=2、0.4=3、0.3=2、0.2=6);已发布卡片有「完整发布说明 →」,规划卡片无。
- nav 的 GitHub / 下载链接 href 指向 site.json 中地址;页脚两条链接在(源码主仓库因留空而隐藏)。
- **控制台无任何报错**。

- [ ] **Step 3: Commit**

```bash
git add docs/assets/app.js
git commit -m "feat(ui): app.js 加载数据并渲染交错时间线/补丁折叠/规划节点"
```

---

## Task 7: 容错与响应式验证

**Files:**
- Verify only(必要时微调 `docs/assets/app.js` / `docs/assets/styles.css`)

- [ ] **Step 1: 验证加载失败的友好降级**

临时模拟:浏览器开发者工具 Network 面板设为 Offline 后刷新,或临时把 `docs/data/versions.zh.json` 改名再刷新。
Expected:时间线区域显示「内容加载失败,请刷新重试。」卡片(含错误详情小字),**不是白屏**;控制台有 `时间线内容加载失败:` 的 error。
验证后恢复文件名 / 关闭 Offline。

- [ ] **Step 2: 验证窄屏响应式**

开发者工具切到移动视图(如 iPhone SE 375px)或把窗口拉窄到 <760px。
Expected:主轴移到左侧,所有节点塌为**单列左对齐**,卡片不溢出、补丁块自动换行、`▲ 规划` 左对齐。

- [ ] **Step 3: 验证数据缺字段的安全降级**

临时编辑 `docs/data/versions.zh.json`,从任一条目删除 `tags`(或 `patches`)字段后刷新。
Expected:页面正常渲染,该条目仅少了对应区块,无报错(`normalizeEntry` 已补默认值)。验证后还原。

- [ ] **Step 4: 重跑单测确认逻辑未被破坏**

Run: `node --test tests/*.test.js`
Expected: PASS — 13 个测试全过。

- [ ] **Step 5: Commit(若有微调)**

```bash
git add -A docs/
git commit -m "fix(ui): 时间线容错与响应式细节打磨"
```
若 Step 1–3 未发现问题、无改动,可跳过本次提交。

---

## Task 8: 部署说明与最终验收

**Files:**
- Create: `docs/README.md`(站点说明 + 部署 / 维护指引)

- [ ] **Step 1: 创建 `docs/README.md`**

```markdown
# LoongCode 版本时间线（GitHub Pages）

零构建、数据驱动的版本时间线静态站。纯 HTML/CSS/原生 JS + JSON 数据。

## 本地预览

> 站点用到 `fetch()` 与 ES Module,需经 HTTP 访问(`file://` 会被 CORS 拦截)。

```bash
node bin/serve.mjs        # 然后打开 http://localhost:8080/
```

## 部署（GitHub Pages）

1. 推送本分支并合并到 `main`。
2. 仓库 Settings → Pages → Build and deployment → Source 选 **Deploy from a branch**。
3. 分支选 `main`,目录选 **`/docs`**,保存。
4. 等待发布,访问 `https://release.loongcode.cc`。
   `docs/.nojekyll` 已确保纯静态资源按原样服务。

## 维护

- **发新版本**:在 `docs/data/versions.zh.json` 加一条;把上一个 `status:"latest"` 改为 `"released"`,新版本设 `"latest"`;补丁追加进对应里程碑的 `patches`(`{version, note}`)。
- **填规划**:编辑 / 增删 `status:"planned"` 条目;一旦排期,给它补上 `version` 即自动按版本号归位到时间树。
- 站点链接、当前版本号在 `docs/data/site.json` 维护。
- 改完用 `node --test tests/*.test.js` 跑一遍数据完整性单测,再 `node bin/serve.mjs` 目视确认。
```

- [ ] **Step 2: 最终验收清单(对照 spec §12)**

确保 `node bin/serve.mjs` 运行,逐项打勾:
- [ ] 6 个里程碑 + 2 个规划项全部渲染,排序为版本号降序、规划在顶、`v0.6.0` 高亮「最新」、`v0.1.0` 标「起点」。
- [ ] 窄屏(375px)塌为单列且不错位。
- [ ] `node --test tests/*.test.js` 全过(`site.json` / `versions.zh.json` 合法且计数 6/13/2)。
- [ ] 「完整发布说明 →」指向 `https://github.com/LoongCode0/loongcode-release/releases/tag/vX.Y.Z`;「下载安装包」「GitHub」指向正确。
- [ ] 模拟数据加载失败,显示友好提示而非白屏。

- [ ] **Step 3: Commit**

```bash
git add docs/README.md
git commit -m "docs: 时间线站本地预览/部署/维护说明 + 最终验收清单"
```

- [ ] **Step 4: 部署(需用户确认后再推送)**

> 推送 / 合并到 `main` 与开启 GitHub Pages 属于对外发布动作,**须经用户确认**后执行(本计划不自动推送)。

```bash
# 用户确认后:
git push -u origin feat/version-timeline-site
# 然后按 docs/README.md 的「部署」章节在 GitHub 网页端开启 Pages
```

---

## 完成标准

- `node --test tests/*.test.js` 全绿(纯逻辑 + 数据完整性)。
- 本地经 `node bin/serve.mjs` 访问,页面与已确认的视觉稿一致、响应式正常、控制台无报错。
- GitHub Pages 从 `main` `/docs` 成功发布,线上地址可访问。
- 新增版本仅需编辑 `docs/data/versions.zh.json`,无需改代码。
