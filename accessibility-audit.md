# Accessibility Audit: WELLlife Companion (index.html)
**Standard:** WCAG 2.1 AA | **Date:** 2026-04-19 | **File:** `D:\APP\welllife\index.html`

## Summary
**Issues found:** 22 | **Critical:** 7 | **Major:** 11 | **Minor:** 4

Overall verdict: the prototype has several structural accessibility gaps — most stem from using non-semantic `<div>` / `<span>` elements (with `onclick`) in place of real buttons/tabs, missing label-input associations, global `outline:none` that kills focus indicators, and several low-contrast secondary text styles. Nothing is unfixable, and the checkbox labels are correctly wrapping their inputs — that's a good foundation to build on.

---

## Findings

### Perceivable

| # | Issue | WCAG Criterion | Severity | Recommendation |
|---|-------|----------------|----------|----------------|
| P1 | Secondary/meta text uses `var(--g3)` = `#9a9890` on `#fff` at 11–12px — contrast ≈ 2.7:1 (fails 4.5:1). Affects `.qbtn-s`, `.dcdate`, `.recovery-history-date`, `.recovery-history-empty`, legend captions, "Demo:" footer. | 1.4.3 Contrast | 🔴 Critical | Darken `--g3` to at least `#757575` (≥4.5:1 on white). Replace ad-hoc grays (e.g. `#98a1ad` on `.recovery-date`) with a token that passes. |
| P2 | US risk map `<svg id="us-map">` has no `role="img"` and no `aria-label`/`<title>`. Screen reader users get nothing. | 1.1.1 Non-text content | 🔴 Critical | Add `role="img" aria-label="US respiratory risk map, [disease]"`, and provide a text alternative (e.g. top-3 high-risk states in a visually-hidden list). |
| P3 | Meaningful SVG icons used alone as buttons (close ×, send ►, back arrow, chat FAB) have no text alternative. | 1.1.1 / 4.1.2 | 🔴 Critical | Add `aria-label` to the button, or `<title>` inside the SVG, or visually-hidden text. Decorative SVGs (e.g. tab icons paired with visible text) should have `aria-hidden="true"`. |
| P4 | Map legend text uses `opacity:.6` / `.65` over the dark-green gradient. Effective contrast dips below 4.5:1 for 10–11px text. | 1.4.3 Contrast | 🟡 Major | Drop opacity or use a solid off-white (`#e6efe9`); verify ≥4.5:1 against the darkest gradient stop. |
| P5 | `.risk-ttl` text at `opacity:.85` (11–13px) on a translucent card over dark gradient — borderline for small text. | 1.4.3 Contrast | 🟡 Major | Use solid `#fff` for the title; reserve opacity variants for ≥18px/bold labels. |
| P6 | Non-text UI (map-filter buttons' 1.5px border at `rgba(255,255,255,.25)`, form inputs' `.5px` border at `rgba(0,0,0,.1)`) may fail 3:1 non-text contrast against adjacent colors. | 1.4.11 Non-text Contrast | 🟡 Major | Raise border opacity so the boundary of each control is perceivable (≥3:1 against its neighbor). |
| P7 | Severity legend (Severe / Mild / Recovering / Recovered) uses color-only meaning via colored dots plus labels — OK here, but the recovery-track dots and pills convey state **by color alone** in places (e.g. `.dp.dpdone` vs `.dp.dpnow`). | 1.4.1 Use of Color | 🟡 Major | Add a shape or icon cue (checkmark for done, pulse/dot for current, dashed outline for predicted — the last is already done well). |
| P8 | `color-scheme` not declared and dark mode is not handled; iOS users in dark mode may see washed-out contrast. | 1.4.3 (supporting) | 🟢 Minor | Add `<meta name="color-scheme" content="light">` or provide a dark-mode variant. |

### Operable

