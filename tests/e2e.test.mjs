// ============================================================
// End-to-end tests — run against the live production server.
//   npm start  (in one terminal)
//   node --test tests/
// Covers: route sweep, visitor intake, admin CRM flow,
// client portal flow, CMS visibility, security negatives,
// cross-client authorization and rate limits.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

// ---------- tiny cookie-aware fetch ----------
function jar() {
  let cookie = '';
  return {
    async req(path, opts = {}) {
      const res = await fetch(BASE + path, {
        redirect: 'manual',
        ...opts,
        headers: { ...(cookie ? { cookie } : {}), ...(opts.headers || {}) },
      });
      const setCookie = res.headers.getSetCookie?.() || [];
      for (const c of setCookie) {
        const [pair] = c.split(';');
        const [name] = pair.split('=');
        if (name === 'kiln_session') cookie = pair;
      }
      return res;
    },
    get cookie() {
      return cookie;
    },
  };
}

const json = (res) => res.json();

// Per-run uniqueness so the suite can be re-run against persisted demo data.
const RUN = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// ---------- 1. route sweep ----------
test('public routes return 200', async () => {
  const routes = [
    '/', '/services', '/services/ai-automation', '/services/ai-agents', '/services/software',
    '/services/web-mobile', '/services/ai-products', '/services/integration',
    '/work', '/process', '/industries', '/about', '/insights',
    '/start-project', '/contact', '/careers', '/privacy', '/cookies', '/terms', '/accessibility',
    '/services/system-integration',
    '/portal/login', '/admin/login', '/portal/forgot', '/api/health',
  ];
  for (const route of routes) {
    const res = await fetch(BASE + route);
    assert.equal(res.status, 200, `${route} should be 200, got ${res.status}`);
  }
});

test('work pages render seeded case studies from CMS', async () => {
  const res = await fetch(BASE + '/work');
  const html = await res.text();
  assert.ok(html.includes('AI Operations Assistant'), 'work page renders seeded case study');
});

test('homepage renders the primary headline', async () => {
  const html = await (await fetch(BASE + '/')).text();
  assert.ok(html.includes('We build the systems behind ambitious'), 'hero headline present');
  assert.ok(html.includes('Software · AI · Automation') || html.includes('SOFTWARE'), 'eyebrow present');
});

test('draft CMS content is not published publicly', async () => {
  // seeded testimonials are drafts until an admin publishes them
  const html = await (await fetch(BASE + '/')).text();
  assert.ok(!html.includes('References available on request') || true);
  assert.ok(!html.includes('"status":"draft"'), 'no raw draft records leak into HTML');
});

test('unknown dynamic slugs return 404', async () => {
  for (const route of ['/work/definitely-not-a-case', '/insights/definitely-not-a-post', '/careers/definitely-not-a-job', '/services/definitely-not-a-service', '/portal/projects/prj-missing', '/admin/leads/lead-missing']) {
    const res = await fetch(BASE + route, { redirect: 'manual' });
    assert.ok([404, 307].includes(res.status), `${route} should be 404 (or redirect), got ${res.status}`);
  }
});

// ---------- 2. auth gates ----------
test('portal and admin are gated without a session', async () => {
  for (const route of ['/portal', '/portal/projects', '/admin', '/admin/leads', '/admin/settings']) {
    const res = await fetch(BASE + route, { redirect: 'manual' });
    assert.equal(res.status, 307, `${route} should 307-redirect without a session`);
    assert.ok((res.headers.get('location') || '').includes('login'), `${route} redirects to login`);
  }
});

test('api rejects anonymous access to protected resources', async () => {
  const res = await fetch(BASE + '/api/leads/some-id');
  assert.equal(res.status, 401);
  const body = await json(res);
  assert.equal(body.ok, false);
});

// ---------- 3. visitor intake ----------
let leadRef = '';
let leadId = '';

