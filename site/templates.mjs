// Templates — plain functions returning HTML strings. No client JS anywhere.
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const ORNAMENT = `<div class="ornament" aria-hidden="true"><svg viewBox="0 0 120 12" fill="none"><path d="M0 6h44M76 6h44" stroke="var(--gold)" stroke-width="1"/><rect x="55" y="1" width="10" height="10" transform="rotate(45 60 6)" stroke="var(--gold)" stroke-width="1.2"/><circle cx="48" cy="6" r="1.4" fill="var(--gold)"/><circle cx="72" cy="6" r="1.4" fill="var(--gold)"/></svg></div>`;

const NAV = [
  ["/", "Home"], ["/visit/", "Visit"], ["/about/", "About"], ["/programs/", "Programs"],
  ["/events/", "Events"], ["/little-stewards/", "Little Stewards"], ["/new-to-islam/", "New to Islam"],
];

export const chip = (ctx, e, label = "Draft — pending approval") =>
  ctx.draft(e) ? `<span class="draft-chip" title="Renders on staging only until approved">${label}</span>` : "";

export function shell({ ctx, title, content, path }) {
  const depth = path.split("/").length - 1;
  const base = depth === 0 ? "." : Array(depth).fill("..").join("/");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="stylesheet" href="${base}/theme.css">
</head>
<body>
${ctx.staging ? `<div class="staging-ribbon">Staging preview — unapproved draft content. Not the public site.</div>` : ""}
<header class="site-header">
  <a class="brand" href="/">
    <svg class="brand-mark" aria-hidden="true" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18.5" stroke="var(--ink)" stroke-width="1.6"/><circle cx="20" cy="20" r="15.5" stroke="var(--gold)" stroke-width="1"/><rect x="9.6" y="9.6" width="20.8" height="20.8" stroke="var(--gold)" stroke-width="1.6"/><rect x="9.6" y="9.6" width="20.8" height="20.8" stroke="var(--gold)" stroke-width="1.6" transform="rotate(45 20 20)"/></svg>
    <span class="brand-text"><strong>Ibrahim</strong> Islamic Center</span>
  </a>
  <details class="nav-toggle">
    <summary aria-label="Menu">Menu</summary>
    <nav>${NAV.map(([h, l]) => `<a href="${h}">${l}</a>`).join("")}</nav>
  </details>
  <nav class="nav-inline">${NAV.map(([h, l]) => `<a href="${h}">${l}</a>`).join("")}</nav>
  <div class="header-cta">
    <a class="btn btn-ghost" href="/get-connected/">Get Connected</a>
    <a class="btn btn-primary" href="/donate/">Donate</a>
  </div>
</header>
<main>${content}</main>
<footer class="site-footer">
  <div class="foot-grid">
    <div>
      <p class="foot-brand"><strong>Ibrahim</strong> Islamic Center</p>
      <p>618 Baca Street<br>Houston, Texas 77013</p>
      <p><a href="https://maps.app.goo.gl/fRu73iZz8FbvHkry9">Directions</a></p>
    </div>
    <div>
      <p class="foot-head">Visit</p>
      <p>Jumu'ah — Fridays, 1:30 PM<br>Coffee shop — Fridays, 12:30–3:00 PM</p>
    </div>
    <div>
      <p class="foot-head">Connect</p>
      <p><a href="/get-connected/">Get connected</a><br><a href="/new-to-islam/">New to Islam</a><br><a href="/donate/">Support the center</a></p>
    </div>
  </div>
  <p class="foot-legal">© ${new Date().getFullYear()} Ibrahim Islamic Center</p>
</footer>
</body>
</html>`;
}

export function home({ ctx, identity, cardPrograms, upcoming, littleStewards, donate }) {
  const msg = identity.messaging, mission = identity.mission;
  return `
<section class="hero">${chip(ctx, msg)}
  <div class="hero-inner">
    <p class="kicker">Houston, Texas</p>
    <h1>A Home for Faith, Learning, and&nbsp;Community</h1>
    <p class="lede">Rooted in traditional Islam, iman, and ihsan — faithful practice, sincere belief, and spiritual excellence — Ibrahim Islamic Center is a welcoming Houston community where individuals and families worship, learn, serve, and grow closer to God through sacred companionship, love, and service.</p>
    <div class="cta-row">
      <a class="btn btn-primary btn-lg" href="/donate/">Donate Now</a>
      <a class="btn btn-ghost btn-lg" href="/get-connected/">Get Connected</a>
    </div>
    <p class="hero-note">New here? <a href="/visit/">Plan your first visit</a> — no prior knowledge or experience needed.</p>
  </div>
</section>

<section class="band band-cream">
  <div class="band-inner narrow">${chip(ctx, mission)}
    <h2>Welcome to Ibrahim Islamic Center</h2>
    <p>Founded by converts who sought not simply a place to pray, but a community in which Islam could be learned, lived, and loved, Ibrahim Islamic Center grew from a small gathering rooted in faith, friendship, and sacred companionship.</p>
    <p>Today, IIC serves Houston as a home for sacred learning, family life, worship, and service — carrying the wisdom of traditional Islam into contemporary American life and nurturing a community where faith matures into character, belonging, and care for one another.</p>
    <p><a class="text-link" href="/about/">Discover our story →</a></p>
  </div>
</section>

<section class="band">
  <div class="band-inner">
    <h2 class="center">Find Your Place at Ibrahim Center</h2>${ORNAMENT}
    <div class="card-grid">
      ${cardPrograms.map(p => `
      <a class="card" href="/programs/${p.slug}/"${ctx.accentStyle(p)}>${chip(ctx, p)}
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.card)}</p>
        <span class="card-more">Learn more →</span>
      </a>`).join("")}
    </div>
  </div>
</section>

<section class="band band-green">
  <div class="band-inner narrow center">
    <h2>Upcoming at Ibrahim Center</h2>${ORNAMENT}
    ${upcoming.length ? `<div class="event-list">${upcoming.map(e => `
      <a class="event-row" href="/events/">
        <span class="event-date">${esc(e.facts.date)}</span>
        <span class="event-title">${esc(e.title)}</span>
      </a>`).join("")}</div>`
      : `<p class="muted-inverse">Our next gatherings are being scheduled — join us for Jumu'ah every Friday at 1:30 PM, and check back soon.</p>`}
    <p><a class="btn btn-light" href="/events/">View All Events</a></p>
  </div>
</section>

${littleStewards ? `
<section class="band">
  <div class="band-inner split">
    <div>${chip(ctx, littleStewards)}
      <p class="kicker">Little Stewards</p>
      <h2>Nurturing the Next Generation</h2>
      <p>${esc(littleStewards.card)}</p>
      <div class="cta-row">
        <a class="btn btn-primary" href="/little-stewards/">Learn More</a>
      </div>
    </div>
    <div class="arch-panel arch-panel-warm" aria-hidden="true"></div>
  </div>
</section>` : ""}

${donate ? `
<section class="band band-cream">
  <div class="band-inner narrow center">${chip(ctx, donate)}
    <h2>Help Sustain a Home for Faith and Community</h2>${ORNAMENT}
    <p>${esc(donate.card)} Every gift helps us create a lasting home where individuals and families can grow in faith, companionship, and service.</p>
    <p><a class="btn btn-primary btn-lg" href="/donate/">Donate Now</a></p>
  </div>
</section>` : ""}

<section class="band band-tight">
  <div class="band-inner narrow center">
    <h2>Stay Connected</h2>
    <p>Receive updates about classes, gatherings, children's programs, and community events. Whether you are new to Ibrahim Center or already part of the community, we would be honored to stay connected with you.</p>
    <p><a class="btn btn-ghost" href="/get-connected/">Get Connected</a></p>
  </div>
</section>`;
}

export function visit({ ctx, campus, jumuah }) {
  if (!campus) return placeholder("Visit");
  return `
<section class="page-head"><div class="band-inner"><p class="kicker">Visit</p><h1>You Are Welcome Here</h1></div></section>
<section class="band band-tight"><div class="band-inner narrow">${chip(ctx, campus)}
  <p class="lede">${esc(campus.card)}</p>
  <div class="fact-strip">
    <div><span class="fact-label">Address</span><span>618 Baca Street, Houston, TX 77013</span></div>
    <div><span class="fact-label">Jumu'ah</span><span>Fridays, 1:30 PM</span></div>
    <div><span class="fact-label">Directions</span><a href="${esc(campus.links?.map ?? "#")}">Open in Google Maps</a></div>
  </div>
  <article class="prose">${ctx.md(campus.body.replace(/^# .*$/m, ""))}</article>
  ${jumuah ? `<p><a class="text-link" href="/programs/jumuah/">About Friday Prayer & Community →</a></p>` : ""}
</div></section>`;
}

export function about({ ctx, mission, story, people, values }) {
  return `
<section class="page-head"><div class="band-inner"><p class="kicker">About</p><h1>Rooted in Traditional Islam</h1></div></section>
${mission ? `<section class="band band-tight"><div class="band-inner narrow">${chip(ctx, mission)}
  <article class="prose">${ctx.md(mission.body.replace(/^# Mission$/m, "").replace(/## Vision[\s\S]*$/m, ""))}</article>
</div></section>` : ""}
${story ? `<section class="band band-cream"><div class="band-inner narrow">${chip(ctx, story)}
  <h2>Our Story</h2><p class="lede">${esc(story.card)}</p>
</div></section>` : ""}
<section class="band"><div class="band-inner">
  <h2 class="center">Leadership & Team</h2>${ORNAMENT}
  <div class="people-grid">
    ${people.map(p => `
    <div class="person">${chip(ctx, p)}
      <div class="person-photo" aria-hidden="true"><span>${esc(p.title.split(" ").map(w => w[0]).slice(0, 2).join(""))}</span></div>
      <h3>${esc(p.title)}</h3>
      <p class="person-role">${esc(p.facts?.roles?.[0]?.title ?? "")}</p>
      <p class="person-bio">${esc(p.card ?? "")}</p>
    </div>`).join("")}
  </div>
</div></section>`;
}

export function programsIndex({ ctx, programs }) {
  return `
<section class="page-head"><div class="band-inner"><p class="kicker">Programs</p><h1>Worship, Learning, Companionship, Service</h1></div></section>
<section class="band"><div class="band-inner">
  <div class="card-grid">
    ${programs.map(p => `
    <a class="card" href="/programs/${p.slug}/"${ctx.accentStyle(p)}>${chip(ctx, p)}
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.card ?? "Details coming soon.")}</p>
      ${p.facts?.schedule ? `<p class="card-fact">${esc(p.facts.schedule)}</p>` : ""}
      <span class="card-more">Learn more →</span>
    </a>`).join("")}
  </div>
</div></section>`;
}

export function program({ ctx, p, hero = false }) {
  if (!p) return placeholder("This program");
  const f = p.facts ?? {};
  const acc = ctx.accentStyle(p);
  const factRows = [["Schedule", f.schedule], ["Audience", f.audience], ["Registration", typeof f.registration === "string" ? f.registration : null]]
    .filter(([, v]) => v);
  return `
<section class="page-head accented"${acc}><div class="band-inner"><p class="kicker">${hero ? "Children & Families" : "Programs"}</p><h1>${esc(p.title)}</h1></div></section>
<section class="band band-tight"${acc}><div class="band-inner narrow">${chip(ctx, p)}
  ${factRows.length ? `<div class="fact-strip">${factRows.map(([k, v]) => `<div><span class="fact-label">${k}</span><span>${esc(v)}</span></div>`).join("")}</div>` : ""}
  <article class="prose">${ctx.md(p.body.replace(/^# .*$/m, ""))}</article>
  ${p.links?.registration ? `<p><a class="btn btn-primary" href="${esc(p.links.registration)}">Register</a></p>` : ""}
</div></section>`;
}

export function events({ ctx, upcoming, past }) {
  return `
<section class="page-head"><div class="band-inner"><p class="kicker">Events</p><h1>Gather With Us</h1></div></section>
<section class="band band-tight"><div class="band-inner narrow">
  ${upcoming.length ? `<div class="event-list">${upcoming.map(e => `
    <div class="event-row"><span class="event-date">${esc(e.facts.date)}</span>
      <span class="event-title">${esc(e.title)}</span><span>${esc(e.card ?? "")}</span></div>`).join("")}</div>`
    : `<p class="lede">Our next gatherings are being scheduled. In the meantime, you are always welcome at <a href="/programs/jumuah/">Jumu'ah — Fridays at 1:30 PM</a> — and the <a href="/programs/coffee-shop/">coffee shop</a> before and after.</p>
       <p>Follow our social channels or <a href="/get-connected/">get connected</a> to hear about events first.</p>`}
  ${past.length ? `<h2>Past events</h2><div class="event-list">${past.map(e => `
    <div class="event-row past"><span class="event-date">${esc(e.facts.date)}</span><span class="event-title">${esc(e.title)}</span></div>`).join("")}</div>` : ""}
</div></section>`;
}

export function newToIslam({ ctx, e }) {
  return `
<section class="page-head"><div class="band-inner"><p class="kicker">New to Islam</p><h1>Questions Are Welcome Here</h1></div></section>
<section class="band band-tight"><div class="band-inner narrow">${e ? chip(ctx, e) : ""}
  <p class="lede">Whether you are exploring Islam, have recently embraced it, or love someone who has — you are welcome at Ibrahim Center. No prior knowledge is assumed, and no question is too small.</p>
  <p>Ibrahim Center was founded by converts. Walking with people at the beginning of their journey is not a side program here — it is part of who we are.</p>
  <div class="support-grid">
    ${["An introductory conversation", "Support taking the shahada", "Foundations classes", "Mentorship & companionship", "A warm introduction to the community", "Spiritual care"].map(s => `<div class="support-item">${s}</div>`).join("")}
  </div>
  <p>The simplest first step: <a class="text-link" href="/get-connected/">reach out</a>, or simply come visit on a Friday — <a class="text-link" href="/visit/">here's what to expect</a>.</p>
</div></section>`;
}

export function getConnected({ ctx, routing }) {
  return `
<section class="page-head"><div class="band-inner"><p class="kicker">Get Connected</p><h1>We Would Be Honored to Know You</h1></div></section>
<section class="band band-tight"><div class="band-inner narrow">${routing ? chip(ctx, routing) : ""}
  <p class="lede">You do not need to know exactly what you need before reaching out. Tell us a little about yourself and we will make sure the right person gets back to you.</p>
  <p class="contact-cta">Write to us: <a class="text-link" href="mailto:connect@ibrahimcenter.org">connect@ibrahimcenter.org</a></p>
  <p class="muted">Visiting · Learning about Islam · New Muslim · Classes · Children's programs · Sisters · Brothers · Volunteering · Meeting the Shaykh — whatever brings you, start with a hello.</p>
</div></section>`;
}

export function donate({ ctx, donate, zakat }) {
  return `
<section class="page-head"><div class="band-inner"><p class="kicker">Donate</p><h1>Build a Home for Faith, Learning, and&nbsp;Service</h1></div></section>
<section class="band band-tight"><div class="band-inner narrow">${donate ? chip(ctx, donate) : ""}
  <p class="lede">Ibrahim Center depends on the generosity of people who believe in the transformative power of sacred learning, companionship, and service. Your support helps sustain scholars and teachers, children's programs, spiritual care, community gatherings, and a welcoming campus for generations to come.</p>
  ${donate?.links?.stripe
    ? `<p><a class="btn btn-primary btn-lg" href="${esc(donate.links.stripe)}">Donate Now</a></p>`
    : `<p class="pending-note">Online giving is being finalized — to give today, please reach out at <a href="mailto:connect@ibrahimcenter.org">connect@ibrahimcenter.org</a>.</p>`}
</div></section>
${zakat ? `
<section class="band band-cream"><div class="band-inner narrow">${chip(ctx, zakat)}
  <h2>Zakat</h2>
  <p>${esc(zakat.card)}</p>
  <p>Our Zakat Committee meets twice each month — on the 1st and the 15th — to review submitted requests.</p>
  <p><a class="text-link" href="/get-connected/">Ask about zakat — giving or receiving →</a></p>
</div></section>` : ""}`;
}

export const redirect = to => `<meta http-equiv="refresh" content="0; url=${to}"><link rel="canonical" href="${to}">`;

const placeholder = what => `
<section class="band"><div class="band-inner narrow center">
  <h1>${what} — coming soon</h1>
  <p>This page is being prepared. In the meantime, <a href="/get-connected/">get in touch</a> — we would love to hear from you.</p>
</div></section>`;
