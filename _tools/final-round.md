# Final round — agreed changes (started 5 Nov 2026)

Build only after Momo says "ok finish" / "go ahead".

## APPROVED
- Hero headline: "Don't wait for change. Design it."
  Sub: "I'm Morayo, a product designer born in Lagos. When something's broken, I don't complain. I redesign it, for money, AI and the everyday tools people rely on."
- (Who I am), approved 5 Nov ("solid"):
  - "Trained as an engineer. Born a designer."
  - "Engineering gave me the logic. Lagos gave me the hustle. Design is where they meet."
  - Body: "My real "aha" wasn't in Figma. It was in the analytics: watching real people tap from screen A to screen B exactly the way I'd planned. That's when design stopped being decoration and became proof. / Now I design fintech and AI products people trust with their money. I start where they get stuck, and I don't stop until the numbers move. At BroadMoney, first-transfer drop-off fell from 55% to 22%."
  - Link: "See the proof →"
- Buttons: every button has the same shape as the navbar Contact button (hero CTAs, View case study, etc.)

## TO BUILD (agreed asks, copy pending her OK)
- Selected work: "View case study →" link becomes a real button (navbar style).
- Hover on work pictures (home + work.html and other work tiles): white circle with ↗ in the centre (ref: Puma × Juun.J image).
- New copy: Doxflowy (keep "Thousands came for its free templates and left; I turned that traffic into accounts"), WeCare, OwnIt, Help2Pay. Drop the "My own product" phrase.
- Story ring: title must not clash with the images; new title; title in the "Selected work" heading style; two new paragraphs that continue the story (Design Geeks, mentoring designers), not repeat it.
- Less space between the story ring and About.
- About: one paragraph fewer; new copy about who she is at her core.
- Momo: hero looks a bit blue, make it neutral; nicer gestures; head/eyes follow the mouse up and down too, not only sideways.
- Footer: Momo sits on a double line; she must sit on the footer's one line.

## ROUND 2 (asked 5 Nov; BUILT + pushed 5 Nov, except the BroadMoney/case-study items, which are next)
- Hero: "Don't wait for change. Design it." REPLACES the big "Momo / Product Designer" text (same place, same size). Move body text + buttons up.
- Who I am: a hand-drawn doodle underline under "Design is where they meet."
- Beyond the screens: heading left-aligned with the body text, bold, same size family; paragraph 1 has the heading; paragraph 2 gets its own heading.
- Footer: double line still visible on her screen (Momo's drawn ledge sits ~4px above the footer line). Robust fix: crop the drawn ledge out of momo-peek.png itself.
- Momo: her whole head tilts up/down with the mouse, not only the eyes (eye movement isn't visible enough).
- BroadMoney case: hero image too zoomed in -> a subtle video (soft moving light rays); other assets too zoomed in too. Full story-led rewrite (see chat); BMP story from her next.
- Case studies: LESS IS MORE always. Show business problem / user needs / opportunities / metrics as cute sticky notes (hand-drawn, paper feel), not heavy tables.

## BroadMoney case (built 5 Nov, pushed to preview)
Story-led rewrite in case-broadmoney.html + bm.css + bm.js. PLACEHOLDERS to fill (red dashed .tbc in section 07): transfers a month before/after, £ moved, customers. Search "tbc" in case-broadmoney.html.
CV facts used: Oct 2024–present, 150+ screens, Wise + Lemfi analysis, 8-person usability test (4 internal, 4 external), 15+ iterations, Clarity 54.75% pre-redesign drop-off, rage taps 0.17%→0.05%.
Removed the old unconfirmed line "processes millions of pounds" (now a placeholder instead).

## RENNCORA ROUND 2 (asked 5 Nov, she said "go ahead" — build in a new chat)
1. Copy: there WAS an existing design; she redesigned it (remove "There was no Figma file").
2. Add context: many users in Nigeria (rural especially) are on low-end devices and 2G/very poor networks.
3. Splash onboarding story: she first designed splash screens with VIDEO, optimised to be very light so they load on low-end phones with bad networks; tested, it worked; the team then decided to convert to IMAGES. Show the full video splash prototype AND the static image splash prototype (Figma "Splash Screen Prototype" 388:501, Splash Screen 293:461 / 1529:2829; ren-demo-onboarding.mp4 may be the recording).
4. Hero must be a real video (same method as BroadMoney: Seedance light-only loop from ren-hero-wide.jpg; screen/hearts can animate).
5. Notes: make them look like real square sticky notes (curl, adhesive shadow), not chat bubbles; colours different from BroadMoney.
6. Feed: show videos actually playing + swiping, not static images (ren-demo-feed.mp4, or Seedance-animate feed stills).
7. Profile "after" is the wrong screen: get the most recent after profile from Figma (Profile Module sections 2185:15681 / 2306:8171 / 2214:16889).
8. State and show she designed both light and dark mode.
9. "What works": "−60%" is unclear; spell out "60% less visual clutter on the feed" and what it means.
10. Live: show the live stream as video, the guy doing his thing with hearts/likes multiplying and gift emojis (ren-live.mp4 / Seedance + CSS hearts overlay).
11. It's a video streaming app: wherever a screen shows video, play video.
12. Profile row: before/after slider and the profile phone must be the SAME height.
Rules: never invent metrics; bulk-brainstorm method; usage "today X of 20%" (weekly was 68% at end of 5 Nov morning chat ≈ 8 of 20 today).
