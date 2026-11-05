// run: node --test tests/seo.test.mjs   (Node >= 22.18 strips the TypeScript types)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { CANONICAL_SITE_URL, DEFAULT_SITE_URL, DISALLOWED_PATHS, PUBLIC_ROUTES, absoluteUrl, resolveSiteUrl } from '../src/lib/seo.ts';

test('site URL is always the canonical https://artscope.jadru.com, whatever the env says', () => {
  assert.equal(CANONICAL_SITE_URL, 'https://artscope.jadru.com');
  assert.equal(DEFAULT_SITE_URL, CANONICAL_SITE_URL);
  for (const env of ['https://artscope.jadru.com/', 'artscope.jadru.com', 'https://artscope.kr', 'https://www.artscope.kr', 'https://example.org/some/path', 'http://localhost:3000', 'https://artscope-abc.vercel.app', '', undefined]) {
    assert.equal(resolveSiteUrl({ NEXT_PUBLIC_ROOT_URL: env }), CANONICAL_SITE_URL, String(env));
  }
});

test('artscope.kr and www.artscope.kr 308 to the canonical host with the path kept', async () => {
  const { CANONICAL_ORIGIN, legacyHostRedirects, default: config } = await import('../next.config.ts');
  assert.equal(CANONICAL_ORIGIN, CANONICAL_SITE_URL);
  const rules = legacyHostRedirects();
  const all = await config.redirects();
  assert.deepEqual(all.slice(0, rules.length), rules);
  assert.deepEqual(rules.map((r) => r.has[0].value).sort(), ['artscope.kr', 'www.artscope.kr']);
  for (const r of rules) {
    assert.equal(r.source, '/:path*');
    assert.equal(r.destination, 'https://artscope.jadru.com/:path*');
    assert.equal(r.permanent, true);
    assert.equal(r.has[0].type, 'host');
  }
});

test('root layout sets a per-page canonical and og:url relative to the canonical metadataBase', () => {
  const src = readFileSync(new URL('../src/app/layout.tsx', import.meta.url), 'utf8');
  assert.match(src, /alternates: \{ canonical: "\.\/" \}/);
  assert.match(src, /url: "\.\/"/);
  assert.doesNotMatch(src, /artscope\.kr/);
});

test('public routes cover /, /privacy, /story and each maps to a real page', () => {
  const paths = PUBLIC_ROUTES.map((r) => r.path);
  for (const p of ['/', '/privacy', '/story']) assert.ok(paths.includes(p), p);
  assert.equal(new Set(paths).size, paths.length);
  const pageFor = (p) => (p === '/' ? 'src/app/(main)/(list)/page.tsx' : [`src/app/(main)${p}/page.tsx`, `src/app${p}/page.tsx`].find(existsSync));
  for (const p of paths) assert.ok(pageFor(p) && existsSync(pageFor(p)), `no page for ${p}`);
  for (const p of paths) assert.ok(!DISALLOWED_PATHS.some((d) => p !== '/' && p.startsWith(d)), `${p} is disallowed`);
});

test('absolute URLs have no double slashes or trailing slash on the root', () => {
  assert.equal(absoluteUrl('https://artscope.jadru.com', '/'), 'https://artscope.jadru.com');
  assert.equal(absoluteUrl('https://artscope.jadru.com', '/story'), 'https://artscope.jadru.com/story');
  assert.equal(absoluteUrl('https://artscope.jadru.com', 'privacy'), 'https://artscope.jadru.com/privacy');
});

test('no static robots.txt or sitemap.xml shadows the generated ones', () => {
  assert.ok(!existsSync('public/robots.txt'));
  assert.ok(!existsSync('public/sitemap.xml'));
});

import { readFileSync } from 'node:fs';
import { ARTICLES_PATH, MEMBERS_PATH, loadDynamicEntries } from '../src/lib/seo.ts';
import nextConfig, { LEGACY_SITEMAP_PATHS } from '../next.config.ts';

const SITE = 'https://artscope.jadru.com';
const okFetch = async (path) =>
  path === ARTICLES_PATH
    ? { magazines: [{ id: 12, updatedTime: '2026-10-01T10:00:00Z' }, { id: 7, createdTime: 'bad date' }] }
    : ['artist_a', '김작가'];

test('AS-13: dynamic entries load and failures are reported, not swallowed', async () => {
  const ok = await loadDynamicEntries(SITE, okFetch);
  assert.deepEqual(ok.failures, []);
  assert.deepEqual(ok.entries.map((e) => e.url), [
    `${SITE}/article/12`, `${SITE}/article/7`, `${SITE}/profile/artist_a`, `${SITE}/profile/%EA%B9%80%EC%9E%91%EA%B0%80`,
  ]);
  assert.equal(ok.entries[0].lastModified.toISOString(), '2026-10-01T10:00:00.000Z');
  assert.equal(ok.entries[1].lastModified, undefined);

  const down = await loadDynamicEntries(SITE, async () => { throw new Error('HTTP 503'); });
  assert.equal(down.entries.length, 0);
  assert.deepEqual(down.failures, [`${ARTICLES_PATH}: HTTP 503`, `${MEMBERS_PATH}: HTTP 503`]);

  const partial = await loadDynamicEntries(SITE, async (p) => (p === ARTICLES_PATH ? { error: 'x' } : okFetch(p)));
  assert.deepEqual(partial.failures, [`${ARTICLES_PATH}: unexpected response shape`]);
  assert.equal(partial.entries.length, 2);
});

test('AS-13: sitemap route logs failures and throws at runtime (keeps last good version)', () => {
  const src = readFileSync('src/app/sitemap.ts', 'utf8');
  assert.match(src, /export const revalidate = 3600;/);
  assert.match(src, /console\.error\(/);
  assert.match(src, /if \(!isBuild\) throw/);
});

test('AS-12: old sitemap URLs 308-redirect to /sitemap.xml and the 500 handlers are gone', async () => {
  assert.deepEqual(LEGACY_SITEMAP_PATHS, ['/sitemap/article.xml', '/sitemap/user.xml']);
  const redirects = await nextConfig.redirects();
  for (const source of LEGACY_SITEMAP_PATHS) {
    assert.ok(redirects.some((r) => r.source === source && r.destination === '/sitemap.xml' && r.permanent === true), source);
    assert.ok(!existsSync(`src/app${source}/route.ts`), `${source} handler still exists`);
  }
});

test('AS-14: footer no longer links to the /simple editor demo', () => {
  assert.doesNotMatch(readFileSync('src/components/Footer.tsx', 'utf8'), /["']\/simple["']/);
});

test('AS-15: root layout metadata uses resolveSiteUrl, not the raw env value', () => {
  const src = readFileSync('src/app/layout.tsx', 'utf8');
  assert.match(src, /resolveSiteUrl\(\)/);
  assert.match(src, /metadataBase: new URL\(SITE_URL \+ "\/"\)/);
  assert.doesNotMatch(src, /NEXT_PUBLIC_ROOT_URL/);
});
