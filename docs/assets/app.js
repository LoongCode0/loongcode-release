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
    <div class="big"><img class="hero-logo" src="./assets/logo.png" alt="">${escapeHtml(site.brand)}</div>
    <div class="tag">${escapeHtml(site.tagline)}</div>
    <div class="pills">
      <span class="pill cur">当前 v${escapeHtml(site.currentVersion)}</span>
      ${platforms}${tech}
    </div>
    <div class="cta">
      <a class="btn" href="${escapeHtml(site.links.download)}" target="_blank" rel="noopener noreferrer">↓ 下载安装包</a>
      <a class="btn ghost" href="#tl">查看时间线</a>
    </div>
    <div class="meta">${stats.plannedCount ? `规划中 ${stats.plannedCount} 项 · ` : ''}${stats.milestoneCount} 个已发布里程碑 · ${stats.patchCount} 个补丁</div>`;
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
  const full = url ? `<a class="full" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">完整发布说明 →</a>` : '';

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

  const hasPlanned = entries.some((e) => e.status === 'planned');
  const topcap = hasPlanned ? '<div class="topcap">▲ 规划 · FUTURE</div>' : '';
  return `${topcap}${rows}`;
}

function renderFooter(site) {
  const L = site.links || {};
  const items = [
    L.github ? `<a href="${escapeHtml(L.github)}" target="_blank" rel="noopener noreferrer">发布仓库</a>` : '',
    L.releases ? `<a href="${escapeHtml(L.releases)}" target="_blank" rel="noopener noreferrer">Releases 下载</a>` : '',
    L.sourceRepo ? `<a href="${escapeHtml(L.sourceRepo)}" target="_blank" rel="noopener noreferrer">源码主仓库</a>` : '',
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
