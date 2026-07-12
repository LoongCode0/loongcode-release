<div align="center">

**English** | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md)

# <img src="docs/assets/logo-light.png" width="40" alt="LoongCode logo" align="middle"> LoongCode

**The AI Agent IDE that puts Claude Code and OpenAI Codex on your desktop**

Wraps the Claude Code CLI and OpenAI Codex CLI inside a modern desktop workbench — multi-session conversations, an integrated terminal, a file tree, Git review, command/file palettes, plus visual management for MCP, plugins, skills, and model providers. Works out of the box.

![version](https://img.shields.io/badge/version-0.9.5-6d5efc)
![platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS-444)
![built with](https://img.shields.io/badge/built%20with-Tauri%202%20%2B%20React%2019-2f6df6)

[![Version Timeline](https://img.shields.io/badge/Version%20Timeline-View%20Online-6d5efc)](https://release.loongcode.cc)
[![📖 User Guide](https://img.shields.io/badge/%F0%9F%93%96%20User%20Guide-Click%20to%20View-0ea5e9?style=flat&labelColor=0f172a)](https://docs.loongcode.cc)

</div>

> **[📖 View the full user guide →](https://docs.loongcode.cc)**　Learn about every feature, configuration tip, and best practice.


<div align="center">

### 🎬 Promo Video · See LoongCode in Action



https://github.com/user-attachments/assets/f679fd9d-627c-4376-8af3-7ca907049eab



</div>

> 📦 **This is LoongCode's official release repository.** It hosts installers for every platform and serves as the download source for the app's "auto-update" feature (`latest.json`). For source code and development docs, please head to the main project repository.

> 📈 **Version Timeline / Roadmap**: **<https://release.loongcode.cc>** — a timeline of completed features per release, plus what's coming next (native mobile apps, Agent Teams, and more).

---

## What is LoongCode

**LoongCode** is a cross-platform desktop **Agent IDE** built on **Tauri 2 + React 19** — at its core, a **unified graphical shell for multiple Agent CLIs like Claude Code and OpenAI Codex** (with more CLIs to come).

It brings the Agent coding experience — previously confined to the command line — into a true IDE-style interface:

- Every "task" maps to an independent AI session, freely switchable between CLI families like **Claude Code** and **OpenAI Codex** (chosen per task, with each task keeping its own model/config);
- The app spawns the local `claude` or `codex` CLI as a subprocess and talks to it in real time over a streaming JSON protocol;
- The event stream is rendered live as a chat UI, with an integrated terminal, file tree, Git review, command/file palettes, and assorted settings all in the same window.

> 💡 Think of it this way: **the CLI is the engine, LoongCode is the cockpit** — model calls, code execution, and file operations belong to the CLI; multi-task management, history restoration, Git integration, and other workflow enhancements belong to LoongCode. The two run decoupled and upgrade independently.

> ⚠️ **Important: LoongCode never calls any model API directly.** All model interaction happens through the CLI subprocess it launches, and API keys/model configuration are managed by that CLI. So before you start, make sure your machine has the **required dependencies**: an installed and logged-in **Claude Code CLI** and **Git**; if you also want to use **OpenAI Codex** family tasks, additionally install the **optional dependency**, the **Codex CLI**.
>
> 👉 No need to leave the app if you haven't installed them yet: LoongCode has a built-in **"Dependency Management"** panel that can one-click install the Claude Code CLI, Git, and the Codex CLI (see "System Requirements" and "🧩 Dependencies & One-Click Install" below). You'll still need to log in yourself after installing.

---

## ✨ Key Features

### Sessions & Tasks
- **Multi-CLI support (Claude / OpenAI Codex / OpenCode)** — Tasks can switch freely among **Claude Code**, **OpenAI Codex**, and **OpenCode** CLI families (chosen per task/draft, each keeping its own config). Codex and OpenCode tasks get a full experience on par with Claude: **streaming output**, **interactive approvals with graceful interruption**, **history restoration**, **sub-agent cards**, **session forking**, plus visual management of skills/plugins/MCP/model providers; under the hood, Codex is driven by `codex app-server` and OpenCode by `opencode serve` + an SSE event stream, both kept alive as a persistent long connection — one process per task/directory, lazily started, reclaimed when idle. The newly added **OpenCode** also supports **reusing the app's built-in model providers** (OpenAI-compatible, credentials injected via config with no manual key setup), **per-task thinking depth/permission tier**, and **worktree session migration**; its tool cards and Read results are all normalized to the Claude style.
- **Multi-workspace / multi-task management** — Every task is an independent, resumable session; the task list sorts by recent activity, with active tasks automatically floating to the top; selecting a task auto-expands and focuses the group it belongs to (workspace / pinned / timeline date bucket).
- **Split conversations (multi-pane)** — The main area can split into multiple panes (recursive left/right and top/bottom tiling, draggable dividers, collapsible panes, **drag a pane's title to dock/swap/reorder**); each pane is a full conversation or a new draft, and panes **can be freely mixed across workspaces**; selecting a pane auto-syncs the sidebar/files/terminal/Git panels, layouts are remembered, and an accidental close can be undone with `Ctrl+Shift+T`.
- **Task archiving** — Inactive tasks can be archived manually (dropdown / right-click) or automatically based on recent activity, tucked away into a separate "Archive view" to keep the main list tidy; auto-archiving can be toggled and its threshold tuned in settings (hours / days / months), with running/pinned tasks protected.
- **Draft state for new tasks** — Clicking "New" opens a draft first, where you pick the workspace/model/Git branch or worktree inline; the task is only created once you send the first message (`Ctrl+N` for a quick new task, defaulting to the last-used workspace).
- **Precise history restoration** — Conversations are reconstructed from the CLI's native session records (Claude's JSONL, Codex's rollout) plus an app-side sidecar, restoring even the identity of files, commands, and image chips inside user messages 1:1.
- **Session forking / graceful interruption / rerun** — Fork a new session from any point in history; clicking "Stop" is equivalent to pressing ESC for a graceful interruption, keeping what's already been generated and letting you continue the conversation.
- **Edit a past user message** and continue from that point.
- **Sub-agent nested conversations** — Sub-agent conversations are routed into their own collapsible cards (a three-tier progressive disclosure of header card / work report / degraded stream), keeping the main thread clean and uncluttered.
- **Background task activity indicators** — Commands run with `run_in_background`, async sub-agents, service processes, **dynamic workflows**, and more all stay visible in real time and never get stuck showing "running": the task row and title bar surface a **⚡N indicator** summarizing the count, with completions/failures shown as unread highlight dots (no popups, no sounds); opening the **group overlay** gives a quick glance at all background items (workflow entries get their own icon and type hint); the tool card that kicked off a background task gets a **background status bar** appended (background sub-agents can be expanded in place to view their sub-conversation, including nested sub-agents rendered live); command/service-type tasks can also open a **closable live log view** on the right.
- **Claude dynamic workflow visualization (non-blocking)** — Discovers and triggers Claude Code dynamic workflows (user/project `.claude/workflows/*.js`); progress is rendered as rich progress cards: phase grouping (auto-expands while running, auto-collapses when idle), drill into a sub-agent's transcript, usage and results at a glance, and cards can be rebuilt from disk after an app restart. Workflows **run fully in the background, non-blocking**: the input box stays unlocked during execution and you can keep chatting; they're folded into the background task system (⚡ indicator / unread dot / sidebar timer / background activity overlay all stay in sync), long-running workflows won't get killed by idle reclamation, and an abnormal process exit or manual termination is honestly marked as failed.
- **Scheduled messages** — Schedule a task to send at a later time: supports four modes — specific time / interval / daily / cron — with a built-in, dependency-free date-time picker; even draft-state tasks can be scheduled. Scheduled status shows as a purple indicator, viewable and manageable together from the global overview.
- **Mobile support (WeChat ClawBot / Feishu Lark)** — After binding the official WeChat ClawBot or a Lark bot, you can remotely create/drive tasks and receive AI replies from your phone — even interactive questions (AskUserQuestion) can be answered by replying with a number. The Lark channel is built as a **native Rust long-lived connection**: scan a QR code to bind the app, private chats forward everything while group chats trigger on @mention, a connection-health indicator (green/yellow/gray), and automatic reconnection on network hiccups without losing credentials.
- **PC Remote Bridge (mobile companion)** — Pair your phone with the desktop via QR code, then establish a reliable bidirectional connection through an **encrypted relay** to drive desktop tasks remotely from your phone: real-time send/receive of conversation messages, **faithful history playback** (rich text/images inside user messages remain visible after switching back to mobile, every event carries a globally stable sequence number), per-task routing, graceful interruption, and the input box on mobile supports the same rich input — **/commands · @files · images**; opening a task pulls an **authoritative status snapshot** plus archive markers, so running/archived state is clear at a glance. Desktop's **four-piece config (model / reasoning effort / permissions / CLI) syncs both ways** — local changes push to the app, remote changes are persisted back to the desktop, and **OpenCode task settings — model / provider / thinking depth / permission tier — can likewise be viewed and changed from the phone**; slash commands and the skills list also cover OpenCode, and both **strictly follow the task's selected CLI** (switching CLI on a draft task switches its commands/skills/workflows list accordingly, no longer hardcoded to Claude's list). Interactive questions and permission requests are **answered once, synced both ways** — once answered on desktop, the answered state is reflected back to the phone in real time, so neither side ever double-prompts you, and **a pending permission request can still be answered after reopening the task** (stop/interrupt paths clean up in sync, leaving no ghost approval cards). **Background tasks and dynamic workflows are equally visible remotely** — the phone gets real-time background task status, a background sub-agent's internal conversation streams live during an active turn, workflow runs rebuilt from disk on cold start backfill when you open the task, and a workflow sub-agent's transcript is viewable remotely too. Under the hood it's all **native Rust**: ECDH pairing + end-to-end encryption, automatic reconnect-and-resend on disconnect with no packet loss, application-level heartbeats with fake-online detection, and unbinding a device takes effect immediately with an explicit receipt sent to the unbound app.

### Conversation Experience
- **Rich message bubbles** — Markdown rendering, tables, syntax-highlighted code, Markdown preview.
- **Tool-call timeline cards** — Read/Write/Edit diffs, WebSearch results, and more are aggregated into a continuous timeline card (consecutive calls share a left edge line, expandable line-by-line for details) — clear at a glance without taking up space.
- **Interactive questions (AskUserQuestion)** — Click options directly in the UI, with an "Other" free-text option supported.
- **AI message toolbar**, in-conversation links open in the system browser, task status and unread indicators.

### Input (Composer)
- **Slash command palette** (`/command`) plus an **@ file-mention palette** and inline file chips.
- **Image input**, **per-task independent drafts**, a **model / reasoning-effort picker** (Claude login ships with built-in **Fable** / Opus / Sonnet / Haiku tiers; Codex login ships with native **Codex OAuth** tiers and minimal–xhigh reasoning effort; OpenCode reuses the app's built-in **OpenAI-compatible providers** and lets you pick a thinking depth per task; the model dropdown filters by the current CLI family), and a customizable input toolbar.

### Integrated Dev Tools
- **Integrated terminal** — A real terminal built on xterm.js + PTY; links in terminal output are clickable (left-click opens in the embedded browser, right-click opens in the system browser or copies the address).
- **File tree sidebar + side file panel + Monaco editor** — Browse and view code and diffs.
- **Multi-select and file operations in the file tree** — Click to select / drag to box-select, copy / cut / paste (wired into the system file clipboard, interoperable with File Explorer), create / rename / delete, with `Del` and `Ctrl+C/X/V` shortcuts supported.
- **Git workflow** — Branch switching, a change-review panel, a commit menu (including ✨ one-click commit message generation), and automatic worktree detection and following.
- **Embedded browser panel** — Open web pages directly in the right-side panel, with multi-tab support shared across tasks — check docs or preview pages without leaving the app.
- **Open in File Explorer** for the current workspace.

### Configuration & Extensions
- **Visual management of Skills / MCP servers / Plugins / Sub-agents** — Covers all three CLI families, **Claude / Codex / OpenCode** (OpenCode natively shares Claude's skills root, and manages MCP plus enabling/disabling skills/sub-agents/slash commands via a managed `opencode.json`); sub-agents support viewing, creating, editing, deleting, and enabling/disabling across **user / project / plugin** scopes (plugin-provided ones are read-only).
- **Model Providers** configuration, freely switch backends — common models ship with **factory-default context window sizes**; when adding a model, the input placeholder shows a recommended value directly (a sensible default even if left blank).
- **Dependency management + runtime version management** — Dependencies are shown grouped by required/optional; the **required dependencies, Claude Code CLI and Git, support one-click in-app install** (installed directly on Windows; macOS's Git is guided through the system Xcode Command Line Tools), and **OpenAI Codex and OpenCode CLI can also be one-click installed in-app** (having at least one of the three AI CLIs installed is enough). For `uv` / `pnpm` (and `bun`), you can list / install / uninstall / switch between multiple versions, with one-click fallback install supported.
- **Proxy settings** — Supports http/https proxies (SOCKS is not supported).
- **Environment variable settings** — Inject custom environment variables into CLI subprocesses (Claude/Codex); changes automatically trigger a subprocess restart.
- **Usage** — See your consumption at a glance.

### Desktop Experience
- **App-wide custom context menus** — The conversation area, preview, file tree, task rows, and sidebar empty space all get context menus tailored to their context, replacing the system default menu.
- **Taskbar notifications for background tasks** — When the window isn't in the foreground (including minimized), an AI completion/failure or a confirmation request will flash the taskbar icon, just like QQ or WeChat.
- **New tasks remember your last config** — New tasks/skills automatically inherit the model provider and parameters you used last time.
- **Native window chrome (macOS)** — macOS uses the system's native overlay title bar with traffic-light buttons; the sidebar header reserves a safe area for the native traffic lights and supports the notch's full-screen safe area; Windows keeps its custom frameless window.
- **Consistent theming and color system ("Xuan Paper & Ink Gold")** — A brand-new visual language: three carefully tuned themes (dark / light / eye-care blue-black), warm xuan-paper backgrounds with ink-black text and a touch of gold, content headings set in a Source Han Serif typeface, and the dark theme adds a faint gold glow to the background. The conversation area, input area (a floating paper-like box with a round gold-seal send button), task rows (a gold-bookmark status spectrum), settings page (paper-card groupings), and file panel / terminal / Monaco (gruvbox ANSI16) are all re-skinned consistently across the app. The whole app's color system sits on a unified theme-token foundation (role / category palettes / semantic tokens, light/dark adaptive) — diffs, sub-agents, review, usage warnings, bot connection indicators, workflow status, model color palette, tag families, and more all consume tokens instead of hardcoded colors, so the look stays consistent across themes and follows the system's light/dark setting by default.
- **New app icon, "Ouroboros Dragon Ring"** — A dark ink-and-gold rounded square seal badge: a small dragon biting its own tail forms a ring, resting on an ink-black background with gold scales as the highlight; the in-app sidebar logo follows the three themes (dark / light / eye-care blue-black), each with its own color scheme, with the eye-care theme's wordmark in a matching blue-black tone.
- **Interface language (Chinese/English)** — The entire UI supports switching between Chinese and English, defaulting to the system language and falling back to English when it can't be detected; switch anytime in **Settings → General**. AI conversation content is unaffected.
- **Bilingual (Chinese/English) installer**, choose your language during installation.
- **Built-in auto-update** — Silently checks for updates on launch and prompts you to upgrade.
- **Onboarding Tour** — Never get lost on your first use.

---

## 💻 System Requirements

| Item | Details |
| --- | --- |
| **OS** | Windows 10/11 (x64 / ARM64), macOS (Apple Silicon and Intel, Universal) |
| **Required dependencies** | **Claude Code CLI** (installed and logged in / configured) and **Git**; both can be one-click installed in-app |
| **Optional dependency** | **OpenAI Codex CLI** — install it if you want to use Codex-family tasks; also supports one-click in-app install |
| **Network (optional)** | If you need a proxy, only http/https proxies are supported (SOCKS is not) |

> 💡 **It's fine if you haven't installed these two dependencies yet**: after installing LoongCode, go to **Settings → "Dependency Management"** to one-click install the Claude Code CLI and Git — no need to wrangle the command line by hand (see "🧩 Dependencies & One-Click Install" below for details).
>
> For the actual downloadable installers, refer to this repository's [Releases](../../releases) page.

---

## 📥 Download & Install

1. Open this repository's **[Releases](../../releases)** page.
2. Pick the installer that matches your system:
   - **Windows**: NSIS installer (`.exe`), with a bilingual Chinese/English installation wizard built in.
   - **macOS**: Disk image (`.dmg`) / app bundle.
3. Run the installer and follow the wizard to finish installation.
4. Before first use, make sure your machine has **Claude Code CLI** installed (and logged in) and **Git**; if not, you can one-click install them after launch via **Settings → "Dependency Management"** (see "🧩 Dependencies & One-Click Install" below).

> If the system shows a source-safety prompt (Windows SmartScreen / macOS Gatekeeper), follow the system's guidance to continue running it.

---

## 🧩 Dependencies & One-Click Install

Running LoongCode needs two **required dependencies**:

- **Claude Code CLI** — Provides the model capability (the app itself never calls the Anthropic API directly).
- **Git** — Powers branch switching, change review, worktrees, and other Git workflows.

It's fine if you haven't installed them yet — **no need to type any commands by hand**: open LoongCode, go to **Settings → "Dependency Management"**, and you'll see their install status under the "Required Dependencies" group; just click **"Install"** for a one-click setup.

| Required Dependency | Windows | macOS |
| --- | --- | --- |
| **Claude Code CLI** | One-click install (official install script) | One-click install (official install script) |
| **Git** | One-click install (portable PortableGit, installed into the app directory) | Click "Trigger System Install" to launch the system's Xcode Command Line Tools installer; or run `brew install git` yourself |

- Installation shows a live log, and status is automatically re-checked when it finishes.
- Behind a proxy, you can configure a per-dependency http/https proxy in this panel before installing.
- The "optional dependencies" `uv` / `pnpm` / `bun` also support one-click install and switching between multiple versions.
- **Optionally add OpenAI Codex CLI** — If you want Codex-family tasks, Dependency Management also supports **one-click installing the Codex CLI** (official install script / direct GitHub / mirror acceleration — three modes); the skills/plugins/MCP/sub-agent panels in settings all cover the Codex dimension too.
- **Choice of install source for Claude Code CLI** — Official install script / direct GitHub / GitHub mirror acceleration (customizable mirror prefix), for when the official source isn't reachable on some networks.
- **Choice of install source for Git (Windows)** — Direct GitHub / mirror acceleration (customizable mirror prefix); the portable PortableGit installs smoothly even on restricted networks.

> ⚠️ The app can only help you **install** the CLIs — **you still need to log in yourself**: run `claude` / `codex` in the integrated terminal and follow the prompts to log in, or configure your backend under **Settings → "Model Providers"**.

---

## 🚀 Quick Start

1. **Prepare dependencies** — Install Claude Code CLI and Git and log in to the CLI (also install the Codex CLI if you want Codex-family tasks); if you haven't installed them, you can open LoongCode first and one-click install via **Settings → "Dependency Management"**.
2. **Install and open LoongCode**.
3. **Add a workspace** — Point it at your project directory.
4. **Create a new task** — Type what you need and press Enter to start a session (choose Claude Code or OpenAI Codex in the input bar).
5. Use the **terminal, file tree, and Git review** on the right to follow along with changes, and wire up **MCP / plugins / skills / model providers** as needed in settings.

---

## 🔄 Auto Update

LoongCode has a built-in [Tauri Updater](https://v2.tauri.app/plugin/updater/). The app pulls its update manifest from this repository's release source:

```
https://github.com/LoongCode0/loongcode-release/releases/latest/download/latest.json
```

When a new version is detected, the user is prompted; on Windows this uses passive (silent) install mode, so the update process is mostly unnoticeable.

---

## ❓ FAQ

**Q: I haven't installed the Claude Code CLI or Git yet — do I have to install them by hand?**
A: No. Open LoongCode, go to **Settings → "Dependency Management"**, and click "Install" under "Required Dependencies." On Windows, both Claude Code CLI and Git can be installed directly; on macOS, Git is installed via the system's Xcode Command Line Tools. Remember to log in after installing Claude Code CLI.

**Q: I installed it but can't chat / get no model response at all?**
A: LoongCode doesn't ship with any model capability of its own — it relies on the CLI tools on your machine. Make sure the relevant CLI is installed, on your PATH, and logged in: Claude tasks need `claude`, Codex tasks need `codex`.

**Q: My company network requires a proxy — what do I do?**
A: Configure an http/https proxy in the app's settings. Note that the CLI it launches only supports http/https, not SOCKS.

**Q: The update check isn't finding a new version?**
A: Auto-update relies on this repository's Releases `latest.json`, so make sure your network can reach GitHub.

---
