# Decision Log

> Append-only. Each entry: what was decided, why, and what it forecloses. This file is the board's memory against decision amnesia.

**D1 — 2026-07-22 — One institutional brain, org-wide.** This repo is the canonical memory of the institution, pace-layered; the website is projection #1. Not a website-content folder. Forecloses: per-program repos, page-oriented content.

**D2 — 2026-07-22 — Entities once, pages as projections.** One file per entity; structured facts in frontmatter, prose in body; permanent slugs; approval state as data. Why: the workbook duplicated Jumu'ah and Menaissance copy verbatim — copy-paste drift is structural, not accidental. Forecloses: pasting copy into two places, ever.

**D3 — 2026-07-22 — The only interface is the AI consultant.** No CMS, no editor logins, no drag-and-drop — explicitly declined by Dan ("we don't want this"). Humans express intent in language and approve previews; the AI commits. Why: hands-on control was tried (WordPress) and produced rot + a truth-recovery workbook; conversation + approval is the control they actually want. Forecloses: Squarespace/WordPress/Keystatic and the entire editor-UI category.

**D4 — 2026-07-22 — Static emission; zero run-time dependencies.** Public site = static HTML/CSS from our own small build, served from the edge. No server, database, or client framework in the request path. Forecloses: anything that can be down at 2am.

**D5 — 2026-07-22 — Stripe direct; Zeffy retired before launch.** We own the record and the giving experience; Stripe moves money and holds card data (PCI). Stripe is also the **interim donor system of record** — no throwaway middle database; the future fact-graph ops app backfills from Stripe export. Forecloses: Zeffy; building an interim CRM.

**D6 — 2026-07-22 — Privacy boundary.** Pastoral/personal records (zakat cases, donor PII, convert care, form submissions) never enter this repo. Interim: Stripe + routed email + private server log. Real walls arrive with fact-graph jurisdictions. Forecloses: "just commit the spreadsheet" forever.

**D7 — 2026-07-22 — Old WordPress site retired wholesale; content mined only.** Umrah + "Why" pages have no slot in the new nav — owners decide keep/kill during content burndown. Forecloses: WP migration/coexistence machinery.

**D8 — 2026-07-22 — fact-graph trajectory.** On-prem sovereign box at the masjid; website = street projection (anonymous grant + static emission + receipt); CMS = the consultant loop; tenant-owned Stripe/email membranes. Phases 0–1 FG-free/read-side; ops tenancy waits for the Jacob gate. Design consequence now: FG-shaped conventions (D2) so the lift stays mechanical. Full derivation: `abrahamicintelligence/deals/ibrahim-center/2026-07-22_street-projection-reflection.md`.
