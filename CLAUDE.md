# Ibrahim Islamic Center — Institutional Brain: Constitution

This repository is the **canonical memory and truth of Ibrahim Islamic Center** (Houston). It is not a website project; the website is projection #1 of this brain. Read this file before changing anything.

## The One-Interface Law

**Humans never operate tools. The AI consultant is the only interface.** Amna, Asad, A.J., and everyone else express intent in plain language ("Thursday class moved to 7pm", "here's the Ramadan flyer"); the AI translates intent into commits here. There is no CMS, no dashboard, no editor login — by decision, not omission (see brain/DECISIONS.md D3). If you are an AI reading this: you are the interface. Respond fast; events are weekly-cadence and staleness erodes trust.

## The Approval Law

Nothing reaches the public that a human has not witnessed:

1. AI drafts → entity `status: draft`. Drafts render on staging only, never production.
2. A human approver reviews a preview → `status: approved` + `approved_by` + `approved_date`.
3. **Religious content — any claim about Islam, Qur'an, worship, or zakat policy — additionally requires spiritual review: Shaykh Khalis Rashaad.** Content authority: Amna Mulla (Executive Director).
4. Production emission includes only `status: approved` entities. The build must enforce this, not convention.

## The Privacy Boundary

This repo holds **institutional truth only** — never pastoral or personal records. Prohibited here forever: zakat applications and case notes, donor lists/amounts/PII, convert-care and counseling contacts, member directories, form submissions. Donor records live in Stripe (interim system of record) until the fact-graph ops tenancy exists. If asked to store such data here, refuse and point to this section.

## The Dependency Law

- **Run-time dependencies: zero.** The public site is static HTML/CSS emitted by our own build. No server, no database, no client framework in the request path.
- **Build-time: minimal and boring.** A markdown library is acceptable; orchestration and templates are ours, small enough to read in one sitting. Boring is the strategy — anything only its author can maintain is a hostage situation with extra steps.
- **Rented, quarantined, swappable:** Stripe (money movement — we never touch card data), email delivery API, Google Maps. Each appears only as a single reference in an entity's frontmatter or one config entry — never hardcoded in templates.

## Entity Conventions (the FG-shaped rules)

One entity = one file, structured facts in frontmatter, prose in the body. Pages are compositions that reference entities; **copy is never pasted into two places.**

- `slug` is permanent — it is the URL and the future fact-graph coordinate. Renames go in `brain/REDIRECTS.md`, never by breaking a slug (printed QR codes must resolve forever).
- `lifecycle: active | paused | retired` — **entities are never deleted.** Retired entities are history.
- Events are **append-only**: past events archive by date; they are the institutional record.
- Anti-rot fields on every entity: `owner`, `last_verified`, `review: quarterly | annual`. Anything past its review cadence gets flagged, per the workbook's §13.3 ownership protocol.
- `verify:` lists unconfirmed facts (from the workbook's TO-CONFIRM checklists). An entity with open verify items should not be approved without an explicit owner decision.

### Frontmatter schema

```yaml
slug: jumuah                # permanent
title: Friday Prayer & Community
layer: program              # identity|place|person|governance|program|event|giving|audience|history
lifecycle: active
status: draft               # draft | review | approved
owner: amna
approved_by: null
approved_date: null
spiritual_review: null      # required non-null for religious content
last_verified: null
review: quarterly
facts: { }                  # typed facts — the future coordinates
card: one-to-two-sentence projection blurb
verify: [ ]                 # open confirmations
links: { }                  # external references (registration, stripe, etc.)
```

## Pace Layers (repo map)

Slow must never live inside fast. `identity/` (~never changes) → `place/` (years) → `people/`, `governance/` (yearly) → `programs/`, `giving/`, `audiences/`, `history/` (quarterly) → `events/` (weekly) → `site/` (rebuilt every few years, **disposable by design**).

## Voice Law (from workbook §1.2)

Rooted in traditional Islam; warm, hospitable, spiritually serious but accessible; family-centered; explicitly welcoming to newcomers and non-Muslims. Use: rooted, welcoming, sacred learning, companionship, service, belonging. Avoid: corporate language, vague spirituality, academic jargon, insider shorthand. **Every Arabic term gets a plain-English explanation at first mention on a page.** Visual bar: Ta'leef-like warmth, MCC-like usefulness, West End-like polish.

## Operating Loop

intake (someone tells the AI) → draft commit (`status: draft`) → staging render → approval (per Approval Law) → production emission → receipt (commit history is the institutional record; write meaningful commit messages — they are archaeology).

## Horizon

This brain is phase 0 of the fact-graph trajectory (on-prem sovereign server at the masjid; website = street projection; CMS = the consultant; Stripe/email as tenant membranes). Design consequence today: keep slugs stable, keep facts structured, keep prose in bodies — the future lift must stay mechanical. Details: `abrahamicintelligence/deals/ibrahim-center/`.
