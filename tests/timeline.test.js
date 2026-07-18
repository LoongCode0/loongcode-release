import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  parseVersion, sortEntries, buildFullNotesUrl, normalizeEntry, computeStats,
} from '../docs/assets/timeline.js';

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

const versionsZh = JSON.parse(
  readFileSync(new URL('../docs/data/versions.zh.json', import.meta.url)),
);
const siteJson = JSON.parse(
  readFileSync(new URL('../docs/data/site.json', import.meta.url)),
);

test('versions.zh.json 计数正确:9 里程碑 / 36 补丁 / 1 规划', () => {
  const stats = computeStats(versionsZh);
  assert.equal(stats.milestoneCount, 9);
  assert.equal(stats.patchCount, 36);
  assert.equal(stats.plannedCount, 1);
});

test('versions.zh.json 排序后:首项为无版本号规划,末项为 0.1.0,latest 为 0.9.0', () => {
  const sorted = sortEntries(versionsZh);
  assert.equal(sorted[0].version, null);
  assert.equal(sorted[sorted.length - 1].version, '0.1.0');
  const latest = versionsZh.filter((e) => e.status === 'latest');
  assert.equal(latest.length, 1);
  assert.equal(latest[0].version, '0.9.0');
});

test('site.json 含必要字段', () => {
  assert.ok(siteJson.brand && siteJson.releaseTagBase && siteJson.links);
  assert.ok(siteJson.links.download && siteJson.links.github);
});

test('computeStats 不计入 planned 条目上的 patches', () => {
  const entries = [
    { version: '0.8.0', status: 'planned', patches: [{ version: '0.8.0-rc' }] },
    { version: '0.6.0', status: 'latest', patches: [] },
    { version: '0.5.0', status: 'released', patches: [{ version: '0.5.1' }] },
  ];
  assert.deepEqual(computeStats(entries), { plannedCount: 1, milestoneCount: 2, patchCount: 1 });
});

test('normalizeEntry 缺失 title/date 默认空串', () => {
  const n = normalizeEntry({ version: '0.6.0', status: 'latest' });
  assert.equal(n.title, '');
  assert.equal(n.date, '');
});

test("buildFullNotesUrl: 'auto' 与空串走自动拼接", () => {
  assert.equal(buildFullNotesUrl({ version: '0.4.0', status: 'released', fullNotesUrl: 'auto' }, SITE), 'https://example.com/releases/tag/v0.4.0');
  assert.equal(buildFullNotesUrl({ version: '0.4.0', status: 'released', fullNotesUrl: '' }, SITE), 'https://example.com/releases/tag/v0.4.0');
});
