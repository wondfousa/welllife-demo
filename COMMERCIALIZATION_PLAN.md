# WELLlife Care — Commercialization Plan

**From HTML/React prototype → App Store + Google Play release**
Prepared: 2026-04-20

---

## 1. Executive summary

### Recommended stack

| Layer | Choice | Why |
|---|---|---|
| **Mobile app** | React Native + Expo (TypeScript) | Reuse your existing React prototype, one codebase → iOS + Android, excellent AI-tooling support, no Mac required for most of the workflow |
| **Backend (day one)** | Supabase (Postgres + Auth + Storage) | Zero-server BaaS; handles auth, cloud sync, row-level security out of the box; free tier covers you for a long time |
| **Backend (custom logic, later)** | Python on AWS Lambda or Supabase Edge Functions | Only if/when you need custom logic (AI symptom checker, integrations, scheduled jobs) |
| **Auth** | Supabase Auth (email/password + OAuth) | Included in Supabase, handles password reset, email verification |
| **Analytics** | PostHog or Amplitude (free tier) | Understand user behavior before scaling |
| **Error monitoring** | Sentry (free tier) | Catch crashes/bugs in production |
| **CI/CD + builds** | EAS (Expo Application Services) | Build iOS/Android binaries in the cloud, no Mac needed |

### Why serverless is the right call

You explicitly noted low expected volume for a long time. That is textbook BaaS/FaaS territory:

- No server to patch, monitor, or scale.
- Pay-for-what-you-use — effectively free at low volume.
- You only bring in a "real" backend (Python FastAPI on Lambda / Cloud Run) if/when the BaaS limits bite.

### Why React Native (not Flutter, not native)

- **Reuses your prototype.** The existing `index.html` is already structured around HTML + CSS + vanilla JS in a React-friendly layout. Migrating to React Native is straightforward; component logic maps 1:1.
- **One language (TypeScript) for iOS + Android.** Half the code, half the maintenance burden.
- **Python-team-friendly.** Flutter would force you to learn Dart. Native would force Swift *and* Kotlin.
- **Expo removes the hardest parts.** No Xcode setup, no Android Studio grief on day one. You run `npx expo start`, scan a QR code on your phone, and it's live.
- **AI tooling parity.** Claude/Cursor/Copilot have deep React Native coverage — your iteration speed stays high.

---

## 2. Framework & language decision — detailed rationale

### Mobile: React Native + Expo + TypeScript

**What it is.** React Native lets you write mobile apps in React. Expo is a toolchain on top of React Native that removes the hardest platform-setup pain (native build tools, code signing, push notification plumbing). TypeScript adds types to JavaScript — catches bugs at compile time and makes AI-assisted coding much more accurate.

**Alternatives considered and rejected:**

- **Flutter (Dart).** Slightly better performance and pixel control, but: (a) new language, (b) doesn't reuse your prototype, (c) smaller ecosystem for wellness/health libraries. Not worth the switching cost.
- **Native (Swift + Kotlin).** Best performance and platform integration, but: two codebases, two languages, Mac required. Overkill for a low-volume app.
- **PWA / web wrapper (Capacitor).** Cheapest path, but Apple has been rejecting thin web wrappers that don't feel native. Risky for App Store approval, especially for a health app.
- **Pure web app.** Fine if "app store" is optional. You've said it's not.

### Backend: Supabase (primary), Python FaaS (optional, later)

**Why Supabase over Firebase:**

