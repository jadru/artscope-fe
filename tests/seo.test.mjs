// run: node --test tests/seo.test.mjs   (Node >= 22.18 strips the TypeScript types)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { DEFAULT_SITE_URL, DISALLOWED_PATHS, PUBLIC_ROUTES, absoluteUrl, resolveSiteUrl } from '../src/lib/seo.ts';

test('site URL comes from NEXT_PUBLIC_ROOT_URL and is never localhost', () => {
  assert.equal(resolveSiteUrl({ NEXT_PUBLIC_ROOT_URL: 'https://artscope.jadru.com/' }), 'https://artscope.jadru.com');
  assert.equal(resolveSiteUrl({ NEXT_PUBLIC_ROOT_URL: 'artscope.jadru.com' }), 'https://artscope.jadru.com');
  assert.equal(resolveSiteUrl({ NEXT_PUBLIC_ROOT_URL: 'https://example.org/some/path' }), 'https://example.org');
  for (const bad of [undefined, '', '  ', 'http://localhost:3000', 'https://localhost', 'http://127.0.0.1:3000', 'http://artscope.jadru.com', 'not a url ::', 'https://x-git-y.vercel.app']) {
    assert.equal(resolveSiteUrl({ NEXT_PUBLIC_ROOT_URL: bad }), DEFAULT_SITE_URL, String(bad));
  }
  assert.equal(DEFAULT_SITE_URL, 'https://artscope.jadru.com');
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
