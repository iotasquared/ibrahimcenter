# site/ — the projection (phase 0 build pending)

Disposable by design. A small owned build reads `brain/` and emits static HTML/CSS:

- Only `status: approved` entities reach production; drafts render on staging with a watermark.
- Events include/archive automatically by date; past events remain as archive pages.
- Redirects emitted from `brain/REDIRECTS.md`.
- Rented references (Stripe link, map embed, mail delivery) come only from entity frontmatter/config — never hardcoded in templates.
- Design bar (workbook §1.2): Ta'leef-like warmth and creativity, MCC-like usefulness, West End-like clarity and polish. Mobile-first; headline and buttons visible without scrolling; faces protected from text overlays.
