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
    title: typeof entry.title === 'string' ? entry.title : '',
    date: typeof entry.date === 'string' ? entry.date : '',
    summary: Array.isArray(entry.summary) ? entry.summary : [],
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    patches: Array.isArray(entry.patches) ? entry.patches : [],
  };
}

/** 统计:规划项数 / 已发布里程碑数(有版本号)/ 补丁总数。 */
export function computeStats(entries) {
  let plannedCount = 0, milestoneCount = 0, patchCount = 0;
  for (const e of entries) {
    if (e.status === 'planned') {
      plannedCount++;
    } else if ((e.status === 'released' || e.status === 'latest') && parseVersion(e.version)) {
      milestoneCount++;
      patchCount += Array.isArray(e.patches) ? e.patches.length : 0;
    }
  }
  return { plannedCount, milestoneCount, patchCount };
}
