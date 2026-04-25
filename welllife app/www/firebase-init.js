// ──────────────────────────────────────────────────────────────────────
//  WELLlife Care — Firebase initialization & helper layer
//  Loaded BEFORE the main <script> in index.html
//  Exposes everything on window.wl so the existing app code can use it.
// ──────────────────────────────────────────────────────────────────────

// ── 1. PASTE YOUR FIREBASE CONFIG HERE ──────────────────────────────
//     Get this from Firebase Console → Project Settings → Your apps →
//     the Web app you registered. See BACKEND.md step 1.4.
const firebaseConfig = {
  apiKey:            "REPLACE_ME_apiKey",
  authDomain:        "REPLACE_ME.firebaseapp.com",
  projectId:         "REPLACE_ME",
  storageBucket:     "REPLACE_ME.appspot.com",
  messagingSenderId: "REPLACE_ME",
  appId:             "REPLACE_ME"
};
// ────────────────────────────────────────────────────────────────────

// Initialize Firebase using the compat SDK (loaded via <script> tags
// in index.html — see Phase 3 of BACKEND.md).
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db   = firebase.firestore();

// Persist auth across app restarts (so users don't re-type password).
// LOCAL = survives app close. SESSION = cleared when app closes.
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Make Firestore work offline (cached writes flush when back online).
db.enablePersistence({ synchronizeTabs: false }).catch(err => {
  // failed-precondition: multiple tabs open. Fine — only one in app.
  // unimplemented: browser doesn't support it (very old WebView). Fine.
  console.warn('Firestore persistence not enabled:', err.code);
});

// ──────────────────────────────────────────────────────────────────────
// Helper layer — these are the functions the app code calls instead of
// touching localStorage. Everything is exposed on window.wl.
// ──────────────────────────────────────────────────────────────────────
window.wl = {
  auth,
  db,

  // ── AUTH ─────────────────────────────────────────────────────────
  currentUser: () => auth.currentUser,

  signUp: async (email, password, displayName) => {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    if (displayName) {
      await cred.user.updateProfile({ displayName });
    }
    // Create the user profile document
    await db.collection('users').doc(cred.user.uid).set({
      email,
      name:           displayName || email.split('@')[0],
      createdAt:      firebase.firestore.FieldValue.serverTimestamp(),
      emailVerified:  false
    });
    // Send verification email
    await cred.user.sendEmailVerification();
    return cred.user;
  },

  signIn: async (email, password) => {
    const cred = await auth.signInWithEmailAndPassword(email, password);
    return cred.user;
  },

  signOut: () => auth.signOut(),

  resetPassword: (email) => auth.sendPasswordResetEmail(email),

  resendVerification: () => {
    const u = auth.currentUser;
    if (!u) throw new Error('not signed in');
    return u.sendEmailVerification();
  },

  // Reload the user object to refresh emailVerified flag after they
  // click the link in the verification email.
  refreshUser: async () => {
    const u = auth.currentUser;
    if (!u) return null;
    await u.reload();
    if (u.emailVerified) {
      await db.collection('users').doc(u.uid)
        .update({ emailVerified: true })
        .catch(() => {}); // ignore if doc doesn't exist yet
    }
    return u;
  },

  // Listener for auth state changes (login/logout/page reload).
  // The app's boot code uses this to decide whether to show the auth
  // screen or the home screen.
  onAuthChange: (cb) => auth.onAuthStateChanged(cb),

  // ── PROFILE ──────────────────────────────────────────────────────
  getProfile: async () => {
    const u = auth.currentUser;
    if (!u) return null;
    const snap = await db.collection('users').doc(u.uid).get();
    return snap.exists ? snap.data() : null;
  },

  updateProfile: async (patch) => {
    const u = auth.currentUser;
    if (!u) throw new Error('not signed in');
    await db.collection('users').doc(u.uid).set(patch, { merge: true });
  },

  // ── FAMILY MEMBERS ───────────────────────────────────────────────
  listMembers: async () => {
    const u = auth.currentUser;
    if (!u) return [];
    const snap = await db.collection('users').doc(u.uid)
      .collection('members').orderBy('createdAt').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  addMember: async (data) => {
    const u = auth.currentUser;
    if (!u) throw new Error('not signed in');
    const ref = await db.collection('users').doc(u.uid)
      .collection('members').add({
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    return ref.id;
  },

  updateMember: async (id, patch) => {
    const u = auth.currentUser;
    if (!u) throw new Error('not signed in');
    await db.collection('users').doc(u.uid)
      .collection('members').doc(id).set(patch, { merge: true });
  },

  deleteMember: async (id) => {
    const u = auth.currentUser;
    if (!u) throw new Error('not signed in');
    await db.collection('users').doc(u.uid)
      .collection('members').doc(id).delete();
  },

  // ── HEALTH READINGS ──────────────────────────────────────────────
  addReading: async (data) => {
    const u = auth.currentUser;
    if (!u) throw new Error('not signed in');
    const ref = await db.collection('users').doc(u.uid)
      .collection('readings').add({
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    return ref.id;
  },

  listReadings: async (memberId) => {
    const u = auth.currentUser;
    if (!u) return [];
    let q = db.collection('users').doc(u.uid).collection('readings')
      .orderBy('createdAt', 'desc').limit(200);
    if (memberId) q = q.where('memberId', '==', memberId);
    const snap = await q.get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  // ── CHAT / MESSAGES ──────────────────────────────────────────────
  sendMessage: async (text, sender = 'user') => {
    const u = auth.currentUser;
    if (!u) throw new Error('not signed in');
    await db.collection('users').doc(u.uid).collection('messages').add({
      text, sender,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  },

  // Subscribe to messages in real-time. Returns an unsubscribe function.
  watchMessages: (cb) => {
    const u = auth.currentUser;
    if (!u) return () => {};
    return db.collection('users').doc(u.uid).collection('messages')
      .orderBy('createdAt').limit(200)
      .onSnapshot(snap => {
        cb(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
  }
};

// Friendly error mapper — Firebase error codes are not user-readable.
window.wl.errorMessage = (err) => {
  const code = (err && err.code) || '';
  const map = {
    'auth/email-already-in-use':     'An account with this email already exists.',
    'auth/invalid-email':            'Please enter a valid email address.',
    'auth/weak-password':            'Password must be at least 6 characters.',
    'auth/user-not-found':           'No account with that email.',
    'auth/wrong-password':           'Incorrect password.',
    'auth/invalid-credential':       'Email or password is incorrect.',
    'auth/too-many-requests':        'Too many attempts. Try again in a few minutes.',
    'auth/network-request-failed':   'No internet connection. Check your network.',
    'auth/user-disabled':            'This account has been disabled.',
    'auth/operation-not-allowed':    'Email sign-in is not enabled. Contact support.',
    'auth/missing-password':         'Please enter your password.'
  };
  return map[code] || (err && err.message) || 'Something went wrong. Please try again.';
};

console.log('[WELLlife] Firebase ready, project =', firebaseConfig.projectId);