| # | Issue | WCAG Criterion | Severity | Recommendation |
|---|-------|----------------|----------|----------------|
| O1 | Bottom navigation tabs (`.tab` at lines 1094–1097) are `<div onclick="go(...)">` — not focusable, no keyboard activation. | 2.1.1 Keyboard | 🔴 Critical | Convert to `<button>` (or add `role="tab" tabindex="0"` with `keydown` handling for Enter/Space and Arrow keys); use `role="tablist"` on `.tabs`, `aria-selected` on the active tab, and `aria-controls` to the panel. |
| O2 | Recent health cards (`.rc` at lines 351, 355) and "Forgot password?"/"Sign up"/"Privacy Policy" links are `<div>`/`<span>` with `onclick`. Not reachable by Tab, no Enter/Space activation. | 2.1.1 Keyboard | 🔴 Critical | Use `<button>` for card rows and `<a href>` (or `<button>`) for the text links. |
| O3 | Recovery-track draggable slider is a `<div>` with touch/mouse handlers only — no keyboard way to move the whale icon / select a day. | 2.1.1 Keyboard | 🔴 Critical | Add `role="slider"`, `tabindex="0"`, `aria-valuemin/max/now`, `aria-valuetext`, and Left/Right arrow handlers. Individual day dots should also be focusable `<button>`s. |
| O4 | Form inputs set `outline:none` inline (login email/password, register, forgot, AI chat, vitals inputs, card-name, etc.) with no replacement focus style. Keyboard users cannot see where focus is. | 2.4.7 Focus Visible | 🔴 Critical | Remove `outline:none` **or** add a `:focus-visible { outline:2px solid var(--teal); outline-offset:2px; }` style that applies project-wide. |
| O5 | Touch targets below 44×44 CSS px: day-count `-`/`+` buttons are **26×26** (line 328/330); OTP boxes `.vc` are **44×52** (pass); `.csend`/`.ai-send-btn` are **36–38px**; close/back buttons are **32×32**; `.addbtn` bottom padding ~30px total. | 2.5.5 Target Size | 🟡 Major | Increase to at least 44×44 (or add an invisible expanded hit area). |
| O6 | AI chat overlay (`#ai-chat-overlay`) opens a modal panel but there's no focus trap, no `role="dialog"`/`aria-modal="true"`, and focus is not moved into the panel or returned to the FAB on close. Escape key isn't bound. | 2.1.2 No Keyboard Trap / 2.4.3 Focus Order | 🟡 Major | Add `role="dialog" aria-modal="true" aria-labelledby="..."`, trap Tab focus inside while open, bind Escape to close, and restore focus to the FAB on dismiss. |
| O7 | Auto-advancing OTP inputs (`vc1…vc6`) move focus programmatically on `oninput`. This is predictable once known but can disorient screen reader / switch users. | 3.2.2 On Input | 🟡 Major | Announce the behavior (e.g. `aria-describedby` on the group) or allow a single `<input inputmode="numeric" maxlength="6">`. |
| O8 | Logical tab order is affected by `onclick` divs being skipped — users may Tab through inputs, then find no way to reach tabs/cards/links. | 2.4.3 Focus Order | 🟡 Major | Fixed by O1/O2. Verify full-page Tab walk after. |
| O9 | Horizontal chip rows (`.chips`, `ai-prompts`, `.dscroll`) scroll on overflow but have no keyboard scroll affordance or visible scroll hint for sighted keyboard users. | 2.1.1 (supporting) | 🟢 Minor | Ensure each chip is a `<button>` so Tab moves through them; consider left/right arrow keys. |

### Understandable

