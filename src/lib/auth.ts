import {
  EmailAuthProvider,
  isSignInWithEmailLink,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signOut,
  updatePassword,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getDb, getFirebaseAuth, isFirebaseConfigured } from "./firebase";

export interface SessionUser {
  id: string;
  name: string;
  company: string;
  email: string;
}

const USERS = "users";
const SESSION_KEY = "complystep.session";
const PENDING_EMAIL_KEY = "complystep.pendingEmail";

/**
 * Holds the Firebase `User` returned by `completeEmailLinkSignIn` until
 * `finishAccountSetup` consumes it. Using this instead of `auth.currentUser`
 * avoids any ambiguity about whether Firebase has finished propagating the
 * new sign-in state to `currentUser` by the time the password step submits.
 */
let pendingLinkUser: User | null = null;

function requireAuth() {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error(
      "Firebase is not configured. Set the VITE_FIREBASE_* environment variables to enable sign-up and login.",
    );
  }
  return auth;
}

/* ------------------------------ signup: step 1 ------------------------------ */
// Send a verification / sign-in link to the given email address. Firebase
// confirms the user owns the mailbox by requiring them to open this link.

export async function sendSignupLink(email: string): Promise<void> {
  const auth = requireAuth();
  const normalized = email.trim().toLowerCase();

  const actionCodeSettings = {
    url: `${window.location.origin}/verify-email`,
    handleCodeInApp: true,
  };

  await sendSignInLinkToEmail(auth, normalized, actionCodeSettings);
  localStorage.setItem(PENDING_EMAIL_KEY, normalized);
}

/* --------------------------- signup: step 2 (link) --------------------------- */
// Called on the /verify-email landing page.

export function isEmailSignInLink(url: string): boolean {
  const auth = getFirebaseAuth();
  if (!auth) return false;
  return isSignInWithEmailLink(auth, url);
}

/**
 * Completes the passwordless sign-in from the emailed link. This is what
 * actually proves the user controls the mailbox — Firebase marks the
 * resulting account as `emailVerified`. If the link is opened on a
 * different device/browser than it was requested from, `emailOverride`
 * lets the UI ask the user to re-enter their email to confirm it matches.
 */
export async function completeEmailLinkSignIn(
  url: string,
  emailOverride?: string,
): Promise<string> {
  const auth = requireAuth();
  const email = (emailOverride ?? localStorage.getItem(PENDING_EMAIL_KEY) ?? "")
    .trim()
    .toLowerCase();
  if (!email) {
    throw new Error(
      "We couldn't find the email this link was sent to. Enter it below to continue.",
    );
  }

  const credential = await signInWithEmailLink(auth, email, url);
  pendingLinkUser = credential.user;
  localStorage.removeItem(PENDING_EMAIL_KEY);
  return email;
}

/* -------------------------- signup: step 3 (password) ------------------------ */
// Called right after completeEmailLinkSignIn, once the user has proven
// mailbox ownership. Sets the account's password and creates its profile
// record. Note: email-link sign-in and email/password sign-in both live
// under Firebase's single "password" provider, so the account already has
// that provider attached at this point — we set the password on it with
// updatePassword rather than linking a second "password" credential (which
// Firebase rejects with auth/provider-already-linked).

export interface FinishSignupInput {
  name: string;
  company: string;
  password: string;
}

export async function finishAccountSetup(input: FinishSignupInput): Promise<SessionUser> {
  const auth = requireAuth();
  const user = pendingLinkUser ?? auth.currentUser;
  if (!user || !user.email) {
    throw new Error("Your verification link has expired. Request a new one from the sign-up page.");
  }

  await updatePassword(user, input.password);
  pendingLinkUser = null;

  const name = input.name.trim();
  const company = input.company.trim();
  await writeProfile(user.uid, { name, company, email: user.email });

  const session: SessionUser = { id: user.uid, name, company, email: user.email };
  saveSession(session);
  return session;
}

/* ----------------------------------- login ----------------------------------- */

export async function login(email: string, password: string): Promise<SessionUser> {
  const auth = requireAuth();
  const normalized = email.trim().toLowerCase();

  let credentialUser: User;
  try {
    credentialUser = (await signInWithEmailAndPassword(auth, normalized, password)).user;
  } catch {
    throw new Error("Invalid credentials.");
  }

  const profile = await readProfile(credentialUser.uid);
  const session: SessionUser = {
    id: credentialUser.uid,
    name: profile?.name ?? credentialUser.email ?? normalized,
    company: profile?.company ?? "",
    email: credentialUser.email ?? normalized,
  };
  saveSession(session);
  return session;
}

/* ----------------------------- forgot password -------------------------------- */

/**
 * Sends a real Firebase password-reset email. Deliberately does not throw
 * when the account doesn't exist (auth/user-not-found) — the caller should
 * always show the same "check your inbox" message either way, so this
 * can't be used to probe which emails have an account (account
 * enumeration). Other errors (e.g. a malformed email) are rethrown so the
 * UI can surface a real validation error.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  const auth = requireAuth();
  const normalized = email.trim().toLowerCase();
  try {
    await sendPasswordResetEmail(auth, normalized);
  } catch (err) {
    const code = err instanceof Object && "code" in err ? (err as { code: string }).code : "";
    if (code === "auth/user-not-found") return;
    throw err;
  }
}

/* --------------------------------- profile ----------------------------------- */

interface Profile {
  name: string;
  company: string;
  email: string;
}

async function writeProfile(uid: string, profile: Profile): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, USERS, uid), { ...profile, createdAt: serverTimestamp() }, { merge: true });
}

async function readProfile(uid: string): Promise<Profile | null> {
  const db = getDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, USERS, uid));
  return snap.exists() ? (snap.data() as Profile) : null;
}

export async function updateProfile(
  id: string,
  patch: { name: string; company: string },
): Promise<void> {
  const db = getDb();
  if (db) {
    await updateDoc(doc(db, USERS, id), patch);
  }
  const session = getSession();
  if (session && session.id === id) saveSession({ ...session, ...patch });
}

export async function changePassword(
  _id: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const auth = requireAuth();
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("You are not signed in.");

  try {
    await reauthenticateWithCredential(
      user,
      EmailAuthProvider.credential(user.email, currentPassword),
    );
  } catch {
    throw new Error("Current password is incorrect.");
  }
  await updatePassword(user, newPassword);
}

/* ---------------------------------- session --------------------------------- */

export function saveSession(user: SessionUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("complystep:session"));
}

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function logout() {
  const auth = getFirebaseAuth();
  if (auth) void signOut(auth);
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("complystep:session"));
}

export { isFirebaseConfigured };
