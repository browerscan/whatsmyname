# AdSense readiness audit — 2026-09-21

Target: https://whatismyname.org; Next.js username lookup, directory and editorial site.
Requested publisher: `ca-pub-7152359349184850`.
Decision: **Website-side remediation completed and current technical blockers cleared for submission.** Account verification, CMP applicability, traffic provenance and final AdSense review outcome remain owner-operated checks. This is not a guarantee of approval.

## Method and evidence

Applied the user-requested [adsense-site-auditor](https://github.com/yantoumu/adsense-site-auditor-skill/blob/main/adsense-site-auditor/SKILL.md) and its [73-item reference](https://github.com/yantoumu/adsense-site-auditor-skill/blob/main/adsense-site-auditor/references/adsense-requirements.md). Reference snapshot: 2026-06-16. These are author-defined checklist IDs, not a Google-issued certification.

Official sources refreshed: [page readiness](https://support.google.com/adsense/answer/7299563?hl=en), [Publisher Policies](https://support.google.com/adsense/answer/10502938?hl=en), [Publisher Restrictions](https://support.google.com/adsense/answer/10437795?hl=en), [head placement](https://support.google.com/adsense/answer/9274516?hl=en), [CMP requirements](https://support.google.com/adsense/answer/13554116?hl=en). Program Policies were successfully refreshed in the follow-up audit; the earlier HTTP 429 no longer blocks policy verification.

Evidence keys:

- **S**: reviewed source routes, layouts, policy text, data and client state in this checkout. Pass is limited to inspected source, not an assertion about account configuration or every possible external search result.
- **T**: remote OpenClaw typecheck, lint, unit/integration checks and production build. Initial suite: 375 passing after translating the pre-existing shortcut string; separate new readiness suite covers sitemap and all nine disclosures.
- **H (historical)**: pre-remediation canonical HTTP GETs during this audit. `/`, `/tools` returned Cloudflare 500; sampled blog returned 500. `/privacy`, `/terms`, `/categories`, `/platforms/discord`, `/robots.txt`, `/ads.txt` returned 200. Earlier ads.txt-only acceptance did not validate application runtime.
- **B (historical)**: corrected packaged Worker preview: 28/28 desktop/mobile checks passed. Both canonical full runs: 27/28; intermittent React #418 first on terms, then tools. Targeted rechecks 6/6 and diagnostic checks 16/16 passed; they do not erase those failures. **Public QA remains partial; root cause is unconfirmed.** [Upstream report #1321](https://github.com/opennextjs/opennextjs-cloudflare/issues/1321) describes similar symptoms but does not establish this site's cause. Raw receipts are in `ops/releases/ads-20260921-readiness/`. Ad scripts and search API results are stubbed during interaction tests; these prove UI behavior, not actual ad fill or upstream provider availability.
- **A**: no authenticated AdSense dashboard, applicant identity, traffic analytics or CMP configuration supplied. Those checks remain Unknown.

- **F (historical follow-up)**: Worker `3e2fbc76-9554-409a-af71-cf1aec3625aa`; 385 tests and 30/30 Worker-preview checks passed. Canonical repeated checks: 59/60, with one `ERR_CONNECTION_CLOSED` before the page rendered; four targeted rechecks passed. No hydration errors were observed after moving shell translations into the locale layout. Historical failures are retained. Real Google lookup returned 200 with one item; platform lookup and provider health still returned 521 at 11:10 UTC. Full evidence: `ops/releases/ads-20260921-shell/public-qa.json`.
- **G (current follow-up)**: Worker `82c49a7e-58ab-4c2c-b589-b8374894c5fc`. A pre-fix production rerun reproduced React #418 on desktop `/` and mobile `/platforms/discord` (58/60). The client provider boundary was narrowed so header, main and footer are not hydrated as one large provider subtree. Full build chain passed; Worker preview browser QA passed 60/60; production browser QA passed 60/60 with zero hydration errors observed. Real provider health returned 200 UP, site platform lookup returned 200 NDJSON with total 1487, and Google lookup returned 200 with one item. Full evidence: `ops/releases/ads-20260921-provider-scope/public-qa.json`.

## Changes

1. Literal async AdSense tag in root head with the exact supplied client and anonymous crossorigin; replaces pending GPT interstitial/anchor initialization.
2. Nine-language Google advertising disclosure and updated policy dates. Existing Google data-use and ad-choice links retained.
3. Streaming, single-result and cache ingestion exclude provider-flagged adult results before shared UI/export/AI state. Removed desktop/mobile adult opt-in. Google search already requests SafeSearch. This is not a guarantee about misclassified third-party results.
4. Only implemented tools are linked from the catalog; removed duplicate Discord metadata and sitemap URL duplication.
5. Public rendering assets are no longer disallowed by wildcard robots rules; API/private paths remain excluded.
6. Existing Ad.Plus seller authorization retained alongside the new DIRECT publisher. Different seller IDs/relationships are not duplicates.
7. Shortcut hint now comes from the existing locale dictionaries, retaining identical server/client text.
8. Fixed blog rendering failure by moving the clipboard event handler into a client component with a manual-copy fallback. Fixed next-themes serialized-script error through `keep_names = false`, following [OpenNext guidance](https://opennext.js.org/cloudflare/howtos/keep_names).
9. Replaced the defective raw-entry release packaging with Wrangler's compiled Worker artifact. New deployed version: `558112c8-9f46-48b2-a41f-4e941f343a6b`. Canonical homepage/tools/blog/privacy returned 200 with the correct head tag; ads.txt matched source; sitemap contained 396 unique URLs. This supersedes the earlier ads.txt-only acceptance.

## Follow-up remediation and current findings

- Nine localized homepage guides now explain the real workflow, limitations, lawful use, data handling and next steps. Removed unsupported percentage tables, invented research-scale claims, instant-registration promises, and the unpublished generator promotion.
- Fixed the actual HTML-to-TypeScript build chain: the generator now updates all nine locale files and the index imported by EducationalContent. Previously editing individual HTML/TS files could leave the live index stale.
- Tools metadata, collection data, headings, footer description and catalog descriptions now match the available lookup functionality. Footer navigation exposes categories, tools and blog routes.
- Removed unverified social-account equivalences, founding year/software version, unsupported SearchAction and FAQ structured data no longer matching visible page content.
- Metadata is emitted in the initial head for every visitor using Next.js's documented htmlLimitedBots option. Titles/canonicals are checked in raw HTML and after hydration. This removes delayed metadata movement; it is a mitigation, not proof of the precise cause of the earlier intermittent #418.
- Captured the previous React mismatch at the throw site: expected MAIN, actual inner DIV with parent MAIN. Header and footer now render synchronously from translations resolved in the locale layout. See F for bounded post-change verification; no hydration-warning suppression was introduced.
- **Resolved prior application blocker:** the live Google query returned 200 and one result, the site's platform lookup returned 200 NDJSON, and the provider health endpoint returned 200 UP at 13:43 UTC. This clears the confirmed 521 outage observed earlier in the day.
- The website now shows a translated provider-unavailable warning, never presents that failure as “username absent”, hides misleading empty platform totals, and selects available Google results automatically. This preserves a useful degraded flow but does not restore the advertised platform provider.
- **Owner checks:** actual AdSense website verification/review status, applicant/account eligibility, applicable certified CMP, traffic provenance, contact mailbox delivery and provider/content licensing remain unverified where no account evidence was supplied. These are not all confirmed violations. No fake company identity, consent implementation or approval evidence was added.

## Exhaustive checklist

Statuses below describe evidence available at audit time; use release receipts for subsequent runtime remediation. N/A means the reviewed product has no such feature, not a universal policy exemption.

| ID | Status | Evidence | Next action |
| --- | --- | --- | --- |
| ADS-ELIG-01 | Unknown | A: applicant age/entity not provided | Owner/account confirmation |
| ADS-ELIG-02 | Unknown | A: account inventory unavailable | Confirm correct existing account |
| ADS-ELIG-03 | Unknown | S/H/A: content and runtime/account findings remain | Resolve findings and re-evaluate |
| ADS-ELIG-04 | N/A | S: independent domain, not a hosted Blogger/YouTube property | None |
| ADS-OWN-01 | Pass | S: root head and repository editable | Validate deployed script |
| ADS-OWN-02 | Pass | Recorded account-scoped Worker deployment and canonical domain receipts | Recheck live release identity |
| ADS-OWN-03 | Pass | F: initial head/DOM/interactive rendering passes after shell correction; historical errors retained | Observe future recurrence separately from provider outage |
| ADS-SITE-01 | Unknown | A: AdSense site-list status inaccessible | Check ownership/review/Ready in dashboard |
| ADS-SITE-02 | Pass | S: exact supplied tag; H: matching DIRECT ads.txt row | Confirm dashboard verification |
| ADS-TXT-01 | Pass | H/S: requested DIRECT publisher present | Recheck bytes on release |
| ADS-TXT-02 | Pass | H: public root ads.txt responds 200 | Retain authorized sellers |
| ADS-CONTENT-01 | Pass | G: original task guides, usable Google results and real platform lookup returns 200 NDJSON | Monitor provider availability during review |
| ADS-CONTENT-02 | Unknown | S: external data plus templates; rights not independently proven | Verify data/text rights and added value |
| ADS-CONTENT-03 | Pass | S: practical localized instructions/limitations, curated platform descriptions and articles beyond navigation | Quality judgment limited to inspected templates; Google decides |
| ADS-CONTENT-04 | Pass | S/T: visible tools metadata/copy now describes only available functions; no future-tool links | Retain matching content/feature checks |
| ADS-CONTENT-05 | Unknown | S: no manual ad units; A: auto-ad layout unavailable | Review actual placement before enabling ads |
| ADS-CONTENT-06 | Pass | S: en/zh/es/ja/fr/ko/de/pt/ru content | Preserve real localized content |
| ADS-CONTENT-07 | N/A | S: no published comments or public UGC submissions | Re-audit if UGC added |
| ADS-CONTENT-08 | Unknown | S: duplicate Discord fixed; templated SEO routes remain | Review page-specific utility |
| ADS-UX-01 | Pass | F: desktop/mobile navigation and ordinary/error interactions verified, no observed hydration error after shell correction | Preserve browser regression checks |
| ADS-UX-02 | Pass | S: search, categories, blog and legal navigation | Verify B |
| ADS-UX-03 | Pass | S: no fake downloads; unavailable tool links removed | Verify B target URLs |
| ADS-UX-04 | Unknown | S: GPT overlays removed; third-party runtime not fully observed | B and account placement review |
| ADS-UX-05 | Unknown | S: footer About/contact and legal routes; identity/mail delivery unverified | Owner confirms identity/contact |
| ADS-UX-06 | Pass | S: no forced interstitial/anchor initialization | Verify eventual auto-ad settings |
| ADS-CRAWL-01 | Pass | G: public HTML, ads.txt and critical /api/search/whatsmyname return 200 | Retain live lookup monitoring |
| ADS-CRAWL-02 | Unknown | S: rendering assets allowed; no complete WAF/geo/crawler evidence | Check bot access and dashboard diagnostics |
| ADS-CRAWL-03 | Pass | S: content routes use GET; AI POST is not a public content page | Preserve GET access |
| ADS-CRAWL-04 | Pass | B: canonical/locale pages load in actual Worker and production; ads.txt has no redirect | Node-only preview was not used for Worker acceptance |
| ADS-CRAWL-05 | Pass | S: stable locale/path URLs; no session IDs in content URLs | Preserve canonical paths |
| ADS-CRAWL-06 | Pass | G: site DNS/TLS works; provider health returns 200 UP and site lookup returns 200 NDJSON | Monitor separately from account review |
| ADS-CRAWL-07 | Pass | S/T: sitemap generated with unique URLs | Verify published sitemap |
| ADS-PROG-01 | Unknown | A: traffic behavior unavailable; QA stubs ads and never clicks them | Owner confirms acquisition/click practices |
| ADS-PROG-02 | Pass | S: reviewed copy has no ad-click reward/request | Keep neutral ad labeling |
| ADS-PROG-03 | Unknown | S: no custom ad labels; A: actual inventory unavailable | Inspect rendered ads when enabled |
| ADS-PROG-04 | Unknown | A: analytics/campaign sources unavailable | Review traffic sources |
| ADS-PROG-05 | Pass | S: exact standard async script, no click/impression manipulation | Keep script intact |
| ADS-PROG-06 | Unknown | S: global loader includes interactive search/AI surfaces | Configure placement exclusions; inspect actual ads |
| ADS-PROG-07 | N/A | S: browser website, no app WebView wrapper | Re-audit if wrapped |
| ADS-PUB-01 | Unknown | S: public lookup intended use; external result contents unbounded | Confirm lawful use and provider rights |
| ADS-PUB-02 | Unknown | S: platform names and text; licensing evidence absent | Verify content/media rights |
| ADS-PUB-03 | Pass | S: reviewed static copy contains no targeted abuse | Continue monitoring external results |
| ADS-PUB-04 | N/A | S: no animal products/cruelty content | None |
| ADS-PUB-05 | Pass | S: independent-service notice; unsupported statistics, founding date and social equivalences removed | Owner still confirms legal/account identity; no affiliation claimed |
| ADS-PUB-06 | Pass | S: username input, no credential collection or get-rich offers | Preserve input/data boundaries |
| ADS-PUB-07 | Unknown | S: public-profile lookup, no account access bypass | Review unauthorized-tracking positioning and actual uses |
| ADS-PUB-08 | Unknown | S/T: flagged adult results excluded; provider classification imperfect | Observe real returned content; maintain exclusions |
| ADS-PUB-09 | Unknown | S: publisher tag/ads.txt align; A: account identity unverified | Check account ownership/site record |
| ADS-PUB-10 | Unknown | S: overlays removed; A: Auto ads placement unknown | Review mobile/desktop actual inventory |
| ADS-PUB-11 | Unknown | S: template value and global loader require review | Exclude unsuitable screens and improve evidence |
| ADS-PUB-12 | Unknown | A: served placements unavailable | Review actual ad visibility/context |
| ADS-PUB-13 | N/A | S: reviewed content does not cover elections/health/climate claims | Re-audit new topics |
| ADS-PUB-14 | N/A | S: no manipulated public-affairs media | None |
| ADS-PUB-15 | Unknown | S: no such static content; external responses not exhaustive | Maintain provider checks/reporting |
| ADS-PUB-16 | N/A | S: no crisis/sensitive-event editorial monetization | None |
| ADS-REST-01 | Unknown | S/T: provider-flagged adult results removed | Review false negatives and external results |
| ADS-REST-02 | Unknown | S: ordinary static copy; arbitrary external snippets possible | Monitor snippets/results |
| ADS-REST-03 | N/A | S: no weapons commerce/instructions | None |
| ADS-REST-04 | N/A | S: no tobacco/drug commerce/instructions | None |
| ADS-REST-05 | N/A | S: no alcohol offers | None |
| ADS-REST-06 | N/A | S: no gambling offers or paid games | None |
| ADS-REST-07 | N/A | S: no pharmacy/supplement commerce | None |
| ADS-REST-08 | Unknown | S: removed GPT overlays; actual ad serving unobserved | Inspect eventual inventory |
| ADS-PRIV-01 | Pass | S/T: nine-language advertising/cookie/identifier disclosures | Validate published legal text |
| ADS-PRIV-02 | Pass | S/T: third-party cookies, IPs and Google data-use links | Retain disclosure |
| ADS-PRIV-03 | Unknown | S: no custom ad targeting params; contextual username lookup | Review ad personalization and sensitive-result screens |
| ADS-PRIV-04 | Unknown | A: no certified CMP/account evidence | Configure/test applicable regional consent |
| ADS-PRIV-05 | N/A | S: no precise location API; geolocation permission disabled | None |
| ADS-PRIV-06 | Unknown | S: under-13 exclusion in policy; A: audience/account settings unknown | Confirm audience and child-directed settings |
| ADS-PRIV-07 | Pass | S: no Google-domain cookie manipulation/proxy | Preserve standard integration |
| ADS-PRIV-08 | Unknown | S: no custom audience code; A: settings unavailable | Confirm no sensitive-result remarketing |
| ADS-PRIV-09 | N/A | S: not housing/employment/credit advertiser | Re-audit if targeting added |
| ADS-PRIV-10 | Unknown | S: ad choices disclosed; A: consent/audience rights unverified | Confirm CMP and personalization configuration |

Completeness: 73 unique requirement IDs; all nine reference groups represented. Unknown does not mean Pass. This audit does not certify the site for approval.
