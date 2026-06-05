<div align="center">

# LoongCode

**把 Claude Code 装进桌面的 AI Agent IDE**

将 Claude Code CLI 包裹进一个现代化的桌面工作台 —— 多会话对话、集成终端、文件树、Git Review、命令 / 文件面板，以及 MCP、插件、技能、模型供应商的可视化管理，开箱即用。

![version](https://img.shields.io/badge/version-0.4.1-6d5efc)
![platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS-444)
![built with](https://img.shields.io/badge/built%20with-Tauri%202%20%2B%20React%2019-2f6df6)

</div>

> 📦 **这里是 LoongCode 的官方发布仓库。** 它提供各平台安装包下载，并作为应用「自动更新」的下载源（`latest.json`）。如需源码与开发说明，请前往项目主仓库。

---

## LoongCode 是什么

**LoongCode** 是一个基于 **Tauri 2 + React 19** 的跨平台桌面应用，本质上是 **Claude Code CLI 的图形化外壳**。

它把命令行里的 Agent 编程体验，搬进了一个真正的 IDE 式界面：

- 每一个「任务」对应一个独立的 Claude Code 会话；
- 应用以子进程方式拉起 `claude` CLI，通过 stdin/stdout 以 stream-json 协议通信；
- 把事件流实时渲染成对话 UI，并在同一个窗口里集成终端、文件树、Git Review、命令 / 文件面板，以及各类设置。

> ⚠️ **重要：LoongCode 自身不直接调用 Anthropic API。** 所有模型交互都由它拉起的 CLI 子进程完成。因此在使用前，你需要先在本机安装并登录 **Claude Code CLI**。

---

## ✨ 核心功能

### 会话与任务
- **多工作区 / 多任务管理** —— 每个任务都是一个独立、可恢复的 Claude Code 会话。
- **历史精确还原** —— 从 Claude 的会话 JSONL 加上应用侧的 sidecar 还原对话，连用户输入里的文件、命令、图片 chip 身份都能 1:1 复原。
- **会话分叉 / 优雅中断 / 重跑** —— 从任意历史节点 fork 出新会话；点「停止」等价于按 ESC 优雅中断，保留已生成内容、可继续对话。
- **编辑历史用户消息**，并从该点继续。
- **子 Agent 子对话** —— 子 Agent 的对话被路由进独立的折叠卡片，主线清晰不打架。

### 对话体验
- **富文本消息气泡** —— Markdown 渲染、表格、代码语法高亮、Markdown 预览。
- **工具调用可折叠卡片** —— Read / Write / Edit 的 diff、WebSearch 结果等，一目了然又不占地方。
- **交互式提问（AskUserQuestion）** —— 在 UI 里直接点选选项，支持「其他」自定义输入。
- **AI 消息工具栏**、对话内链接用系统浏览器打开、任务状态与未读指示。

### 输入（Composer）
- **斜杠命令面板**（`/command`）与 **@ 文件提及面板**、内联文件 chip。
- **图片输入**、**每任务独立草稿**、**模型 / 推理强度选择器**、可自定义的输入工具栏。

### 集成开发工具
- **集成终端** —— 基于 xterm.js + PTY 的真实终端。
- **文件树侧栏 + 侧边文件面板 + Monaco 编辑器** —— 浏览、查看代码与 Diff。
- **文件树多选与文件操作** —— 单击选中 / 拖拽框选，复制 / 剪切 / 粘贴（接入系统文件剪贴板，与资源管理器互通）、新建 / 重命名 / 删除，支持 `Del` 与 `Ctrl+C/X/V` 快捷键。
- **Git 工作流** —— 分支切换、变更 Review 面板、提交菜单、worktree 自动检测与跟随。
- **在文件资源管理器中打开**当前工作区。

### 配置与扩展
- **Skills（技能）/ MCP 服务器 / Plugins（插件）** 的可视化管理。
- **Model Providers（模型供应商）** 配置，自由切换后端。
- **依赖管理 + 运行时版本管理** —— 依赖按必须 / 可选分层呈现；对 `uv` / `pnpm`（及 `bun`）可列出 / 安装 / 卸载 / 切换多版本，并支持一键兜底安装。
- **代理设置** —— 支持 http / https 代理（不支持 SOCKS）。
- **环境变量设置** —— 为 Claude Code CLI 子进程注入自定义环境变量（改动自动触发子进程重启）。
- **用量统计（Usage）** —— 直观查看消耗。

### 桌面体验
- **全应用自定义右键菜单** —— 对话区、预览、文件树、任务行、侧边栏空白处都有贴合场景的右键菜单，替换系统默认菜单。
- **后台任务栏提醒** —— 窗口不在前台（含最小化）时，AI 完成 / 失败 / 弹出确认请求会像 QQ / 微信那样闪烁任务栏图标。
- **新建任务记住上次配置** —— 新建任务 / 技能自动继承上一次使用的模型供应商与参数。
- **无边框透明窗口** + 亚克力 / vibrancy 模糊，失败时优雅降级。
- **深色主题**、蓝紫渐变视觉、金色 wordmark。
- **中 / 英文安装界面**，安装时可选语言。
- **内置自动更新** —— 启动后静默检查并提示升级。
- **新手引导（Onboarding Tour）** —— 第一次使用不迷路。

---

## 💻 系统要求

| 项目 | 说明 |
| --- | --- |
| **操作系统** | Windows 10/11（x64 / ARM64）、macOS（Apple Silicon 与 Intel，Universal） |
| **必备依赖** | **Claude Code CLI** 已安装并完成登录 / 配置 |
| **网络（可选）** | 如需走代理，仅支持 http / https 代理（不支持 SOCKS） |

> 实际可下载的安装包，请以本仓库 [Releases](../../releases) 页面的产物为准。

---

## 📥 下载与安装

1. 打开本仓库的 **[Releases](../../releases)** 页面。
2. 选择与你的系统匹配的安装包下载：
   - **Windows**：NSIS 安装程序（`.exe`），安装向导内置中 / 英文界面。
   - **macOS**：磁盘镜像（`.dmg`）/ 应用包。
3. 运行安装包，按向导完成安装。
4. 首次启动前，请确认本机已安装并登录 **Claude Code CLI**（见上方系统要求）。

> 若系统弹出来源安全提示（Windows SmartScreen / macOS Gatekeeper），按系统指引选择继续运行即可。

---

## 🚀 快速开始

1. **准备 CLI** —— 安装并登录 Claude Code CLI。
2. **安装并打开 LoongCode**。
3. **添加工作区** —— 指向你的项目目录。
4. **新建任务** —— 输入需求，回车即开始一个 Claude Code 会话。
5. 在右侧用**终端、文件树、Git Review** 跟进改动，在设置里按需接入 **MCP / 插件 / 技能 / 模型供应商**。

---

## 🔄 自动更新

LoongCode 内置 [Tauri Updater](https://v2.tauri.app/plugin/updater/)。应用会向本仓库的发布源拉取更新清单：

```
https://github.com/LoongCode0/loongcode-release/releases/latest/download/latest.json
```

检测到新版本时会提示用户，Windows 端采用 passive（静默）安装模式，更新过程基本无感。

---

## ❓ 常见问题

**Q：装好后无法对话 / 没有任何模型响应？**
A：LoongCode 不自带模型能力，它依赖本机的 Claude Code CLI。请确认 `claude` 已安装、在 PATH 中、并已完成登录。

**Q：公司网络需要代理怎么办？**
A：在应用设置中配置 http / https 代理。注意被拉起的 CLI 仅支持 http/https，不支持 SOCKS。

**Q：更新检查不到新版本？**
A：自动更新依赖本仓库 Releases 的 `latest.json`，请确认网络可访问 GitHub。

---
