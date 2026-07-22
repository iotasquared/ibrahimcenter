#!/usr/bin/env node
// Ibrahim Center static build — reads brain/, emits site/dist/.
// Modes: default = production (approved entities only); --staging includes drafts, watermarked.
// Law (CLAUDE.md): zero run-time dependencies — output is plain HTML/CSS.

import { readFileSync, readdirSync, mkdirSync, writeFileSync, cpSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import * as yaml from "js-yaml";
import * as T from "./templates.mjs";

const SITE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SITE, "..");
const BRAIN = join(ROOT, "brain");
const DIST = join(SITE, "dist");
const STAGING = process.argv.includes("--staging");

// ---------- load entities ----------
function loadEntity(path) {
  const raw = readFileSync(path, "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  const meta = yaml.load(m[1]) ?? {};
  if (!meta.slug) return null;
  return { ...meta, body: m[2].trim(), path };
}

function loadDir(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".md") || f.startsWith("_")) continue;
    const e = loadEntity(join(dir, f));
    if (e) out.push(e);
  }
  return out;
}

const brain = {
  identity: Object.fromEntries(loadDir(join(BRAIN, "identity")).map(e => [e.slug, e])),
  place: Object.fromEntries(loadDir(join(BRAIN, "place")).map(e => [e.slug, e])),
  people: loadDir(join(BRAIN, "people")),
  programs: loadDir(join(BRAIN, "programs")),
  giving: Object.fromEntries(loadDir(join(BRAIN, "giving")).map(e => [e.slug, e])),
  governance: Object.fromEntries(loadDir(join(BRAIN, "governance")).map(e => [e.slug, e])),
  audiences: Object.fromEntries(loadDir(join(BRAIN, "audiences")).map(e => [e.slug, e])),
  history: Object.fromEntries(loadDir(join(BRAIN, "history")).map(e => [e.slug, e])),
  events: [],
};
// events live in brain/events/YYYY/, append-only
const evRoot = join(BRAIN, "events");
if (existsSync(evRoot)) {
  for (const y of readdirSync(evRoot)) {
    if (/^\d{4}$/.test(y)) brain.events.push(...loadDir(join(evRoot, y)));
  }
}

// ---------- approval law ----------
const approved = e => e && e.status === "approved";
const visible = e => e && (approved(e) || STAGING);
const draft = e => visible(e) && !approved(e);

// prod: entities that aren't approved simply do not exist.
function gate(e) { return visible(e) ? e : null; }

// ---------- render helpers ----------
const md = s => marked.parse(s ?? "", { mangle: false, headerIds: false });
export const ctx = {
  staging: STAGING,
  md,
  draft,
  today: new Date().toISOString().slice(0, 10),
};

// ---------- program ordering for cards ----------
const cardOrder = ["jumuah", "little-stewards", "dawam-seminary", "menaissance", "sisters-caravan", "coffee-shop"];
const programsBySlug = Object.fromEntries(brain.programs.map(p => [p.slug, p]));
const cardPrograms = cardOrder.map(s => gate(programsBySlug[s])).filter(Boolean).filter(p => p.card);

const upcoming = brain.events.filter(visible)
  .filter(e => e.facts?.date && e.facts.date >= ctx.today)
  .sort((a, b) => a.facts.date.localeCompare(b.facts.date)).slice(0, 3);
const pastEvents = brain.events.filter(visible)
  .filter(e => e.facts?.date && e.facts.date < ctx.today)
  .sort((a, b) => b.facts.date.localeCompare(a.facts.date));

// ---------- pages ----------
const pages = [];
const page = (path, title, html, opts = {}) => pages.push({ path, title, html, ...opts });

page("index.html", "Ibrahim Islamic Center — A Home for Faith, Learning, and Community",
  T.home({ ctx, identity: brain.identity, cardPrograms, upcoming, littleStewards: gate(programsBySlug["little-stewards"]), donate: gate(brain.giving.donate) }));

page("visit/index.html", "Visit — Ibrahim Islamic Center",
  T.visit({ ctx, campus: gate(brain.place.campus), jumuah: gate(programsBySlug["jumuah"]) }));

page("about/index.html", "About — Ibrahim Islamic Center",
  T.about({ ctx, mission: gate(brain.identity.mission), story: gate(brain.history.story), people: brain.people.filter(visible), values: gate(brain.identity.values) }));

page("programs/index.html", "Programs — Ibrahim Islamic Center",
  T.programsIndex({ ctx, programs: brain.programs.filter(visible).filter(p => p.lifecycle === "active") }));

for (const p of brain.programs.filter(visible)) {
  page(`programs/${p.slug}/index.html`, `${p.title} — Ibrahim Islamic Center`, T.program({ ctx, p }));
}

page("events/index.html", "Events — Ibrahim Islamic Center",
  T.events({ ctx, upcoming, past: pastEvents }));

page("little-stewards/index.html", "Little Stewards — Ibrahim Islamic Center",
  T.program({ ctx, p: gate(programsBySlug["little-stewards"]), hero: true }));

page("new-to-islam/index.html", "New to Islam — Ibrahim Islamic Center",
  T.newToIslam({ ctx, e: gate(brain.audiences["new-to-islam"]) }));

page("get-connected/index.html", "Get Connected — Ibrahim Islamic Center",
  T.getConnected({ ctx, routing: gate(brain.governance["form-routing"]) }));

page("donate/index.html", "Donate — Ibrahim Islamic Center",
  T.donate({ ctx, donate: gate(brain.giving.donate), zakat: gate(brain.giving.zakat) }));

// ---------- redirects ----------
const redirects = readFileSync(join(BRAIN, "REDIRECTS.md"), "utf8")
  .split("\n").map(l => l.match(/^\|\s*([\w-]+)\s*\|\s*([\w-]+)\s*\|/)).filter(Boolean)
  .filter(m => m[1] !== "old slug" && m[1] !== "---" && m[1] !== "—");
for (const [, from, to] of redirects) {
  page(`programs/${from}/index.html`, "Redirect", T.redirect(`/programs/${to}/`));
}

// ---------- emit ----------
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(SITE, "theme.css"), join(DIST, "theme.css"));
for (const p of pages) {
  const out = join(DIST, p.path);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, T.shell({ ctx, title: p.title, content: p.html, path: p.path }));
}
console.log(`${STAGING ? "STAGING" : "PRODUCTION"} build: ${pages.length} pages → site/dist/`);
if (!STAGING) {
  const drafts = [...brain.programs, ...brain.people, ...Object.values(brain.identity)].filter(e => e && e.status !== "approved").length;
  console.log(`note: ${drafts} draft entities excluded by the approval law.`);
}
