# ComfortLine.by — Cloudflare migration feasibility and permission audit
**Date:** 2026-11-04  
**This is an assessment only. Nothing was deployed or switched.**  
**Authoritative project named by owner:** `rakuci/1comfortline`, distinct from `rakuci/bycomfortline`.

## Verdict

**Technically feasible:** React/Vite UI and statically prerendered HTML can be served by Cloudflare Workers Static Assets; Express API routes can either be adapted or rewritten as Workers endpoints. Resend works with Workers. External inbox hosting can be retained while DNS is managed by Cloudflare. Avoid changing the live host until staging passes.

**Permissions audit:**
- GitHub repo metadata reports `admin=true`, `push=true`; non-production branch creation on `rakuci/1comfortline` succeeded on November 4.
- No direct Cloudflare API/zone/Workers/DNS connector is exposed in this chat; no ability to inspect/modify DNS, zones or Cloudflare secrets from here.
- No Replit production connector is presently connected and no direct Resend/Yandex provider account access is present.
- Cloudflare CI deployment is possible after configuring account ID + scoped Cloudflare token in this repository's GitHub Actions secrets, but those credentials are per repository and cannot be assumed to be present because `rakuci/bycomfortline` has them.
- Cloudflare dashboard previously showed a `comfortline.by` zone and `bycomfortline` Worker; their **current active status, DNS records, custom domain bindings and secret values remain unverified**.

## Repository inventory

| Component | Source path | Migration adaptation |
|---|---|---|
| React/Vite/Tailwind site | `artifacts/comfortline-website` | Cloudflare Vite / Worker static assets |
| Build-time prerendered routes + SEO HTML | `scripts/prerender.mjs`, `route-manifest.mjs` | Preserve generated HTML and language URLs |
| Custom Node HTTP static server, canonical redirects, 404s | `server.mjs` | Implement matching Worker routing/redirect behavior; Node listener not reused |
| Express API | `artifacts/api-server/src` | Worker handlers or compatibility-tested Express |
| `POST /api/booking` | `routes/booking.ts` | Validate, rate-limit, send via Resend |
| `POST /api/contact` | `routes/contact.ts` | Validate, rate-limit, send via Resend |
| `GET /api/instagram/posts` | `routes/instagram.ts` | Store `INSTAGRAM_ACCESS_TOKEN` as Worker secret, test Graph endpoint + cache |
| `GET /api/border-queue` | `routes/border-queue.ts` | Verify Jina reader dependency and cache/cooldown semantics |
| `GET /api/health` | `routes/health.ts` | Add Worker health endpoint |
| SEO/crawlers | `public/sitemap.xml`, `robots.txt`, `scripts/generate-blog-sitemap.mjs` | Reproduce 200/301/404/410, canonical, hreflang, XML/IndexNow behavior |
| Replit runtime vars | `vite.config.ts` | Remove mandatory `PORT` and `BASE_PATH` requirement from Cloudflare build / set defaults |

### Dependencies and observed risks
- GitHub `main` latest commit: **2026-10-22 11:38 UTC** (`1b6e655f0e69`). Compare against current Replit deployed source before making GitHub the deployment authority. Replit edits after this date may be absent.
- Existing Node `server.mjs` distinguishes legitimate routes from soft 404s and handles legacy redirects/trailing-slash normalization. A naive SPA fallback would reintroduce SEO errors. Preserve routing.
- Resend key is read from `process.env.RESEND_API_KEY`; sender `ComfortLine <noreply@comfortline.by>`, recipient `info@comfortline.by`. Validate the Resend domain verification, SDK errors and mail acceptance in new Worker.
- Current API `resend.emails.send()` result is awaited without checking an API error return; it can report HTTP success even when email was rejected. Correct before production.
- Booking/contact code incorporates visitor text directly in HTML without server-side escaping/schemas or rate limiting. Fix injection and spam exposure before cutover. Do not log visitors' contact details.
- Instagram API uses `INSTAGRAM_ACCESS_TOKEN`, 6-hour module-global cache; reuse as secret and validate expired token handling. Prefer Workers Cache/KV when necessary.
- Border queue uses `https://r.jina.ai/https://mon.declarant.by/%23/zone`, 5-minute module-global cache; test subrequests, timeouts, and stale fallback. Workers instances do not share global memory.
- Initial source tree contains **578 tracked files**; `public/` has **150 assets totaling ~138.4 MB**, with largest individual file ~3.75 MB (below Cloudflare 25 MiB per-asset limit); generated `dist/public` still must be measured.
- Website forms `POST /api/booking` and `POST /api/contact` on the same origin; no Replit API URL rewrite should be required if same-origin Worker routes retained.
- Existing production site lists `+375 (44) 762-06-49`; `bycomfortline.com` has a different public contact number. Confirm whether distinct operators/brands before any cross-domain redirects, crosslinks, or NAP consolidation. Do not redirect `comfortline.by` to `bycomfortline.com` as part of this migration.
- The current site exposes two public languages RU/EN; keep existing routes, blog slugs, canonical URLs and navigation behavior. Do not silently replace it with the separate seven-language `bycomfortline.com` implementation.

