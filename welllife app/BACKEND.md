# WELLlife Care — Firebase Backend Setup

This guide walks you through setting up Firebase as the backend for the
WELLlife Care app. You'll get:

- **Auth**: email/password sign-up, email verification, password reset
- **Firestore**: per-user storage for profile, family members, health
  readings, and chat messages
- **Hosting** (later, optional): if you want a web version

The app currently uses `localStorage` for auth (demo mode). After this
guide, login state and data persist in the cloud and sync across devices.

---

## ⚠️ HIPAA note (read first)

You said "beta with real users soon" and the app stores **health
readings**. Even pre-revenue, the moment you collect identifiable health
data from real users, US law treats that as **PHI** (Protected Health
Information).

Firebase **can** be HIPAA compliant, but only if:

1. You're on the **Blaze (pay-as-you-go) plan**, not Spark
2. You sign a **Business Associate Agreement (BAA)** with Google Cloud
3. You only use HIPAA-eligible services (Auth, Firestore, Cloud Functions,
   Storage are all eligible — but Analytics and Crashlytics are NOT
   without extra config)

For closed beta with friendly testers who consent to demo data, you can
use the free Spark plan and skip the BAA. **Before you onboard any user
who didn't sign a beta-tester waiver, sign the BAA.** Details:
<https://cloud.google.com/security/compliance/hipaa>

I'll flag the few places below where you should turn things OFF until
you're BAA-covered.

---

## Phase 1 — Firebase Console (you do this; ~15 min)

### 1.1 Create the Firebase project

1. Go to <https://console.firebase.google.com> and sign in with your
   Google account
2. Click **Add project**
3. Project name: `welllife-care` (or `welllife-care-beta` to keep prod
   separate later)
4. **Disable Google Analytics for this project** for now — Analytics is
   not HIPAA-eligible by default. You can re-enable later with a
   different config.
5. Click **Create project**, wait ~30 seconds

### 1.2 Enable Authentication

1. Left sidebar → **Build → Authentication** → **Get started**
2. **Sign-in method** tab → click **Email/Password** → toggle **Enable** →
   **Save**
3. (Optional, later) you can also enable **Google** and **Apple** sign-in
   here. Skip for now.
4. **Templates** tab → **Email address verification** → click the pencil
   to customize subject + sender name (e.g., "Verify your WELLlife Care
   email"). Same for **Password reset**. The default works fine for beta.
5. **Settings** tab → **Authorized domains** → make sure `localhost` is
   listed. Capacitor apps connect from `https://localhost` and
   `capacitor://localhost` — these work without being explicitly added
   because Firebase trusts these schemes by default for native SDKs.

### 1.3 Enable Firestore

1. Left sidebar → **Build → Firestore Database** → **Create database**
2. Start in **production mode** (NOT test mode — test mode lets anyone
   read/write your data)
3. Pick a location closest to your users (e.g., `us-east4` or
   `nam5 (multi-region)`). **You cannot change this later.**
4. Click **Enable**
5. After it's created, go to the **Rules** tab. Paste in the contents of
   `firestore.rules` from your project (I created it for you — see Phase
   2.4 below). Click **Publish**.

### 1.4 Register a Web App and get config

1. Click the gear icon (top left, next to "Project Overview") →
   **Project settings**
2. Scroll down to **Your apps** → click the **`</>`** (Web) icon
3. App nickname: `WELLlife Care Web` (this is just an internal label)
4. **Don't** check "Set up Firebase Hosting" — you don't need it for the
   mobile app
5. Click **Register app**
6. You'll see a code snippet with a `firebaseConfig` object — **copy the
   whole object**. It looks like this:

   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "welllife-care.firebaseapp.com",
     projectId: "welllife-care",
     storageBucket: "welllife-care.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abc123def456"
   };
   ```

7. Click **Continue to console**

You'll paste this config into `www/firebase-init.js` in Phase 2 below.

### 1.5 (Optional) Set up Cloud Functions for email-triggered logic

Skip for now. We don't need this for v1. Useful later if you want, e.g.,
a welcome email or a coach summary email.

---

## Phase 2 — Wire Firebase into the app (we do this together)

### 2.1 Files I created for you

```
welllife app/
├── www/
│   ├── firebase-init.js   ← Firebase init + helper functions
│   └── index.html         ← I'll modify this in Phase 3 to use Firebase
├── firestore.rules        ← Security rules (paste into console step 1.3)
└── BACKEND.md             ← this file
```

### 2.2 Paste your config into `www/firebase-init.js`

Open `www/firebase-init.js` and replace the placeholder values at the top
with the `firebaseConfig` object from step 1.4 above.

The file has clear `// REPLACE ME` markers.

### 2.3 Data model (Firestore collections)

Each document path is keyed by the user's auth UID, so users can never
see each other's data. The security rules enforce this.

