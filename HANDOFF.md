# Handoff — Morayo's portfolio (29 Oct 2026, afternoon)

## Where things are
- Live site: morayoakinkunmi.com (branch `main`). Don't touch main until Momo approves.
- Work in progress: branch `intro-reel`. The new home page is built but **not committed or pushed yet** (waiting on her yes).
- Repo: `~/Documents/My Portfolio/My Portfolioo` · tools: `~/Documents/My Portfolio/_tools` (new: `momofill` turns line art into a PNG with her body filled solid paper)
- Local preview: launch config `home` in `~/Documents/My Portfolio/.claude/launch.json` serves a scratch copy of the site; rsync the repo into it after edits. `?nointro` skips the intro.
- Old home page backed up at `_imagery/home/index-before-home-2026-10-29.html`.

## What the new home page does (index.html, home.css, intro.js, land.js)
1. **Intro, scene A untouched**: Momo comes out of her door, walks and waves, and "Momo / Product Designer" types out. The 3D orbit (phase B) has been removed.
2. **Hand-off (Option A, her choice)**: the hero underneath is the exact same frame. `momo-hero.png` is the video's last frame with her body filled, at the same pixels. The overlay goes, and the page builds around her: "MORAYO AKINKUNMI" rises behind her, the kicker "Inside the mind of", the lead and buttons, the nav and the chapter bar.
3. **Hero**: Nesil Noble style, with a chapter bar along the bottom (desktop only).
4. **Work**: pinned scroll in the Kyrgyz layout. The list is on the left, the framed media is in the centre as a film strip, and the story is on the right. Below 960px it stacks into cards.
5. **About**: a burst-shot frame flicking between `morayo-portrait.jpg` and `momo-think.png`, with three story beats in her own words.
6. **More**: Lujo style, a sticky index beside three rows: Experience (roles from about.html), What I do, and Design Geeks Community.
7. **Footer**: `momo-peek.png` rises over the footer's top line (the ledge), with the big email, three columns and the signature.

## Round 2 (same day), now live in the local preview
- The order is now Hero → **Story** (Momo thinking pinned on the left, three story beats on the right) → Work → About (burst frame, "Hi, I'm Morayo", What I do) → Experience / Community → Footer.
- Hero Momo steps closer (scale 0.58 → 0.78) after the hand-off, then cycles think → wave → cheer every second. Hovering or tapping makes her wave and wiggle. The poses are `momo-think/wave/cheer.png`, cut from the sheet.
- The chapter bar is now a vertical rail on the right. Only the current chapter is named, all names show on hover, and the rail hides at the footer.
- Footer: Momo peeps up from the line under the email (`momo-peek.png`), ducks, and pops up pointing at it (`momo-point.png`, mirrored), on a loop. The sheet has no thumbs-up drawing; swap one in if she draws it.

## Round 3 (same day)
- Fixed: the page couldn't scroll, because an old `.home { overflow: hidden }` rule in v2.css clashed with the body class. The body is now just `land`. Test scrolling with a real wheel, not `scrollTo`.
- Hero Momo is static (no pose cycle) and wiggles on hover. Hero + story are one pinned scene (240vh): on scroll she grows and glides to the left, the hero text fades, and one heading types out on the right, linked to scroll. The divider and the separate story section are gone.
- Work is now a "wall" in the style of meech213.com: 18 tilted cards (3 per project) drift right to left on a curve as you scroll, and the project in focus is named bottom-left with its result and case-study link.
- Momo's natural idle (look forward / glance aside, wave on hover) is still pending her choice: Option A (she draws 3 variations of one pose) or Option B (done in code).

## Next
- She reviews it. Commit and push to `intro-reel` only on her yes (the preview deploy needs a push).
- Later: the line-forming effect (character → line → character, SVG tracing) once usage allows; case-study rewrites (BroadMoney first); recruiter FAQ; Loom; CV dates; merge to main on approval.

## Rules (unchanged)
Partner, not assistant: push back, then respect her call, and show 2 options for visuals. Change only what she names, and never change the intro without asking. Never push to main without her yes. No made-up metrics. Always mobile responsive, silent videos, no whoosh sounds, keep old assets. Colours: paper #F8F6F2 and ink #111. Usage: weekly at 82% on 29 Oct, resets 31 Oct.

---
## Update — 30 Oct 2026

DONE (all local on intro-reel, NOT committed yet)
- Work section rebuilt as a meech213-style curved 3D wall (land.js "Work:" block + home.css .gw rules). Cards line the inside of a cylinder: the centre card is smallest and farthest away; edge cards grow and turn in. Scattered high/low, each with its own tilt, eased scroll. Waiting on Momo's OK.
- The Community row was removed from the Experience section.
- Daily usage budget rule (see memory usage-alert): the weekly limit is shared across Mon–Fri as a running total, 20/40/60/80/100% by the end of each day (WAT). Warn near the cap, stop at it.

