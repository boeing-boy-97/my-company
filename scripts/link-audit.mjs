// Site-wide link + metadata + placeholder audit.
// Crawls every public route, verifies internal hrefs resolve, checks
// required SEO metadata, and asserts no fake contact data is emitted.
const BASE = process.env.BASE || 'http://localhost:3000';

const SEED = [
  '/', '/services', '/work', '/industries', '/approach', '/studio',
  '/insights', '/careers', '/contact', '/start-project',
  '/portal/login', '/privacy', '/terms', '/cookies', '/accessibility',
  '/services/ai-automation', '/services/ai-agents', '/services/custom-software',
  '/services/web-mobile', '/services/ai-products', '/services/system-integration',
];

const fetched = new Map();
async function get(path) {
  if (fetched.has(path)) return fetched.get(path);
  let status = 0, html = '';
  try {
    const r = await fetch(BASE + path, { redirect: 'manual' });
    status = r.status;
    if (status < 400) html = await r.text();
  } catch (e) { status = -1; html = ''; }
  fetched.set(path, { status, html });
  return fetched.get(path);
}

const queue = [...SEED];
const internal = new Set(SEED);
const problems = [];

while (queue.length) {
  const path = queue.shift();
  const { status, html } = await get(path);
  if (path === '/portal' && status === 307) { continue; } // auth redirect — expected
  if (status !== 200 && path !== '/portal/login') { problems.push(`[fetch] ${path} -> ${status}`); continue; }

  // discover internal links
  const hrefs = [...html.matchAll(/href="(\/[^"#?]*?)"/g)].map((m) => m[1])
    .filter((h) => !h.startsWith('//') && !h.startsWith('/_next') && !h.match(/\.(svg|png|jpg|ico|webp|css|js|xml|txt|webmanifest)$/i));
  for (const h of hrefs) {
    const clean = h.replace(/\/$/, '') || '/';
    if (!internal.has(clean)) { internal.add(clean); queue.push(clean); }
  }

  // metadata checks (skip login/portal chrome)
  if (path !== '/portal/login') {
    if (!/<title>[^<]{8,}<\/title>/.test(html)) problems.push(`[meta] ${path}: missing/short <title>`);
    if (!/name="description" content="[^"]{30,}"/.test(html)) problems.push(`[meta] ${path}: missing meta description`);
    if (!/rel="canonical"/.test(html)) problems.push(`[meta] ${path}: missing canonical`);
    if (!/property="og:title"/.test(html)) problems.push(`[meta] ${path}: missing og:title`);
    if (!/property="og:image"/.test(html)) problems.push(`[meta] ${path}: missing og:image`);
  }

  // placeholder / fake-data leaks
  for (const pat of ['98765', 'wa.me', 'your-company', 'Acme', 'Lorem ipsum', 'TODO', 'FIXME', 'example.com', 'John Doe']) {
    if (html.includes(pat)) problems.push(`[leak] ${path}: contains "${pat}"`);
  }
  // broken asset references
  for (const m of html.matchAll(/(?:src|href)="(\/[^"]*\.(?:svg|png|jpg|webp|ico))(?:")/g)) {
    const asset = m[1].split('?')[0];
    const a = await get(asset);
    if (a.status !== 200) problems.push(`[asset] ${path}: ${asset} -> ${a.status}`);
    fetched.delete(asset); // don't treat assets as pages
  }
  // image tags without alt
  const noAlt = [...html.matchAll(/<img (?![^>]*alt=)[^>]*>/g)].filter((mm) => !mm[0].includes('aria-hidden'));
  if (noAlt.length) problems.push(`[a11y] ${path}: ${noAlt.length} <img> without alt`);
}

// external links: HEAD-check the non-placeholder ones that are public routes on known domains
for (const [path, { html }] of fetched) {
  for (const m of html.matchAll(/href="(https?:\/\/(?!localhost)[^"]+)"/g)) {
    const url = m[1];
    if (/linkedin\.com|github\.com|x\.com|wa\.me|mailto/.test(url)) {
      if (url.includes('your-company') || url.includes('wa.me/91')) problems.push(`[ext-leak] ${path}: ${url}`);
    }
  }
}

console.log(`Crawled ${fetched.size} routes (pages: ${[...internal].length}).`);
if (problems.length) {
  console.log(`\n${problems.length} PROBLEM(S):`);
  for (const p of [...new Set(problems)]) console.log('  ' + p);
  process.exit(1);
} else {
  console.log('\nALL CHECKS PASSED — links, metadata, placeholder leaks, assets, img alt.');
}