| # | Issue | WCAG Criterion | Severity | Recommendation |
|---|-------|----------------|----------|----------------|
| U1 | `<label>` elements are visually placed but **not programmatically associated** with inputs (no `for=` attribute, not wrapping). Affects Email/Password on login (957/961), register fields (1003/1007/1012/1026), forgot-email (1084), "Card name" (810), "Disease type" (815). | 1.3.1 Info & Relationships / 3.3.2 Labels | 🔴 Critical | Add `for="login-email"` etc. to each label (or wrap the input inside the label). |
| U2 | AI chat input (`#ai-input`, line 410), vitals numeric inputs (`#v-sys`, `#v-dia`, `#v-hr`, `#v-spo2`, `v-glucose`), temperature `#tin`, and the file picker have **only `placeholder`** — no label, no `aria-label`. Placeholder disappears on input and isn't a label. | 3.3.2 Labels or Instructions | 🟡 Major | Add a visible `<label for="...">` or `aria-label` on each input. |
| U3 | OTP boxes `vc1…vc6` have no group label; a screen-reader user hears "edit text" six times. | 1.3.1 / 3.3.2 | 🟡 Major | Wrap in `<fieldset>` + `<legend>Verification code</legend>` (can be visually-hidden) or add `role="group" aria-label="Enter 6-digit code"`. |
| U4 | Login error region `#login-err` is populated dynamically but has no `role="alert"` / `aria-live`. Screen readers won't announce failures. | 3.3.1 Error Identification | 🟡 Major | Add `role="alert"` (or `aria-live="polite"`). |
| U5 | "Demo: any email + password works" hint is a sibling div, not linked to the inputs. | 3.3.2 Instructions | 🟢 Minor | Associate via `aria-describedby` to the password field. |
| U6 | Password field has no strength-meter announcement (only visual via `checkPwStrength`). | 3.3.1 (supporting) | 🟢 Minor | Add `aria-live="polite"` on the strength indicator. |

### Robust

| # | Issue | WCAG Criterion | Severity | Recommendation |
|---|-------|----------------|----------|----------------|
| R1 | Only **one** `aria-*` attribute exists in the entire file (`aria-label="7 day recovery progress"` on the track). No other landmarks, roles, or live regions. | 4.1.2 Name, Role, Value | 🔴 Critical | Audit every interactive element and assign a correct role + accessible name. |
| R2 | Map filter buttons (`.mf-btn`) have no `aria-pressed`; user can't tell which filter is active via SR. | 4.1.2 | 🟡 Major | Add `aria-pressed="true|false"` and toggle with state. |
| R3 | Log tabs (`.log-tab`, line 225–228) are styled as tabs but lack `role="tab"`, `role="tablist"`, `role="tabpanel"`, `aria-controls`, `aria-selected`. | 4.1.2 | 🟡 Major | Apply full ARIA tabs pattern, or use native `<button>`s that toggle `hidden`. |
| R4 | No landmark structure: no `<main>`, `<nav>`, `<header>` — everything is `<div>`. | 1.3.1 | 🟢 Minor | Wrap the tab bar in `<nav aria-label="Primary">` and the screen area in `<main>`. |

---

## Color Contrast Check (key pairs)

| Element | Foreground | Background | Ratio | Required | Pass? |
|---------|------------|------------|-------|----------|-------|
| `.qbtn-s` caption (11px) | `#9a9890` | `#fff` | ~2.7:1 | 4.5:1 | ❌ |
| `.dcdate` date (12px) | `#9a9890` | `#fff` | ~2.7:1 | 4.5:1 | ❌ |
| `.recovery-date` (12px) | `#98a1ad` | `#fff` | ~2.5:1 | 4.5:1 | ❌ |
| `.dsl` stats label (10px, .65 opacity) | white @ 65% | `#0a3d2e`–`#1d9e75` gradient | ~5.3:1 | 4.5:1 | ✅ |
| `.ri` legend text (10px, .85 opacity) | white @ 85% | dark teal gradient | ~7.1:1 | 4.5:1 | ✅ |
| `#map-src-lbl` (10px, .6 opacity) | white @ 60% | dark teal gradient | ~4.1:1 | 4.5:1 | ❌ |
| `.sec-lbl` (13px) | `#9a9890` | `#fff` | ~2.7:1 | 4.5:1 | ❌ |
| Recovered button text | `#0d9e7a` | `#e0f5ee` | ~3.6:1 | 4.5:1 | ❌ (large-bold: 3:1, this is 11px bold = still fails) |
| Primary body text | `#1c1c1a` | `#fff` | ~17:1 | 4.5:1 | ✅ |
| `.tag.t-covid` (11px) | `#e24b4a` | `#fcebeb` | ~3.5:1 | 4.5:1 | ❌ |
| `.tag.t-ok` (11px) | `#1d9e75` | `#e0f5ee` | ~3.1:1 | 4.5:1 | ❌ |
| CDC tip copy (15px bold) | `#1c1c1a` | `#b8ece5` | ~14:1 | 4.5:1 | ✅ |
| Form input border | `rgba(0,0,0,.1)` | `#f7f6f2` | ~1.3:1 | 3:1 | ❌ |