APPROVED: interactive Momo, Option A ("living drawing", 2.5D, no Blender)
- Keep her exact line drawing, split into parts (body, head group, eyes, mouth, arm poses) with pivots at the neck and shoulder.
- One state controller: idle (breathing, blink every 3–6s, gaze drift) / look (continuous gaze vector) / curious / greeting / introducing / playfulReaction. Gestures run as GSAP timelines (anticipation → main → settle) with short cross-fades between arm drawings. A gesture is locked until it finishes.
- Cursor: the eyes lerp fast, the head lags behind, the body barely moves. The head turn is clamped to about ±8°; tracking weight drops to about 0.3 during a gesture. Hover → curious, click → playful/greeting. Phone: tap → greeting, otherwise idle.
- Scroll: a GSAP ScrollTrigger scrubbed timeline (reversible) replaces the hand-written hero scroll in land.js. The camera dollies through a layered paper set (floor, contact shadow, dust); she grows through perspective, moves left, turns right and plays "introducing"; the intro text reveals in order (heading, next line, body, CTAs) and finishes as she settles. The intro is unchanged.
- Existing poses to reuse: momo-wave (greeting), momo-think (curious), momo-cheer (playful), momo-point. Ignore the old girl character (stand/lean/step/walk).
- New presenting pose generated (nano_banana_flash, ref momo-hero.png): _imagery/character/present-1.png (eyes stay empty circles) and present-2.png (small pupils looking right). Comparison: present-compare.jpg. PICKED: present-1 (30 Oct). Its AI-added inner circles were removed (raw kept as present-1-raw.png). EYE RULE: never colour her eyes or add pupils or inner circles; they stay empty circles exactly as drawn. Gaze = move the empty circles slightly.

NEXT
1. Momo picks present-1 or present-2 (and the eye style).
2. Clean the pose with momofill; split the drawing into layers; build the controller and cursor tracking; then the GSAP scroll scene; verify desktop and mobile in the "home" preview (port 5181; rsync the repo into the scratch site folder first).
3. Commit/push to intro-reel only on her yes.

NEXT — GESTURE DRAWINGS FIRST (agreed 30 Oct; build the animation only after all gestures are approved)
Make 2 options of each with nano_banana_flash, reference momo-hero.png. Check the eyes before showing her (empty circles only).
1. Presenting, halfway: an in-between frame from rest (hand raised) to present-1.
2. Wave A: hand tilted left.
3. Wave B: hand tilted right (rest pose = momo-hero, hand already raised).
4. Curious: a redo of momo-think (hand at chin, slight head tilt) with empty-circle eyes; the old one has pupils, which breaks the eye rule.
5. Playful: subtle; small shoulder lift, head tilt, smile. momo-cheer is too exaggerated.
Idle and the look left/right/up/down poses need no drawings (code: the eye circles shift and the head tilts).
Her body fill = page paper colour #F8F6F2 on purpose (she belongs to the page). She may ask for white, a tint or see-through later.

GESTURES ROUND 1 (30 Oct, ~16:50 WAT): 10 drawings in _imagery/character/gestures/ (present-half, wave-a, wave-b, curious, playful × options 1 and 2). Sheet: gestures-sheet.jpg (top row = option 1, bottom = option 2; columns in that order). Eye check: all empty circles EXCEPT curious-1 (AI added inner circles; clean it before use if she picks it). Wave A and B came out very similar (both tilt slightly right) — may need a redo with a stronger left tilt. Waiting on her picks.

GESTURES ROUND 2 (30 Oct, ~17:10 WAT): 1 option each, all saved in _imagery/character/gestures/ (everything is local, so she can delete it from Higgsfield). Sheet: round2-sheet.jpg (row 1: look-left, look-right, look-down, curious-face; row 2: wave-a-redo, wave-b-1, playful-redo, smile). hands.jpg = rest / wave-a-redo / wave-b-1 / wave-a-1 hand close-ups.
- Wave pair = wave-a-redo (fingers lean in towards her face) + wave-b-1 (leans out). Fixed.
- curious-face is clean on the 2nd try (face only, no hand at chin).
- look-up: the AI adds inner circles every time (2 tries, both in rejected/). It's a reference only; code does the look-up by moving the empty circles up + a small head tilt. Don't spend more on it.
- rejected/ keeps the failed versions.
Older Higgsfield jobs (21–29 Oct) are backed up in _imagery/higgsfield-backup/.
NEXT: her picks (present-half 1 or 2, curious-face vs curious-2 for hover, playful-redo) → clean poses with momofill → split into layers → controller → scroll scene.

LOOKS REDONE AS HEAD TURNS (30 Oct, ~17:15 WAT) — she wants the HEAD to turn, not just the eyes. Saved: gestures/head-left.png, head-right.png (full profile, one eye), head-up.png (head tipped back), head-down.png (head bowed). Sheets: heads-sheet.jpg (close-ups: left · rest · right · up · down), heads-full.jpg. All empty-circle eyes. The eyes-only looks are in rejected/eyes-only-looks/; the weak tries are in rejected/.
BUILD NOTE: cursor tracking = blend between the 5 head drawings (rest + 4 turns) by cursor direction, with a short crossfade and the damped lag; the eyes don't move on their own.
- APPROVED by her 30 Oct ~17:20: head-left/right/up/down.