## DNS and email safety

Preserve existing `comfortline.by` registration and current mail provider unless the owner separately requests migration.

- Export and snapshot the complete live Cloudflare DNS zone first: A/AAAA/CNAME, MX, SPF TXT, all DKIM selectors, DMARC, verification TXT, CAA, DNSSEC and any subdomain records. **Not yet inspected directly.**
- If `info@comfortline.by` inbox is hosted at Yandex, preserve its MX records and mailbox unchanged; Cloudflare DNS does not require moving mail to Cloudflare.
- Preserve Resend SPF/DKIM/return-path setup where applicable. Do not turn on Cloudflare Email Routing, which can replace/conflict with Yandex MX.
- Cloudflare cannot be assumed to manage registrar renewal for a `.by` registration; registrar responsibility is separate from CDN/DNS/Workers.
- Confirm the actual domain and WWW host TLS certificates / zone and Cloudflare Workers custom domain binding only after staging is healthy.

## Safe migration runbook (no domain cutover until complete)

1. **Freeze / sync source:** Compare Replit latest deployment to GitHub `main`; commit missing changes or confirm owner accepts repo baseline; tag production baseline.
2. **Cloudflare adaptation in a feature branch:** Add compatible Wrangler config and Vite build; static assets; safe Worker for `/api/*`; route list, 301 legacy redirects and true 404s. Choose a distinct Worker name, e.g. `comfortline-main`, not `bycomfortline`.
3. **Build and tests:** `pnpm install --frozen-lockfile`, type-check, pre-render, asset size and route tests, API integration tests. Run actual Workers runtime tests and validate mail handling without real production submissions.
4. **Staging deployment:** Deploy to an isolated `workers.dev` address. Validate RU/EN home, blog, 10 representative routes, canonical/robots/sitemap, real 404 status, forms, Instagram and border queue, mobile.
5. **Secrets:** Configure `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` as GitHub Actions secrets. Configure `RESEND_API_KEY`, `INSTAGRAM_ACCESS_TOKEN` securely as Worker secrets. Cloudflare API keys are not to be pasted into chat or committed.
6. **Email verification:** Test a booking and contact message end-to-end to `info@comfortline.by`, verify Resend accepted ID, inbox arrival, SPF/DKIM/DMARC, Yandex delivery and error handling.
7. **Preflight DNS:** Export current zone, check nameservers and DNSSEC, verify routing and certificate. Preserve all mail records. Separate `comfortline.by` Worker from `bycomfortline.com` Worker.
8. **Cutover only after owner approval:** Bind `comfortline.by`/WWW to new Worker, set required redirects, confirm DNS & SSL. Avoid changing nameservers unnecessarily if zone already active at Cloudflare.
9. **Rollback:** Keep Replit deployment and old DNS values for a defined rollback window. Monitor homepage, bookings, Search Console/Yandex Webmaster and email delivery. Disable Replit billing only after verified production stability.

## Blocking unknowns

1. Is currently deployed Replit code fully synced to GitHub? **Unverified (Oct 22 latest commit).**
2. Does `rakuci/1comfortline` have its own Cloudflare deploy token/account ID and Worker secrets? **Cannot inspect GitHub Actions secret values or Cloudflare account with current tools.**
3. Is `comfortline.by` Cloudflare zone active and are NS/DNS records correct? **Not independently verified.**
4. Are Resend sender and Yandex inbox currently working? **Source configured; end-to-end delivery not tested.**
5. Do Instagram token and external border-queue dependency work from Cloudflare? **Not tested.**

## Sources
- Cloudflare Vite + React: https://developers.cloudflare.com/workers/framework-guides/web-apps/react/
- Workers static assets: https://developers.cloudflare.com/workers/static-assets/
- Workers + Express: https://developers.cloudflare.com/workers/tutorials/deploy-an-express-app/
- Resend with Workers: https://developers.cloudflare.com/workers/tutorials/send-emails-with-resend/
- Secrets: https://developers.cloudflare.com/workers/configuration/secrets/
- Workers CI from GitHub: https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
- Cloudflare email troubleshooting: https://developers.cloudflare.com/dns/troubleshooting/email-issues/
