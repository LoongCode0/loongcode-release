# LoongCode 版本时间线（GitHub Pages）

零构建、数据驱动的版本时间线静态站。纯 HTML/CSS/原生 JS + JSON 数据。

## 本地预览

> 站点用到 `fetch()` 与 ES Module，需经 HTTP 访问（`file://` 会被 CORS 拦截）。

```bash
node bin/serve.mjs        # 然后打开 http://localhost:8080/
```

## 部署（GitHub Pages）

1. 推送本分支并合并到 `main`。
2. 仓库 Settings → Pages → Build and deployment → Source 选 **Deploy from a branch**。
3. 分支选 `main`，目录选 **`/docs`**，保存。
4. 等待发布，访问 `https://release.loongcode.cc`。
   `docs/.nojekyll` 已确保纯静态资源按原样服务。

## 维护

- **发新版本**：在 `docs/data/versions.zh.json` 加一条；把上一个 `status:"latest"` 改为 `"released"`，新版本设 `"latest"`；补丁追加进对应里程碑的 `patches`（`{version, note}`）。
- **填规划**：编辑 / 增删 `status:"planned"` 条目；一旦排期，给它补上 `version` 即自动按版本号归位到时间树。
- 站点链接、当前版本号在 `docs/data/site.json` 维护。
- 改完用 `node --test tests/*.test.js` 跑一遍数据完整性单测，再 `node bin/serve.mjs` 目视确认。