BUILD STEP 1 DONE (30 Oct ~17:30 WAT) — awaiting her approval
- New tools in _tools: align (lines a pose up on momo-hero by scale+shift using her lower body; all poses needed ≤0.7% scale, ≤1px shift), overlay (red/blue onion skin).
- _imagery/character/rig/aligned/ = the 12 poses aligned on the hero canvas (720×1280); rig/filled/ = momofill'd (paper body, transparent outside). Names: rest, head-left/right/up/down, wave-a-redo, wave-b-1, present-half-2, present-1, curious-face, playful-redo, smile.
- Finding: because the bodies line up exactly, we swap WHOLE poses (no cutting into body/head/arm pieces, no seams). The new pose fades in on top (180ms), then the old one fades out underneath. Continuous opacity blending ghosts (two heads), so it's rejected.
- Test: rig/test.html (cursor → head pose with a damped lag + breathing + sway). Serve via launch config "momo-test" (port 5190) from scratchpad/momo-test (rsync test.html + filled/ there first; the preview server can't read ~/Documents).
- To fix in step 2: her body fill reads slightly grey vs the page (#F8F6F2), because momofill multiplies the paper by the AI's off-white. Normalise the interior to pure paper.
NEXT: step 2 = put her in the real hero, idle (breathing, blink, sway, head drift).
- DECISION 30 Oct ~17:35: she didn't like the head-turn tracking ("looking weird"). DROPPED cursor head tracking. Instead, hover → she waves (rest → a → b → a → b → a → rest, ~2.1s, locked until done; tap on phones). Idle breathing + sway stay. test.html now shows this. Head-turn drawings stay saved but unused.
- REDO 30 Oct ~17:45: swapping whole AI poses flickered ("not flowing as one object"). Now ONE drawing: _tools/armcut splits rig/filled/rest.png into parts/base.png + parts/arm.png (arm = pixels connected to the hand above the elbow pivot 534,745 + a 40px disc). test.html bends the arm on a canvas like a noodle: each row turns round the elbow, 0 at the elbow → full angle at the fingertips (t^1.25), so there's no seam. Wave = anticipation dip, swings −15/+11/−14/+7/−3°, 1.9s, plus a slight body lean. Hover = wave (tap on phone), locked until done. The AI wave drawings are no longer used.

BUILD STEP 2 IN THE HERO (30 Oct ~17:55 WAT) — local only, not committed; awaiting her OK
- New folder momo/ (base.png, arm.png, eyes.png), cut from momo-hero.png itself (exact live tone): _tools/armcut, then _tools/eyecut (eyes 362,300 r21×22 and 421,288 r14×16).
- index.html: the hero img became div#hm.hx__frame.hm (sway > breathe > lean > base img + canvas#hmArm + 2 eye imgs clipped to each eye) + momo-hero.png underneath as a fallback until the arm loads (.is-ready hides it).
- home.css: the old hover rock (hx-hi) is replaced by .hm rules + reduced-motion off-switch. land.js (in the hero block): drawArm bend, wave on hover (mouse) / click (tap), blink every 3–6s (20% double).
- Preview: launch config "momo-test" (port 5190); rsync the repo (minus .git/_imagery/zips) into scratchpad/momo-test, then open /index.html?nointro.
- APPROVED by her 30 Oct ~18:00: step 2 (hero idle + blink + hover wave). NEXT: step 3 scroll scene + presenting arm.

=== MASTER MOMO LIST (agreed 30 Oct ~18:10 — use THIS list, don't drop items) ===
All motion uses the bend technique on her one drawing (memory: momo-bend-technique). No AI pose swaps.
DONE: 1 breathing · 2 blinking (empty circles squash) · 3 sway / weight shift · 4 hover wave (tap on phone)
TO DO, in order:
 5. Cursor following, REDONE with the bend method: the empty eye circles shift a few px first, then her head and neck bend gently towards the cursor with a damped lag (±6–8°), body barely moves. (The old version swapped whole AI head drawings = rejected as weird; the feature itself is still wanted.)
 6. Left alone: subtle eye drift + slight head movement, and every ~8–15s without interaction a small gesture: look around, curious head tilt, a little wave, a playful shoulder lift + smile. Never constant, never bouncy.
 7. Click = playful reaction (shoulder lift, head tilt, smile), locked until done.
 8. Curious / smile on hover alongside the wave (the mouth curve bends up — no new drawing).
 9. Scroll scene: she grows, moves left, turns right, the presenting arm bends out towards the intro text with the palm opening; the text reveals heading → line → body → CTAs; reverses on scroll up.
10. Polish: intro → live-Momo hand-off with no jump, speed, phone, reduced motion.
11. Her full review (incl. the work wall) → commit/push intro-reel → Vercel preview → merge to main on her yes.
LATER: same method on footer/think Momos, line-dissolve effect, case-study rewrites (BroadMoney first), recruiter FAQ, Loom, CV dates.
- ITEM 5 TEST (30 Oct ~18:20): rig/test.html = Momo on ONE canvas. Parts: momo/base.png (eyes removed), arm.png, eyes.png. The head bends round the neck pivot (400,598), rows above turning by tilt·t^1.6, plus a small neck stretch for up/down; the eyes are drawn into the head with a gaze offset (±5px x, ±4px y) and a blink (scaleY). Cursor: eyes ease at 0.14, head at 0.045 (lag), tilt ±7°. After 2.5s without movement she drifts on her own (sine head tilt ±1.6°, eyes wander). Tracking drops to 0.3 while waving. Waiting on her OK, then port it into the hero (replace the hero's img/canvas layers with this one canvas).
- ITEM 5/6 v2 (30 Oct ~18:30) after her notes: (a) her WHOLE body leans towards the cursor (a third bend, round her feet 345,1280, ±3.5°, slowest lag 0.03) on top of the head (±6°) and eyes; (b) the wave fires ONLY when the pointer is on her drawn pixels (canvas alpha hit test), with a pointer cursor only there, and tap = hit test too; (c) left alone (2.5s): a clearer drift (head ±3°, body ±1.2°, eyes ±3px), and every 8–15s a gesture of her own: look (left then right), curious (tilt + eyes up + neck lift), or a little wave. The canvas redraws only when something moved.
- CORRECTION 30 Oct ~18:40 (her words): the cursor should make her TURN to face it, not bend. Left alone (no hover) = just blinking (+ the approved breathing/sway); NO drift, NO idle gestures — this replaces item 6 of the master list.
  test.html now: no head/body bend. Two options to compare: A "subtle turn" = rotateY ±24° following the cursor (reads as squashing); B "full turn" (default) = she turns all the way round (rotateY 0↔180, through side-on) to face the side the cursor is on, i.e. her own drawing mirrored, with a dead zone in front of her. Eyes lead. The hover hit test is mirrored when she's turned.
- SHE PICKED B (full turn), 30 Oct ~18:50. NOW IN THE HERO (local, uncommitted): index.html #hm holds one canvas#hmCv (+ momo-hero.png as a fallback until loaded); land.js hero block draws base + eyes (gaze ±4/±3px, blink) + the bent arm; pointermove → facing 0/180 with a dead zone of ±0.12, yaw eased at 0.09 → CSS rotateY on the canvas (origin 48% 50%); wave only on her pixels (alpha hit test, mirrored when turned); faces right once the scroll scene starts (heroP > 0). home.css: .hm__cv origin; the old eye-img rules and the fig cursor:pointer are removed. momo/ eyes.png + base.png + arm.png are used; nothing else.
- TURN CLIPS (30 Oct ~19:05): she wants a natural, human-like turn, and her hands may drop. Seedance 2.0, 9:16, 720p, 5s, silent; 45 credits (299.8 left). Saved in _imagery/character/turn/: turn-a.mp4 (start = hero, end = mirrored arms-down playful-1 → end-left.png) and turn-b.mp4 (start frame only). Frames: turn-a-frames/, turn-b-frames/ (10 each), sheets sheet-a/b.jpg. Eyes = empty circles in every sampled frame. A: turns quickly through a side profile around 2–2.5s. B: turns away through a BACK view (bow centred) then profile, then faces left, arms down. Waiting on her pick; then cut ~40 frames and let the cursor scrub them (forward = face left, back = face right).
- NATURAL TURN IN THE HERO (30 Oct ~19:20, local, uncommitted). She rejected the coin flip; she wants a natural, partial (never 360°, never showing her back) turn towards the cursor, and her hands may drop. Clip: _imagery/character/turn/quarter-1.mp4 (Seedance 2.0, start = hero, she turns towards the viewer to front-left, arms drop; 22.5 credits; 277.3 left). Its frame 0 sits exactly on momo-hero.png. 30 frames 0.6–2.9s → momofill with paper lightness 0.9 (new 8th arg; outside fully transparent) → momo/turn/t00–t29.png (4.7 MB, loaded 0.4s after she appears — could be made lighter later).
  land.js: cursor on her left (nx < −0.2) → goal.turn 1, back in front/right (nx > −0.05) → 0; st.turn moves at a steady eased pace and always finishes (no frozen half-way frame with the arm out). Frame 0 = the live canvas (blink, eye gaze, wave); frames 1–29 = the clip. Wave only when not turned. Scrolling sets turn → 0. The rotateY flip and its CSS are removed. Tools: align now takes ALIGN="s,dx,dy"; momofill takes paper lightness; new _tools/flatten.
- APPROVED by her 30 Oct ~19:25: the natural turn in the hero. NEXT = step 5, the scroll 'zoom' scene (grow + move left + present + text reveal).
- STEP 5 ZOOM SCENE v1 (30 Oct ~19:40, local, uncommitted): the existing grow + move-left (renderHero, p over 0.8vh) is kept. The typing is replaced by staged reveals: .hx__sk, the 3 .hx__ln lines of the h2 (sr-only full sentence kept) and .hx__slink get .is-in at p ≥ 0.35, 0.5, 0.65, 0.8, 0.95, rising 0.6em with an opacity fade (CSS transitions, so it reverses on scroll up). The presenting arm: st.arm = 32°·smoothstep((heroP − 0.55)/0.45) — her arm reaches out towards the story as she settles. Name clash fixed: the footer already had `var beats`, so the story list is `storyBeats`. Checked on desktop 1440×900 and narrow; reverses to 0 lines when scrolled back.

=== STATE AT ~19:35 WAT 30 Oct (weekly 97%, stopped near the cap) ===
- She asked: zoom her BIGGER (to "bust upward") and swap the reaching arm for THINKING then THUMBS UP. Her hands may drop.
- DONE (local, uncommitted): bust-up zoom in renderHero (desktop s1 = 0.9vh/(0.52h), centre 0.29h at vh·0.52, x 27%; phone s1 = 0.4vh/(0.52h) at vh·0.26) + the phone story gets a paper backdrop (::before, fades in with .is-on at p ≥ 0.3). Checked desktop 1440×900 and phone. The presenting arm (32° bend) is still in, to be replaced.
- CLIPS (Seedance, 45 credits, 232.3 left; all 20 listed Higgsfield jobs are saved locally — she will delete them on Higgsfield):
  think-1.mp4 = REJECTED (the model mirrored her at the start).
  think-2.mp4 = right motion (hand to chin, then a clear thumbs up, thumbs-up frames clean), BUT ~1.0–2.5s (the thinking) has pupil DOTS in her eyes (the prompt said "eyes glancing up" — never say that) and ~0.75s has a closed-eye blink. A black open-smile mouth around 2.8s is fine.
  _tools/dedot tried to erase the dots automatically: v1 (separate small blobs) found none (the dots touch the rings); v2 ("thicker than a line" cores) wrecked her lines — her ink is ~5px thick at 720. Don't use dedot as it is. g2dd/ is damaged output; g2raw/ (40 raw frames 0–4.6s) is fine.
- NEXT (pick one): (a) regenerate the think clip (22.5 credits) with NO eye-direction words and "her eye circles stay exactly the same: empty, unchanged, never pupils, never closed"; or (b) erase the dots by hand per frame with fixed eye positions (they're tied to the ring). Then: 30 frames → momofill paperL 0.9 → momo/think/ → in land.js play the frames by scroll p (≈0.55→1) instead of the 32° arm bend; check eyes in every frame; commit to intro-reel on her yes.
- HER NOTES ~19:45 (next session, in this order): (1) a 3D CAMERA feel for the zoom — the scene tilts/swings in perspective as you scroll, with parallax depth layers (name far back, Momo middle, story front), settling flat when the story lands; build a quick test first. (2) SHARPNESS — she looks blurry at bust-up (720px art stretched 3–4×): trace her into SVG vectors; the gesture frames need 1080p and/or a Topaz upscale. (3) The think → thumbs-up clip (regenerate, 1080p, with no eye-direction words), then wire it into the zoom.

======================================================================
## NEW-CHAT SUMMARY (written 1 Nov 2026, end of the 30 Oct Momo chat)
Deadline: Tuesday 3 Nov. Branch intro-reel; NOTHING since 29 Oct is committed (index.html, intro.js, land.js modified; home.css, momo/, HANDOFF.md and more are untracked). Live site = main, untouched.
Budget rule: weekly usage reset Sat 31 Oct; Sunday use counts against Monday's 20%; Tuesday's cap is 40% cumulative.

WHAT'S BUILT (local, approved by her unless noted):
- Hero Momo on ONE canvas (index.html #hm > canvas#hmCv; code in land.js hero block; parts in momo/): breathing + sway, empty-circle blink, eyes follow the cursor, wave ONLY when hovering on her drawn pixels (tap on phone), natural quarter TURN towards the cursor when it's on her left (momo/turn/t00–t29 from a Seedance clip; always completes), faces right on scroll. Left alone = only breathe + blink.
- Scroll "zoom": she grows to a BUST-UP framing and moves left; the story reveals label → 3 lines → link (replaced the typing — confirm with her). Still shows a 32° "presenting" arm bend (to be replaced). The phone story has a paper backdrop. Cache-bust ?v=1793390000.
- REJECTED along the way: AI pose swaps (flicker), head-bend cursor tracking, rotateY coin-flip turn, idle drift/gestures.
- Method rules: memory momo-bend-technique (bend one drawing; Seedance clip from momo-hero for turns/gestures; never mention eye direction in prompts). Eye rule: empty circles only.
- All Higgsfield jobs are saved locally (_imagery/character/gestures, /turn, _imagery/higgsfield-backup). Credits left: 232.3.

HER LATEST NOTES (not built): (1) a 3D camera feel in the zoom (scene tilts in perspective, parallax depth layers, settles flat when the story lands) — test first; (2) Momo looks BLURRY at bust-up (720px art) → trace to SVG; gesture frames at 1080p/Topaz; (3) THINK → THUMBS UP during the zoom: think-2.mp4 has the right motion but pupil dots at 1.0–2.5s → regenerate (22.5 credits) with no eye-direction words.

PREVIEW: launch config "momo-test" (port 5190) serves scratchpad/momo-test of the 30 Oct session — rsync the repo (minus .git/_imagery/zips/*.sb-*) into it; with a new session's scratchpad, update the path in ~/Documents/My Portfolio/.claude/launch.json. Open /index.html (intro) or ?nointro.

======================================================================
## NEW-CHAT SUMMARY #2 (written Mon 2 Nov 2026, ~11:00 WAT; end of the 1–2 Nov chat)
Deadline: Tuesday 3 Nov. Branch intro-reel, ALL work committed and pushed (last: "cluster removed; names fade; ring 360"). main / morayoakinkunmi.com untouched.
Preview (always newest): https://morayo-portfolio-git-intro-reel-teeakinkunmi-6064s-projects.vercel.app/  (add ?nointro to skip the intro)
Usage: she wants it said as "20% a day" only (never cumulative 40/60%). Monday: 12 of 20% used at ~11:00. Heads-up at 10 of 20, warn near 20, stop at 20 (memory usage-alert).

HOME PAGE ORDER NOW: intro → hero + zoom story (Momo) → Work (Per Appelgren style) → Story ring → About → Experience → footer.
- Zoom story copy LOCKED and live: "(Who I am)" + 3 lines "Computer engineer by training. Designer by nature. / I design fintech and AI products that people trust with their money. / And I prove it in the data." + body "It clicked the first time I watched analytics…" + "See the proof →".
- Work (#work, .pw in index.html/home.css, land.js "Work:" block): reference = perappelgren.de (her recordings on Desktop, 1 Nov 9.23/9.35/10.56/11.05 PM). One card per project (main tile; Renncora/OwnIt/Help2Pay play their videos). Opening = stacking wipe: frames rise from below and stop in the card's place, reverse order, landing on BroadMoney, as the section comes up the page (NO overlap with the story section — she disliked the overlap). Each project holds, then its card grows/tilts and flies off to alternating sides over the next card underneath. Name: smaller (min(9vw,18vh)), bottom-left, behind the cards, FADES in place (she hated it sliding with the images). Small label at left (number·tag, name, result, View case study). Cluster/constellation REMOVED at her request.
- Story ring (#story-ring, .po): 12 small tilted project cards open from a dot into a ring, turn a full 360° round a centred paragraph that wipes in line by line (4 beats: engineering→Webflow/Figma; first analytics session; 55%→22% + sign-ups + AI creator platform; final "My work has shaped products at BroadMoney, Renncora, Doxflowy, Help2Pay and Kunchi MFB. I don't just design screens. I design the moment people decide to trust a product."), then expands off screen.
- About (Per style): small centred portrait (morayo-portrait.jpg only, no Momo swap) + short centred paragraphs + availability line.
- Removed: all divider lines, chapter rail. Smooth scrolling = Lenis 1.1.13 (jsdelivr), paused while the intro plays; scenes follow scroll directly (SK=1).
- The round dark button on previews is Vercel's toolbar, not the site.

OPEN / NEXT (her list, smallest first):
1. Her review of the latest build on a real trackpad; she sent a 11:22 PM recording I couldn't read (it was in a macOS temp folder) — ask her to drag the Desktop copy in, then study + apply.
2. Second section (zoom) polish — she wanted ~2% on it: options were layout/spacing/timing, or removing the old 32° reaching arm.
3. Phone check of work, ring and About (not checked since the rebuilds).
4. Wire locked copy: hero lead "Senior Product Designer for fintech and AI. I design products people trust with their money and their time."; footer "Hiring a product designer who thinks before she designs? Let's talk." Her answers still needed: internship company, faith line in/out, booking link for "Book a call".
5. Think → thumbs-up clip (regenerate 1080p, 22.5 credits, no eye-direction words; eyes = empty circles) replacing the reaching arm.
6. Lighten momo/turn frames (4.7 MB), speed, reduced motion; Experience dates = CV.
7. Go live: merge intro-reel → main on her yes.
Later: work gallery page, sharp vector Momo, 3D camera feel, case-study rewrites (BroadMoney first), recruiter FAQ, Loom.
Testing note: the preview pane is often hidden → rAF stalls; in the page run window.requestAnimationFrame = cb => setTimeout(() => cb(performance.now()), 16) before checking. Preview: launch config "momo-test" (port 5190) serves this session's scratchpad/momo-test — update the path in ~/Documents/My Portfolio/.claude/launch.json for a new session and rsync the repo into it.
- NOTE (Mon 2 Nov, after budget stop): the think → smile/thumbs-up Higgsfield clip must be generated FROM HER BUST-UP framing (start frame = momo-hero cropped to the bust-up the zoom lands on, upscaled), at 1080p, so she is sharp in the zoom. Also study her 3D example first: ~/Desktop/Screen Recording 2026-11-01 at 9.32.52 PM.mov. Eyes = empty circles; no eye-direction words in the prompt.

======================================================================
## NEW-CHAT SUMMARY #3 (Mon 2 Nov 2026, evening) — read this first
Deadline: Tue 3 Nov — tomorrow she wants: (1) IMAGE QUALITY (sharper Momo; screens/tiles), (2) STORYTELLING copy (she still finds it not captivating), (3) the fade / fade-out transitions, then WRAP UP and GO LIVE (merge intro-reel → main on her yes).
Usage: weekly 32% at end of Monday (override used). Say "20% a day"; Tue–Fri have ~68% left (~17%/day to stay even). Higgsfield credits: 269.8.
Preview (always newest): https://morayo-portfolio-git-intro-reel-teeakinkunmi-6064s-projects.vercel.app/ — tell her to use a private window if a page looks old (an old /work.html redirect was removed from vercel.json today; browsers may have cached it).

BUILT TODAY (all pushed to intro-reel):
- Home order: intro → hero/zoom (Momo bust-up; 45° turn + smiling hand-at-chin clip momo/think/t00–t29 from Seedance 2.0 720p, played by scroll; bottom fades like her legs; story lines rise in, NO typewriter) → Work (#work .jw: Joby-style — big picture centred, last one small top-left, next small bottom-right, narrow story column with big bold headline + short selling body; first picture grows in from bottom-right as the section arrives) → Story ring (#story-ring: "THE STORY SO FAR" heading, ring turns 360° round 2 paragraphs, then expands) → About (bigger centred portrait) → footer. Experience removed from home. Smooth scroll = Lenis. Old .pw (Per Appelgren) code is still in home.css/land.js but unused.
- Case studies: all 10 rebuilt on case-broadmoney.html's template (case.css), generator /scratchpad/gen/cases.py (copy it into _tools if a new session needs it; old pages kept as case-*-v1.html). Screens square, smaller, aligned with the text column, on one line; next case has an arrow.
- New pages: work.html (6 tiles), archive.html (4 rows, explanation in the column beside each name, floating hover preview), about.html (tilting portrait, story, skills, experience), contact.html (big email, working formsubmit form). pages.css, type.js (typewriter on case/page headlines — still ON there). Generator: scratchpad/gen/pages.py.
- Nav: Work → work.html, About → about.html; Contact button is a plain rectangle (radius 0).
REJECTED today: 3D CSS tilt of the flat drawing; card-shrink exit of the zoom; overlap of work over the story; constellation/cluster; Per-style sliding names.
Still unknown from her: internship company, faith line, booking link. Phone check of all new pages not done.

## NEW-CHAT SUMMARY #4 (Wed 4 Nov 2026, ~18:00 WAT) — read this first
Usage: weekly 60% now. Monday ended at 32%, Tuesday at ~51% (19 of 20 used). Wednesday so far: 9 of 20 used. 40% left for the rest of the week, so stay at about 16% a day (Thu/Fri). Always say "today X of 20% used" (memory usage-alert).
Links: live https://morayoakinkunmi.com/ · newest preview https://morayo-portfolio-git-intro-reel-teeakinkunmi-6064s-projects.vercel.app/ (private window if a page looks old). Still not merged to main: wait for her yes.
Direction (memory identity-and-voice-nov3): proud Yoruba/Lagos identity; a "be the change you want to see" hero line; a Lagos street scene in line art with Momo walking through it before the footer; per-product process write-ups with motion prototypes of her real screens and her branding work.
NEXT: Renncora story-time. She talks, I shape it, one small question at a time. First question (not answered yet): "What is Renncora, and who was it for? Tell it like you'd tell a friend." Existing page: case-renncora.html (generator scratchpad/gen/cases.py, copy into _tools if needed); assets are the ren-*.jpg/mp4 files in the repo.
SEO/AEO (memory seo-aeo-checklist): Search Console and Bing done. Open: request indexing after go-live, LinkedIn/bios, recruiter FAQ, case summaries, alt text, update llms.txt (remove Leadership, add Lagos/Yoruba) and sitemap (add work.html, refresh lastmod). With each case rewrite, update that page's meta, summary, alt text and llms.txt line.
Still unknown from her: internship company, faith line, booking link. Phone check of the new pages not done.

## NEW-CHAT SUMMARY #5 (Thu 5 Nov 2026, ~10:35 WAT) — read this first
Usage: weekly 64% now. Wednesday ended at about 60–61%, so today ≈ 3–4 of 20% used. Say "today X of 20% used". Write down the weekly % at the end of each chat so the next day's count is exact.
Method (memory bulk-brainstorm-then-build): she sends changes in bulk, we talk, I build ONLY when she says "ok finish" / "go ahead". Before building, recap the agreed list.
Preview: https://morayo-portfolio-git-intro-reel-teeakinkunmi-6064s-projects.vercel.app/ (not merged to main; wait for her yes).
Local preview: launch config "final" in ~/Documents/My Portfolio/.claude/launch.json serves a COPY in this chat's scratchpad; in a new chat rsync the repo to your own scratchpad/site and point a new config at it (the server can't serve ~/Documents directly).

DONE + PUSHED today (commit 6d78421): new hero headline + Lagos sub line, "Trained as an engineer. Born a designer." story (3 lines + 2 paragraphs), square buttons everywhere (.hbtn, .hbtn--line, .hbtn--sm in home.css), white ↗ hover circle on work pictures (home + work.html), new copy for Doxflowy/WeCare/OwnIt/Help2Pay ("Founder project"), "Beyond the screens" (Design Geeks: YouTube + community + 1-on-1 mentoring; no people count known), shorter About, Momo's eyes move up/down (land.js gx 6 / gy 9), footer peek CSS shift, phone ring is an oval. Change list: _tools/final-round.md.

NEXT, ROUND 2 (agreed asks, she hasn't said "go ahead" yet — recap then build): see _tools/final-round.md "ROUND 2":
- Hero: "Don't wait for change. Design it." replaces the big "Momo / Product Designer" text; body + buttons move up.
- Doodle underline under "Design is where they meet."
- Beyond the screens: left-aligned bold heading; a second heading for paragraph 2.
- Footer double line STILL shows on her screen: crop the drawn ledge (bottom ~4 rows) out of momo-peek.png itself.
- Momo's whole head tilts up/down with the mouse (eyes alone aren't visible enough).
THEN BroadMoney case study: her full story is in _tools/bmp-story.md. Template + rules in memory case-study-rewrite-plan (less is more, sticky notes, What is/What if/What wows/What works, video prototypes from her real BMP screens, paper sketches, light-ray hero video, less zoomed assets, CV-matching dates). Ask her for the real before/after transaction figures; never invent.

## NEW-CHAT SUMMARY #6 (Thu 5 Nov 2026, ~11:45 WAT) — read this first
Usage: weekly 64% when this chat ended, so today about 3–4 of 20% used. Say "today X of 20% used".
ROUND 2 BUILT + pushed to intro-reel (preview only, not main): the hero headline "Don't wait for change. / Design it." replaces "Momo / Product Designer" at the same size (also in the intro typewriter, intro.js LINES, CPS 32); the sub line and buttons tuck up under it; a self-drawing doodle underline under "Design is where they meet." (.hx__dood/.hx__ul); Beyond the screens has a bold left heading per paragraph ("Beyond the screens" / "The Design Geeks Community"; the old .po__title is gone); momo-peek.png cropped to 341x206 (ledge removed), .fx__p--peek bottom 0; Momo's head tips up/down with the cursor (land.js NECK bend, goal.tilt = ny*4).
She said: change only what's agreed, never the layout.
NEXT: BroadMoney case study (story in _tools/bmp-story.md). Ask her first for the real before/after transaction figures and any company facts; never invent numbers.
Local preview: launch config "round2" (port 5196) serves this chat's scratchpad copy; in a new chat rsync the repo to your own scratchpad/site and add a config.

## NEW-CHAT SUMMARY #7 (Thu 5 Nov 2026, ~13:00 WAT) — read this first
Usage: weekly ~66–67% at this point; today ≈ 7 of 20% used.
BroadMoney (case-broadmoney.html + bm.css + bm.js): hero is now bmp-hero.mp4 (Higgsfield: GPT Image 2.5 widened bmp-tile.jpg to 16:9 = bmp-hero-wide.jpg, then Seedance 2.5 light-only 8s loop; phone stays still) with her real flow overlaid on the phone screen (.bm-hv__scr, left 56.72% top 30.9% width 11.33%). Role = Senior Product Designer. Placeholders replaced with CV-backed figures (8 testers, 54.75% old-site drop-off, dead clicks 9.19→8.70%); add real volume/£/customers later if she gives them.
Renncora (case-renncora.html + ren.css, shares bm.css/bm.js): full story rewrite from her 5 Nov story. Solo Senior Product Designer, worked with CEO + CTO, Aug 2026–present. Chat-bubble notes, night sketchbook, before/after drag sliders (ren-before-*.jpg exported from Figma IDEATION 808:589 and Profile C 1979:4414), 7 motion flows (onboarding, feed swipe-up, profile, AI voice, AI video, live, communities). Hero: ren-hero-wide.jpg (Higgsfield widened) with CSS moving sun (no overlay: thumbs cover the screen).
Figma file: VHRhePoFSU11zEJfiFFx1l (App Re-design page 188:14, IDEATION section 293:435).
bm.js now also does swipe-up (data-dir="up", data-swipe), compare sliders (data-compare) and photo-phone perspective mapping (data-quad).
Higgsfield account balance 338.8 credits after these jobs (she may have topped up; I didn't).

## NEW-CHAT SUMMARY #8 (Thu 5 Nov 2026, ~14:00 WAT) — read this first
Usage: weekly ~68%+ ; today ≈ 8+ of 20% at the start of this chat.
BROADMONEY HERO FIX (her complaint: wrong flow, only clicks, screen not fitting): the phone now plays the real SEND-MONEY flow (bmp-home-gbp → bmp-send-money → bmp-recipient → bmp-transfer-options → bmp-pin → bmp-tx-summary), each screen SLIDING in from the right (.bm-hv__scr img rules in bm.css). Fit bug = the poster bmp-hero-wide.jpg has the phone ~30px lower/right than the video, so before playback the overlay floated; poster is now bmp-hero-poster.jpg = the video's own first frame. Overlay coords unchanged (they match the video to ~2px).
RENNCORA ROUND 2 (all 12 items from _tools/final-round.md built):
- Copy: existing design → she redesigned it (research heading, hero sell, meta, "1 designer: end to end"). Low-end phones / 2G / rural Nigeria context in research + a Constraint sticky note.
- Splash story: video splash first (ren-v-splash.mp4 = ren-demo-onboarding.mp4 bezel-cropped, 30fps, 1.4 MB), made light, tested; team switched to images → image prototype from Figma 293:461 (ren-simg-1..5.jpg). Shown side by side (.rn-pair), then sign-up flow.
- Hero: ren-hero.mp4 (Seedance 2.5, 6s 1080p light-only loop from ren-hero-wide.jpg, start=end frame), poster ren-hero-poster.jpg. CSS sun removed.
- Sticky notes: .rn-notes/.rn-note square notes (adhesive band, lifted corner shadow, curl), lilac/mint/peach/sky/lime. Chat bubbles removed.
- Feed: ren-v-feed.mp4 recording (videos playing + swipes + comments) in the phone; bm.js [data-rec] lights steps at data-times.
- Profile after = Figma 2462:17582 "Creator Portfolio - Olivia Johnson" (ren-profile-after.jpg); dark = 2865:11733 (ren-profile-after-dark.jpg). Slider + phone same size (.rn-cmpw__ph).
- Light & dark section: drag slider light ↔ dark profile.
- What works: "60% less visual clutter" spelled out with what it means.
- Live: step 3 is a video (.bm-scr.rn-live: ren-live-guy.mp4 from Seedance on ren-live-watching.jpg) + CSS hearts/likes/gifts pouring up (.rn-fly).
- AI video call step plays ren-ai-call.mp4 (Seedance on ren-ai-video-call.jpg).
- bm.js: any .bm-ph > [data-step] (img, video or .bm-scr layer) can be a step; videos play only while their step is on; per-step data-hold.
Seedance tip: Renncora screens are 412x917, not 9:16 — pad to 9:16 with black bars first, then crop back, or Seedance reframes the UI.
Preview: launch config "ren2" (port 5197) in ~/Documents/My Portfolio/.claude/launch.json serves this chat's scratchpad/site copy.
NEXT: DOXFLOWY case study rewrite. Brief, facts, sources and rules in _tools/dox-story.md (CV facts only; never mention layoffs; sharp true-colour screens). Build after her "go ahead". Never run Higgsfield without telling her the cost first and getting her yes.