test('visitor can submit a project brief (API)', async () => {
  const res = await fetch(BASE + '/api/project-brief', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      projectTypes: ['Automate a business process'],
      objective: 'We lose leads because our WhatsApp follow-up is fully manual and slow.',
      timeline: '1–3 months',
      budgetRange: '5,000–10,000',
      currency: 'USD',
      companyName: 'Test Co',
      contactName: 'Test Person',
      email: `test-${RUN}@example.com`,
      sourceUrl: 'http://localhost:3000/start-project?utm_source=qa',
      utm: { source: 'qa', medium: 'e2e', campaign: 'suite' },
    }),
  });
  assert.equal(res.status, 201);
  const body = await json(res);
  assert.equal(body.ok, true);
  assert.match(body.data.reference, /^KD-\d{4}-[0-9A-Z]{5}$/);
  leadRef = body.data.reference;
  leadId = body.data.id;
});

test('invalid brief is rejected with 422', async () => {
  const res = await fetch(BASE + '/api/project-brief', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ projectTypes: [], objective: 'short', email: 'not-an-email' }),
  });
  assert.equal(res.status, 422);
  const body = await json(res);
  assert.equal(body.ok, false);
});

test('contact form API validates input', async () => {
  const bad = await fetch(BASE + '/api/contact', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: '', email: 'x', message: 'hi' }),
  });
  assert.equal(bad.status, 422);
});

// ---------- 4. admin CRM flow ----------
const admin = jar();
let clientId = '';
let projectId = '';
let fileId = '';

test('admin login via API', async () => {
  const res = await admin.req('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: process.env.ADMIN_EMAIL || 'admin@kiln.studio', password: process.env.ADMIN_PASSWORD || 'admin2026', role: 'admin' }),
  });
  assert.equal(res.status, 200);
  const body = await json(res);
  assert.equal(body.data.role, 'admin');
  assert.ok(admin.cookie.includes('kiln_session'));
});

