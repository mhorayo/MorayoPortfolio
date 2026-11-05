# Doxflowy case study: story brief (5 Nov 2026)

Status: outline agreed in chat; metrics = CV facts ONLY (she said "No, use CV facts"). Build only after her "go ahead".

## Rules
- NEVER mention layoffs or how/why she left. Never use the exit-interview or employment documents that sit in her Doxflowy folder (Screenshot 2026-07-31 4.10.57 / 4.11.05 / 4.11.58 / 4.12.08 / 4.12.16 and the "Tel/website" one are private, not UI).
- Remove the live page's "Sign-ups up 42%" and "Session duration rose 27%": not in the CV or her report.
- Screens must be SHARP and true colour (she said the current ones are blurry and look blue): render the standalone HTML builds at 2x, no tint/filters; use the 2x sources below.
- Role: Product Designer, Useful Media — Doxflowy, Mar 2026 – Aug 2026, remote. Competitors: DocuSign, PandaDoc, GoodDocs.

## CV facts (cv.pdf)
- Monthly UX audits in Microsoft Clarity (heatmaps, recordings, rage taps, dead clicks, scroll), presented in stakeholder standups, 10+ sprint fixes per cycle.
- AI document assistant from scratch (prompt input, inline suggestions, formatting controls) replacing manual drag-and-drop tagging: average setup time cut by 40%.
- Calculation tags: auto-compute dates, prices, totals inside documents; no manual math for non-technical users.
- Workflow tags: conditional steps and logic so the right fields, approvals and actions trigger: ~25% less document prep time (estimated).
- Template download cards with clearer CTAs and inline email capture: rage taps 0.48% → 0.33% (31% less), dead clicks 15.70% → 14.90%, quick-backs 11.27% → 10.44%.
- New conversion funnel capturing emails from free-template downloaders who never signed up; onboarding made progressive: time-to-first-document ~30% faster (estimated).

## Her own May 2026 Clarity report (DoxFlowy-Website-UX-Analytics-Report.pdf) — usable as research
- 279 sessions, 245 unique users, 77.92% first-time visitors, 1.2 min active time, 2.36 pages/session, 52.61% scroll depth.
- Traffic: Google ~65%, direct ~25%, Bing ~10% (report says "illustrative").
- People check About/Contact/Privacy before acting (trust-verification pattern).
- Dead clicks 10.39% (19.48% of sessions), quick-backs 8.96% (11.69% of sessions); false affordances on pricing feature rows and review cards.
- Funnel: Google search → free tool (Signature Tool, Donation Receipt templates) → download → gone. "The biggest untapped conversion opportunity."
- Performance 65/100, LCP 13s, INP 230ms, CLS 0.36 → the reason for skeleton loaders / branded loading states.

## What she designed (her words, 5 Nov)
1. AI document assistant: prompt it to draft a doc, or upload any doc; it drafts and drops the tags and conditional logic in automatically.
2. Calculation tag: a new tag type.
3. Gated downloads: free templates/signature templates need an email → email marketing and adverts bring them back to sign up. Website redesign around this gating.
4. Skeleton loaders + branded loading states in core flows (rage taps when screens were loading/unresponsive).
5. Onboarding redesign: interactive, motion, personal questions (e.g. team size 10–50 vs 50–100 → different plan suggestion, wording and UI route). Built for A/B testing.

## Story (What is / What if / What wows / What works)
0. Hero: "Google was sending people. Doxflowy was letting them leave." 78% first-time visitors.
1. Problem: small product vs DocuSign/PandaDoc/GoodDocs; free template → download → leave. Sticky notes.
2. Research: monthly Clarity audits; animated funnel that breaks at "Download"; 13s load; false affordances.
3. What is? The gate: email capture on downloads + email marketing; website redesign. CV numbers.
4. What if? Personal onboarding by team size, motion, A/B tested. ~30% faster to first document.
5. What wows? AI document assistant (−40% setup), calculation tags (embed her interactive prototype), workflow tags (~25% less prep).
6. Loading: skeleton + branded loading states.
7. What works: CV numbers. 8. My part.

## Sources (~/Documents/doxflowy-promo-video)
- `DOxflowy screens /Dashboard for Figma (standalone).html` (web app), `Doxflowy Website Redesign/*Standalone.html` (website v2, features, template creation) → render at 2x.
- `DOxflowy screens /DOxflowy.png` (6912x3620 editor board), `Signature tool editor/Frame 10879913.png`, `E-signature Tool/Premium CTA Card - Editorial.png` (email gate card), `125shots_so.png`, `708shots_so.png`, `MacBook Pro 16_ - 1.png`, `Input 3.png`.
- `doxflowy_calculation_tag_prototype.html` (interactive), `doxflowy-loop.mp4`, `copy_01C70006…MOV` + `copy_A24F7A3B…MOV` (real signing-flow recordings, 1152x720).
- Repo already has dox-skeleton.jpg, dox-welcome.jpg (onboarding), dox-tags-editor.jpg etc. (1440px, re-export sharper where possible).
- No usable onboarding-by-team-size screens found yet: ask her, or build that section as a small interactive prototype.
