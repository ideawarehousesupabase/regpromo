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
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
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

/** Pulls the `code` off a Firebase error without assuming its shape. */
function errorCode(err: unknown): string {
  return typeof err === "object" && err !== null && "code" in err
    ? String((err as { code: unknown }).code)
    : "";
}

/* ------------------------------ signup errors ------------------------------- */

/** Why a sign-up or verification attempt could not go ahead. */
export type EmailLinkFailure = "already-registered" | "needs-email" | "expired" | "unknown";

/** Carries a machine-readable reason so the UI can pick the right screen. */
export class EmailLinkError extends Error {
  readonly reason: EmailLinkFailure;

  constructor(reason: EmailLinkFailure, message: string) {
    super(message);
    this.name = "EmailLinkError";
    this.reason = reason;
  }
}

/* ---------------------------- account existence ----------------------------- */

/**
 * True when a fully registered account already uses this address.
 *
 * Firebase's own `fetchSignInMethodsForEmail` cannot answer this: it is
 * deprecated, and it returns nothing at all once email-enumeration protection
 * is switched on, which is the default for projects created recently. The
 * profile document written at the very end of registration is the reliable
 * signal instead, because it only exists once someone has finished signing up.
 *
 * A half-finished sign-up — link clicked but password never set — leaves no
 * profile behind, so that address stays free to register with again.
 */
export async function accountExists(email: string): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  try {
    const snap = await getDocs(
      query(collection(db, USERS), where("email", "==", email.trim().toLowerCase()), limit(1)),
    );
    return !snap.empty;
  } catch (err) {
    // A failed lookup must never be the reason someone cannot sign up. If the
    // read is refused, fall through and let Firebase arbitrate at link time.
    console.warn("Could not check for an existing account; continuing with sign-up.", err);
    return false;
  }
}

/* ------------------------------ signup: step 1 ------------------------------ */
// Send a verification / sign-in link to the given email address. Firebase
// confirms the user owns the mailbox by requiring them to open this link.

export async function sendSignupLink(email: string): Promise<void> {
  const auth = requireAuth();
  const normalized = email.trim().toLowerCase();

  if (await accountExists(normalized)) {
    throw new EmailLinkError(
      "already-registered",
      "An account already exists for this email address.",
    );
  }

  const actionCodeSettings = {
    // The address rides along in the link so that opening it on a second
    // device can finish sign-in without asking for the email again.
    url: `${window.location.origin}/verify-email?email=${encodeURIComponent(normalized)}`,
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

/** Reads the address the signup link was addressed to, if it carries one. */
function emailFromLink(url: string): string | null {
  try {
    return new URL(url).searchParams.get("email");
  } catch {
    return null;
  }
}

/**
 * Completes the passwordless sign-in from the emailed link. This is what
 * actually proves the user controls the mailbox — Firebase marks the
 * resulting account as `emailVerified`.
 *
 * The address is taken from the link itself first, which is what lets the
 * link work on any device without asking again. Firebase rejects the attempt
 * if that address does not match the one the code was issued for, so trusting
 * the link here cannot be used to sign in as somebody else. Local storage and
 * `emailOverride` remain as fallbacks for links that have had their query
 * string stripped in transit.
 */
export async function completeEmailLinkSignIn(
  url: string,
  emailOverride?: string,
): Promise<string> {
  const auth = requireAuth();
  const email = (
    emailOverride ??
    emailFromLink(url) ??
    localStorage.getItem(PENDING_EMAIL_KEY) ??
    ""
  )
    .trim()
    .toLowerCase();

  if (!email) {
    throw new EmailLinkError(
      "needs-email",
      "We couldn't tell which address this link was sent to.",
    );
  }

  let signedIn;
  try {
    signedIn = await signInWithEmailLink(auth, email, url);
  } catch (err) {
    const code = errorCode(err);
    if (code === "auth/invalid-action-code" || code === "auth/expired-action-code") {
      throw new EmailLinkError("expired", "This link has expired or has already been used.");
    }
    if (code === "auth/invalid-email") {
      throw new EmailLinkError(
        "needs-email",
        "That address doesn't match the one this link was sent to.",
      );
    }
    throw new EmailLinkError("unknown", "We couldn't verify this link.");
  }

  pendingLinkUser = signedIn.user;
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
    throw new EmailLinkError(
      "expired",
      "Your verification link has expired. Request a new one from the sign-up page.",
    );
  }

  // A profile already on file means this account finished registering before.
  // Setting a password now would quietly replace the existing one, so stop.
  if (await readProfile(user.uid)) {
    throw new EmailLinkError("already-registered", "This account is already registered.");
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
    if (errorCode(err) === "auth/user-not-found") return;
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
