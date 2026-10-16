import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { renderPage } from '../src/page.mjs';
import { profile } from '../src/data/profile.ts';

test('page keeps its compact sections and has no personal photos or fake form', () => {
 const html = renderPage(profile);
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
 for (const id of ['expertise','work','about','contact']) assert.ok(html.includes(`id="${id}"`));
 assert.ok(html.includes('Mihai Munteanu'));
 assert.ok(html.includes('47 rue Vivienne'));
 assert.ok(html.includes('Concept studies'));
 assert.ok(!/href="#"|<form|<img/i.test(html));
 assert.ok(!/testimonial|years of experience|portrait/i.test(html));
});
test('contact uses the exact supplied mailbox with icons, without copy actions or GitHub', () => {
 const html = renderPage(profile);
 assert.equal(profile.contactEmail, 'mihai.muntenau@inbox.eu');
 assert.ok(html.includes('mailto:mihai.muntenau%40inbox.eu'));
 assert.ok(html.includes('mihai.muntenau@inbox.eu'));
 assert.ok(html.includes('contact-address'));
 assert.ok(html.includes('contact-email-link'));
 assert.ok(!/data-copy|Copy address|Copy email|github\.com/.test(html));
 assert.ok(html.includes('href="/privacy/"'));
 assert.ok(html.includes('href="/terms-of-service/"'));
});
test('contact escapes values and does not invent an email when missing', () => {
 const html = renderPage({...profile, name:'Mihai <test>',contactEmail:'test@example.org'});
 assert.ok(html.includes('Mihai &lt;test&gt;'));
 assert.ok(html.includes('mailto:test%40example.org'));
 assert.ok(!html.includes('Copy email'));
 assert.ok(!renderPage({...profile,contactEmail:null}).includes('mailto:'));
});
test('privacy and terms have actual static routes rather than placeholder links', () => {
 assert.ok(existsSync(new URL('../src/pages/privacy.astro', import.meta.url)), 'privacy route is missing');
 assert.ok(existsSync(new URL('../src/pages/terms-of-service.astro', import.meta.url)), 'terms route is missing');
});