```
users/{uid}                          ← profile doc
  email: string
  name: string
  createdAt: timestamp
  emailVerified: boolean

users/{uid}/members/{memberId}       ← family members
  name: string
  relationship: string  (e.g. "Mother", "Child")
  avatar: string        (base64 data URL or empty)
  birthYear: number
  createdAt: timestamp

users/{uid}/readings/{readingId}     ← health readings (CDC, strip tests, etc.)
  type: string          (e.g. "strip-test", "cdc-checkin")
  memberId: string      (which family member it's for)
  value: any            (the test result payload)
  notes: string
  createdAt: timestamp

users/{uid}/messages/{messageId}     ← in-app coach/chat
  text: string
  sender: "user" | "coach" | "system"
  createdAt: timestamp
```

### 2.4 Security rules (paste into Firebase Console step 1.3)

The contents of `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // A signed-in user can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;

      // All subcollections (members, readings, messages) inherit
      match /{collection}/{docId} {
        allow read, write: if request.auth != null
                           && request.auth.uid == userId;
      }
    }
  }
}
```

These rules are **deny by default**: nothing is readable unless explicitly
allowed. Users can only access documents under their own UID. You cannot
list all users, see other people's data, or access anything without being
signed in.

---

## Phase 3 — Rewriting the auth code (after you finish Phase 1)

Once you've completed Phase 1 (Firebase project created, auth enabled,
Firestore created, rules pasted, web config copied) and pasted your
config into `www/firebase-init.js`, tell me and I'll do the following:

1. Add `<script>` tags in `www/index.html` for Firebase CDN + our
   `firebase-init.js`
2. Rewrite `doLogin` to use `firebase.auth().signInWithEmailAndPassword`
3. Rewrite `doRegister` to:
   - Create the auth user
   - Send the verification email automatically
   - Create the `users/{uid}` profile document in Firestore
4. Rewrite `vcVerify` (verification screen) to poll for
   `user.emailVerified` after the user clicks the email link
5. Rewrite `forgotSubmit` to use `firebase.auth().sendPasswordResetEmail`
6. Add an `onAuthStateChanged` listener so the app knows on launch whether
   the user is already signed in (no more retyping password every time)
7. Migrate the family-members and readings code to write to Firestore
   instead of localStorage

After my changes, you'll run:

```
npx cap sync android
cd android
.\gradlew.bat installDebug
adb shell am force-stop com.welllife.care
adb shell am start -n com.welllife.care/.MainActivity
```

And test:
- Sign up with a real email address
- Check inbox for verification email
- Click the link, then return to app, tap "I've verified"
- Should land in the home screen
- Force-quit the app and reopen — should auto-login (no password retype)
- Sign out, then "Forgot password" → enter email → check inbox
- Reset password, sign in with the new one

---

## Phase 4 — Before you submit to App Store / Play Store

These are deferred but you'll want them done before going public:

- [ ] **Sign the Firebase BAA** (cloud.google.com → Compliance) before
      onboarding any real user who's storing actual health data
- [ ] **Bundle the Firebase SDK locally** in `www/firebase/` (currently
      loaded from CDN). I'll do this in Phase 3 if you want, or we can
      defer until just before submission.
- [ ] **App Check** to prevent abuse: Firebase Console → App Check →
      register your iOS bundle and Android package, use DeviceCheck (iOS)
      and Play Integrity (Android) as attestation providers
- [ ] **Privacy policy URL** — both stores require this. Even a simple
      static page on a Squarespace/Carrd site works. Must mention what
      data you collect (email, health readings) and that it's stored in
      Google Firebase.
- [ ] **Apple privacy nutrition label** — when you submit to App Store
      Connect, you'll fill out a form declaring what data your app
      collects. Health readings + email + name = several "Yes" answers.

---

## Cost expectations

For beta with <100 users:

- **Auth**: free up to 50,000 monthly active users
- **Firestore**: free tier is 1 GiB stored + 50K reads/day + 20K
  writes/day. For 100 beta users you won't come close to limits.
- **Verification emails**: free, sent by Firebase (no SendGrid setup
  needed for beta)

You'll only start paying when you exceed the Spark plan free tier.

---

## Troubleshooting

**"auth/network-request-failed" on Android** — your phone can't reach
Firebase. Check internet connection. If on a corporate network, Firebase
endpoints might be blocked.

**"auth/operation-not-allowed"** — you didn't enable Email/Password in
the Auth → Sign-in method tab. Go back and enable it.

**Verification email not arriving** — check spam folder. The default
sender is `noreply@welllife-care.firebaseapp.com`. To use your own
domain you'll need Firebase Hosting + a custom email template (defer).

**"Missing or insufficient permissions" reading Firestore** — your
security rules aren't published, or you forgot to sign in before
reading. Check Firestore Console → Rules tab to confirm the rules above
are live.