## Keyboard Navigation (expected vs current)

| Element | Tab Order | Enter/Space | Escape | Arrow Keys |
|---------|-----------|-------------|--------|------------|
| Bottom tabs (Home/Cards/Support/Profile) | **skipped** (divs) | no | — | — |
| Recent health cards (`.rc`) | **skipped** (divs) | no | — | — |
| "Forgot password?" / "Sign up" links | **skipped** (spans) | no | — | — |
| Recovery-track slider | **skipped** (div) | no | — | **no** |
| AI chat FAB | **skipped** (div) | no | — | — |
| AI chat overlay (open) | no focus trap | — | **no** (should close) | — |
| OTP boxes (`.vc`) | ✅ reachable | ✅ | — | auto-advances on input |
| Form inputs (email/pw) | ✅ reachable | ✅ (Enter bound) | — | — |
| Buttons (`<button>` real ones) | ✅ reachable | ✅ | — | — |

## Screen Reader (representative announcements)

| Element | Announced As | Issue |
|---------|--------------|-------|
| Close button (×) on AI chat | "button" | No accessible name — add `aria-label="Close chat"` |
| Send button (paper-plane) | "button" | Add `aria-label="Send message"` |
| US map SVG | nothing | Add `role="img"` + `aria-label`; provide text fallback |
| Bottom tab "Home" | not announced (div) | Make a real button/tab; screen reader gets "Home, tab, selected" when correct |
| Recovery track | "7 day recovery progress, group" | Rebuild as `role="slider"` with `aria-valuenow`/`aria-valuetext="Day 3, severe"` |
| Login error (empty at load, text injected) | silent on change | Add `role="alert"` so the error is announced |
| Tag chips (COVID+, Flu A+, Recovered) | "COVID+" | Fine — text is visible; but confirm color-only severity isn't the only cue |

---

## Priority Fixes

1. **Replace `<div onclick>` with real `<button>`/`<a>` across tabs, card rows, and text-links** (O1, O2) — affects every keyboard and screen-reader user and blocks the primary navigation path.
2. **Restore a visible focus indicator** (O4) — delete the blanket `outline:none` or replace it with a `:focus-visible` rule. One-line fix, massive impact.
3. **Associate every label with its input** (U1) via `for=`/`id` — enables voice control, screen readers, and larger click targets for motor-impaired users.
4. **Name your icon-only buttons and the map SVG** (P2, P3, R1) — add `aria-label` to close, send, back, chat FAB, map.
5. **Rebuild the recovery-track slider with `role="slider"` + keyboard support** (O3, R1) — currently completely inaccessible to anyone not using touch/mouse.
6. **Lift low-contrast text to AA** (P1, P4, tag colors) — update `--g3` and the tag colors; re-verify at 4.5:1.
7. **Enlarge touch targets to 44×44** (O5) — day-count +/-, close/back buttons.
8. **Make the AI chat overlay a proper dialog** (O6) — `role="dialog"`, focus trap, Escape-to-close, return focus to FAB.
9. **Add `role="alert"` to the login error region** (U4) so authentication failures are announced.

## Next Steps

- Run an automated scanner (axe DevTools / Lighthouse) after the priority fixes to catch what a static audit can miss.
- Manual pass with VoiceOver (iOS) and NVDA (Windows) to verify the tab bar, modal, and slider flows.
- Verify at 200% zoom — the fixed-width `.phone` (390×760) container may cause horizontal scroll or truncation.