- **Real Postgres.** SQL you already know (vs. Firestore's NoSQL model).
- **Row-level security (RLS).** Per-user access rules written in SQL, enforced at the DB layer. Perfect for health data.
- **Open-source + self-hostable.** You are never locked in; worst case you migrate to your own Postgres.
- **Generous free tier.** 500MB DB, 50K monthly active users, 1GB storage, 2 free projects.
- **Storage + Auth + Realtime bundled.** No juggling three services.

**When to add Python:** Only when a feature genuinely can't live in Supabase — e.g., an AI-powered symptom analyzer calling the Anthropic API, a PDF generator for a clinician summary, integrations with third-party medical APIs. At that point add a single Python Lambda/Cloud Function. Don't build it proactively.

---

## 3. Target architecture

```
 ┌─────────────────────────────────┐          ┌──────────────────────────────┐
 │   iOS / Android device          │          │   Supabase (managed)         │
 │                                 │          │                              │
 │   React Native app (Expo)       │◀────────▶│  - Postgres DB (user data)   │
 │   - TypeScript                  │  HTTPS   │  - Auth (email + OAuth)      │
 │   - Supabase JS client          │          │  - Storage (images/files)    │
 │   - Secure storage for tokens   │          │  - Row-Level Security        │
 └─────────────────────────────────┘          └──────────────┬───────────────┘
                                                             │ (optional, later)
                                                             ▼
                                              ┌──────────────────────────────┐
                                              │ Python serverless functions  │
                                              │  (AWS Lambda / Supabase      │
                                              │   Edge Functions)            │
                                              │  - AI symptom analysis       │
                                              │  - 3rd-party integrations    │
                                              └──────────────────────────────┘
```

---

## 4. Phased roadmap

### Phase 0 — Foundation (Week 0, 2–4 days)

- Create Apple Developer account ($99/yr) and Google Play developer account ($25 one-time).
- Create Supabase project; set up Postgres schema for user profile + wellness data.
- Create Expo project; confirm it builds and runs on a real phone via Expo Go.
- Set up GitHub repo (you already have `.git` in the folder — good).
- Decide on app icon + splash screen + bundle IDs (e.g., `com.wondfousa.welllife`).

### Phase 1 — Prototype → React Native (Weeks 1–3)

- Audit `index.html`: list every screen, component, and interaction.
- Port global tokens (colors, typography) to a `theme.ts` file.
- Migrate screens one-by-one to React Native components. Most CSS translates directly; Flexbox is the same. Replace HTML tags with `<View>`, `<Text>`, `<Image>`, `<Pressable>`.
- Set up navigation with `expo-router` (file-based routing, very similar to Next.js).
- Keep the prototype running in parallel as a visual reference.

**Definition of done for Phase 1:** app runs on both your iPhone and an Android device, all screens navigable, no backend yet.

### Phase 2 — Auth + cloud sync (Weeks 4–5)

- Design data model (tables + RLS policies). Typical for a wellness app:
  - `profiles` (1:1 with auth.users)
  - `symptoms` / `logs` / `recovery_events`
  - `recommendations`
- Wire up Supabase Auth: email signup, email verification, password reset, optional "Sign in with Apple" (required by Apple if you offer any third-party OAuth).
- Add offline-first caching with TanStack Query + AsyncStorage so the app still works on flaky networks.
- Encrypt sensitive data at rest in the device using `expo-secure-store`.

**Definition of done for Phase 2:** user can sign up, log out, log back in on a different device, and see their data.

### Phase 3 — Platform polish (Weeks 6–7)

- App icons (1024×1024 master, auto-generated for all sizes via Expo).
- Splash screens.
- Permissions strings (Info.plist for iOS, AndroidManifest.xml for Android) — critical for health data.
- Deep links + universal links.
- Dark mode review.
- Accessibility audit (there's already an `accessibility-audit.md` in your repo — fold findings in).
- Internationalization scaffolding (even if you only ship English v1).
- Crash reporting via Sentry.

### Phase 4 — Beta testing (Week 8)

- TestFlight for iOS: invite 20–100 internal testers.
- Google Play Internal Testing track.
- Collect feedback; iterate.

### Phase 5 — Store submission (Weeks 9–10)

Submission gates (especially strict for a health-adjacent app):

- **Privacy policy + terms of service** (required URL fields in both stores). Draft with a lawyer if your app collects symptom/health data.
- **Data safety / App privacy disclosures** (both stores require you declare what data you collect and why).
- **Screenshots** at every required device size.
- **Store listing copy** — title, subtitle, description, keywords. This is where the `ux-copy` design skill earns its keep.
- **Age rating questionnaires.**
- **Demo account credentials** — Apple reviewers will log in as a test user.
- **Medical / health disclaimers** in the app itself if you give any guidance that could be construed as medical advice.

### Phase 6 — Launch (Week 11+)

- Soft launch in 1–2 smaller markets first to catch localization/pricing issues.
- Monitor crash rate, auth error rate, RLS policy violations.
- Roll out to all markets once stable.

---

## 5. Cost estimates (first year, low-volume)

| Item | Cost |
|---|---|
| Apple Developer Program | **$99/yr** (mandatory) |
| Google Play Developer | **$25 one-time** (mandatory) |
| Supabase | **$0** (free tier: 500MB DB, 50K MAU) → $25/mo when you scale |
| Expo / EAS | **$0** (free tier: 30 builds/mo) → $19/mo when building more |
| Sentry | **$0** (free tier: 5K errors/mo) |
| Analytics (PostHog/Amplitude) | **$0** free tier |
| Domain + privacy-policy page | ~$15/yr |
| App icon + marketing design | $0 if DIY, $300–1500 if outsourced |
| Lawyer review of privacy policy | $200–1000 one-time |
| **Year-1 total (DIY)** | **~$115 + optional legal** |

Compare with non-serverless: a managed Postgres + a Fargate container for a FastAPI backend would start at ~$35–60/mo with no users. Your serverless call saves real money.

---

## 6. Risks & things to decide early

| Risk | Mitigation |
|---|---|
| **Health-data regulation (HIPAA, GDPR).** If you store identifiable health data in the US and have any B2B/enterprise ambitions, you'll need HIPAA compliance later. Supabase offers HIPAA tier on Team plan. | Start consumer-only; avoid storing clinical identifiers (no SSN, no provider linkages). Add HIPAA tier only if needed. |
| **Apple rejection for thin/health apps.** Health apps are scrutinized. "Not enough functionality" and "medical claims without evidence" are common rejections. | Make the app meaningfully interactive (you already have symptom tracking + recovery timeline — good). Use "wellness" language, not "medical/diagnostic" language, unless you have clinical evidence. |
| **"Sign in with Apple" requirement.** If you offer Google/Facebook login on iOS, Apple requires you also offer Sign in with Apple. | Either go email-only on v1 or add Sign in with Apple alongside any other OAuth. |
| **Privacy policy URL required.** Cannot submit without one. | Host a simple policy page (GitHub Pages is fine). |
| **Push notification infra.** You said "not needed", but adding later requires code + store config changes. | Leave Expo Notifications boilerplate in place so you can light it up later with minimal churn. |

---

## 7. Open questions for you

1. **Bundle ID / organization name** — is `com.wondfousa.welllife` correct, or a different legal entity?
2. **Does the app provide medical guidance, or only "wellness" tracking?** Dictates App Store category + required disclaimers.
3. **Will users' data be stored in-region (US only / EU only / both)?** Supabase lets you pick the region at project creation — change is painful later.
4. **Do you want a web version alongside?** React Native for Web is feasible from the same codebase; decide now or it's expensive to bolt on.
5. **Monetization?** Free, freemium, subscription, or one-time purchase? Affects store setup (especially IAP).

---

## 8. Immediate next steps (this week)

1. Answer the five open questions above.
2. Enroll in Apple Developer + Google Play Console.
3. Create Supabase project (pick US-East or EU-West based on #3 above).
4. Create Expo TypeScript project, run the starter on a real device.
5. Decide on final app name ("WELLlife Care" appears to be the working name — is it trademark-clear?).

Once those five are settled, Phase 1 (prototype migration) is unblocked and can start immediately.