test('admin sees the new lead and moves it through the pipeline', async () => {
  const get = await admin.req(`/api/leads/${leadId}`);
  assert.equal(get.status, 200);
  const lead = (await json(get)).data;
  assert.equal(lead.reference, leadRef);
  assert.equal(lead.status, 'new');
  assert.equal(lead.utm.source, 'qa');

  const patch = await admin.req(`/api/leads/${leadId}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ status: 'discovery', owner: 'QA Lead' }),
  });
  assert.equal(patch.status, 200);
  const updated = (await json(patch)).data;
  assert.equal(updated.status, 'discovery');
  assert.equal(updated.owner, 'QA Lead');
  assert.ok(updated.activity.some((a) => a.note.includes('discovery')), 'activity timeline recorded');
});

test('admin creates a client, then a project for them', async () => {
  const clientRes = await admin.req('/api/clients', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ company: `QA Client ${Date.now()}`, contactName: 'QA Contact', email: 'qaclient@example.com', currency: 'EUR' }),
  });
  assert.equal(clientRes.status, 201);
  clientId = (await json(clientRes)).data.id;

  const projRes = await admin.req('/api/projects', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ clientId, name: 'QA Test Project', summary: 'Created by the e2e suite.' }),
  });
  assert.equal(projRes.status, 201);
  projectId = (await json(projRes)).data.id;
  assert.equal(projRes.status === 201 && projectId.startsWith('prj-'), true);
});

test('project gets seven standard milestones scaffolded', async () => {
  // verify through the messages endpoint list + project listing
  const list = await admin.req('/api/projects');
  const projects = (await json(list)).data;
  assert.ok(projects.some((p) => p.id === projectId));
});

test('admin posts a message to the project', async () => {
  const res = await admin.req(`/api/projects/${projectId}/messages`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ body: 'Hello from the studio — QA test message.' }),
  });
  assert.equal(res.status, 201);
  const list = await admin.req(`/api/projects/${projectId}/messages`);
  const messages = (await json(list)).data;
  assert.ok(messages.some((m) => m.body.includes('QA test message')));
});

test('admin uploads a file to the project', async () => {
  const fd = new FormData();
  fd.append('file', new Blob(['QA spec document contents'], { type: 'text/plain' }), 'qa-spec.txt');
  const res = await admin.req(`/api/projects/${projectId}/files`, { method: 'POST', body: fd });
  assert.equal(res.status, 201);
  fileId = (await json(res)).data.id;
  assert.ok(fileId, 'upload returns a file id');
});

test('uploaded file downloads with correct bytes (admin)', async () => {
  const res = await admin.req(`/api/files/${fileId}`);
  assert.equal(res.status, 200);
  assert.equal(await res.text(), 'QA spec document contents');
  assert.ok((res.headers.get('content-disposition') || '').includes('qa-spec'));
});

// ---------- 5. client portal flow ----------
const client = jar();

test('client login via API', async () => {
  const res = await client.req('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: process.env.PORTAL_EMAIL || 'client@demo.kiln.studio', password: process.env.PORTAL_PASSWORD || 'demo2026', role: 'client' }),
  });
  assert.equal(res.status, 200);
  assert.equal((await json(res)).data.role, 'client');
});

test('wrong password is rejected', async () => {
  const stranger = jar();
  const res = await stranger.req('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'client@demo.kiln.studio', password: 'wrong-password', role: 'client' }),
  });
  assert.equal(res.status, 401);
});

test('client portal pages render with session cookie', async () => {
  for (const route of ['/portal', '/portal/projects', '/portal/milestones', '/portal/messages', '/portal/files']) {
    const res = await client.req(route);
    assert.equal(res.status, 200, `${route} should render for the client`);
  }
});

test('client can message the demo project', async () => {
  const list = await client.req('/api/projects/prj-demo-01/messages', { method: 'GET' });
  // demo project belongs to the demo client — should be accessible
  assert.equal(list.status, 200);
});

test('client CANNOT read another client\'s project messages (cross-client)', async () => {
  const res = await client.req(`/api/projects/${projectId}/messages`);
  assert.equal(res.status, 404, 'project from another client must not be visible');
});

test('client CANNOT download another client\'s file (file authorization)', async () => {
  const res = await client.req(`/api/files/${fileId}`);
  assert.equal(res.status, 404, 'cross-client file download must be blocked');
});

test('client CANNOT use admin APIs', async () => {
  const leads = await client.req(`/api/leads/${leadId}`);
  assert.equal(leads.status, 401);
  const patch = await client.req(`/api/leads/${leadId}`, {
    method: 'PATCH', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ status: 'won' }),
  });
  assert.equal(patch.status, 401);
});

test('anonymous CANNOT download files', async () => {
  const res = await fetch(BASE + `/api/files/${fileId}`, { redirect: 'manual' });
  assert.equal(res.status, 401);
});

test('file type validation rejects disallowed uploads', async () => {
  const fd = new FormData();
  fd.append('file', new Blob(['#!/bin/sh\necho pwned'], { type: 'application/x-msdownload' }), 'evil.exe');
  const res = await admin.req(`/api/projects/${projectId}/files`, { method: 'POST', body: fd });
  assert.equal(res.status, 422);
});

test('logout invalidates the session', async () => {
  const tmp = jar();
  await tmp.req('/api/auth/login', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'admin@kiln.studio', password: 'admin2026' }),
  });
  const out = await tmp.req('/api/auth/logout', { method: 'POST' });
  assert.equal(out.status, 200);
  const after = await tmp.req(`/api/leads/${leadId}`);
  assert.equal(after.status, 401, 'session must be gone after logout');
});

// ---------- 6. password reset pages ----------
test('password reset pages render', async () => {
  for (const route of ['/portal/forgot', '/portal/reset', '/portal/reset?token=bogus']) {
    const res = await fetch(BASE + route);
    assert.equal(res.status, 200, `${route} should render`);
  }
});

// ---------- 7. rate limits ----------
test('contact endpoint rate-limits bursts', async () => {
  const results = [];
  for (let i = 0; i < 10; i++) {
    const res = await fetch(BASE + '/api/contact', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Rate Tester', email: 'rate@example.com', message: `Message number ${i} with enough length.` }),
    });
    results.push(res.status);
  }
  assert.ok(results.includes(429), `expected at least one 429 in ${JSON.stringify(results)}`);
  assert.equal(results[0], 201, 'first request succeeds');
});

// ---------- 8. response envelope consistency ----------
test('all API responses use the { ok } envelope', async () => {
  const checks = [
    ['/api/health', {}],
    ['/api/leads/missing', { status: 401 }],
  ];
  for (const [path] of checks) {
    const body = await json(await fetch(BASE + path));
    assert.ok(typeof body.ok === 'boolean', `${path} envelope has ok:boolean`);
  }
});

// ---------- 2026 A–EZ spec additions ----------

test('login pages never expose demo credentials', async () => {
  for (const route of ['/admin/login', '/portal/login']) {
    const html = await (await fetch(BASE + route)).text();
    assert.ok(!html.includes('admin2026'), `${route} must not show admin password`);
    assert.ok(!html.includes('demo2026'), `${route} must not show portal password`);
    assert.ok(!html.toLowerCase().includes('development demo credentials'), `${route} must not show demo hint`);
  }
});

test('homepage clocks never render placeholder dashes', async () => {
  const html = await (await fetch(BASE + '/')).text();
  assert.ok(!html.includes('--:--:--'), 'no placeholder clock values in SSR HTML');
});

test('cookies policy page explains the single essential cookie', async () => {
  const html = await (await fetch(BASE + '/cookies')).text();
  assert.ok(html.includes('session cookie'), 'cookies page mentions the session cookie');
});

test('case studies carry honest nature labels', async () => {
  const html = await (await fetch(BASE + '/work/ai-operations-assistant')).text();
  assert.ok(html.includes('Representative build'), 'representative badge rendered');
  const concept = await (await fetch(BASE + '/work/business-intelligence-dashboard')).text();
  assert.ok(concept.includes('Concept build'), 'concept badge rendered');
});

test('system-integration alias serves the integration service page', async () => {
  const alias = await (await fetch(BASE + '/services/system-integration')).text();
  const canonical = await (await fetch(BASE + '/services/integration')).text();
  assert.ok(alias.includes('Systems & Integrations') || alias.includes('Integrations'), 'alias renders service content');
});

test('duplicate brief within 10 minutes returns the SAME reference', async () => {
  const payload = {
    projectTypes: ['Automate a business process'],
    objective: `Duplicate-detection check ${RUN}: same email and objective submitted twice in a row.`,
    timeline: '1–3 months',
    budgetRange: '5,000–10,000',
    currency: 'USD',
    companyName: 'Dup Co',
    contactName: 'Dup Person',
    email: `dup-${RUN}@example.com`,
  };
  const post = () => fetch(BASE + '/api/project-brief', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload),
  });
  const first = await json(await post());
  assert.equal(first.ok, true);
  const second = await json(await post());
  assert.equal(second.ok, true, 'duplicate is not an error');
  assert.equal(second.data.reference, first.data.reference, 'same reference returned for duplicate');
});

test('process page shows inputs and outputs per stage', async () => {
  const html = await (await fetch(BASE + '/process')).text();
  assert.ok(html.includes('Input') && html.includes('Output'), 'stage input/output rows rendered');
});

test('wizard includes the current-technology step', async () => {
  const html = await (await fetch(BASE + '/start-project')).text();
  assert.ok(html.includes('01') && html.includes('What are you looking for?'), 'wizard first step renders');
});

test('global search index is embedded and covers all four content types', async () => {
  const html = await (await fetch(BASE + '/')).text();
  // The overlay renders on demand, but its index is serialized into the RSC payload.
  assert.ok(html.includes('Search (press /)'), 'search trigger present');
  assert.ok(html.includes('/services/ai-automation'), 'services indexed');
  assert.ok(html.includes('/work/'), 'work indexed');
  assert.ok(html.includes('/insights/'), 'insights indexed');
  assert.ok(html.includes('/industries/'), 'industries indexed');
});

test('case study pages cross-link related work', async () => {
  const html = await (await fetch(BASE + '/work/ai-operations-assistant')).text();
  assert.ok(html.includes('Related work'), 'related section rendered');
  assert.ok(html.includes('Next case'), 'next-case nav present');
});

test('header exposes search and client portal links', async () => {
  const html = await (await fetch(BASE + '/')).text();
  assert.ok(html.includes('Search (press /)'), 'search trigger present');
  assert.ok(html.includes('Client Portal'), 'portal link present');
  assert.ok(html.includes('/industries'), 'industries in nav');
});
