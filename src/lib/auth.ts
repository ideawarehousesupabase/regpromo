import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "./firebase";

export interface StoredUser {
  id: string;
  name: string;
  company: string;
  email: string;
  hashedPassword: string;
  createdAt: string;
}

export interface SessionUser {
  id: string;
  name: string;
  company: string;
  email: string;
}

const USERS = "users";
const SESSION_KEY = "complystep.session";
const LOCAL_USERS_KEY = "complystep.users";

/* ---------------------------------- hashing --------------------------------- */

const SALT = "complystep-v1";

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${SALT}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/* ------------------------- local fallback (no firebase) ---------------------- */

function readLocalUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) ?? "[]") as StoredUser[];
  } catch {
    return [];
  }
}

function writeLocalUsers(users: StoredUser[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

/* ----------------------------------- CRUD ----------------------------------- */

async function findByEmail(email: string): Promise<StoredUser | null> {
  const db = getDb();
  if (!db) {
    return readLocalUsers().find((u) => u.email === email) ?? null;
  }
  const snap = await getDocs(query(collection(db, USERS), where("email", "==", email)));
  const first = snap.docs[0];
  return first ? ({ id: first.id, ...first.data() } as StoredUser) : null;
}

export interface SignUpInput {
  name: string;
  company: string;
  email: string;
  password: string;
}

export async function signUp(input: SignUpInput): Promise<SessionUser> {
  const email = input.email.trim().toLowerCase();
  const existing = await findByEmail(email);
  if (existing) throw new Error("An account with this email already exists.");

  const hashedPassword = await hashPassword(input.password);
  const id = crypto.randomUUID();
  const record: StoredUser = {
    id,
    name: input.name.trim(),
    company: input.company.trim(),
    email,
    hashedPassword,
    createdAt: new Date().toISOString(),
  };

  const db = getDb();
  if (db) {
    await setDoc(doc(db, USERS, id), {
      name: record.name,
      company: record.company,
      email: record.email,
      hashedPassword: record.hashedPassword,
      createdAt: serverTimestamp(),
    });
  } else {
    writeLocalUsers([...readLocalUsers(), record]);
  }

  const session = { id, name: record.name, company: record.company, email: record.email };
  saveSession(session);
  return session;
}

export async function login(email: string, password: string): Promise<SessionUser> {
  const user = await findByEmail(email.trim().toLowerCase());
  if (!user) throw new Error("Invalid credentials.");
  const hashed = await hashPassword(password);
  if (hashed !== user.hashedPassword) throw new Error("Invalid credentials.");
  const session = { id: user.id, name: user.name, company: user.company, email: user.email };
  saveSession(session);
  return session;
}

export async function updateProfile(
  id: string,
  patch: { name: string; company: string },
): Promise<void> {
  const db = getDb();
  if (db) {
    await updateDoc(doc(db, USERS, id), patch);
  } else {
    writeLocalUsers(readLocalUsers().map((u) => (u.id === id ? { ...u, ...patch } : u)));
  }
  const session = getSession();
  if (session && session.id === id) saveSession({ ...session, ...patch });
}

export async function changePassword(
  id: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const session = getSession();
  if (!session) throw new Error("You are not signed in.");
  const user = await findByEmail(session.email);
  if (!user) throw new Error("Account not found.");
  if ((await hashPassword(currentPassword)) !== user.hashedPassword) {
    throw new Error("Current password is incorrect.");
  }
  const hashedPassword = await hashPassword(newPassword);
  const db = getDb();
  if (db) {
    await updateDoc(doc(db, USERS, id), { hashedPassword });
  } else {
    writeLocalUsers(readLocalUsers().map((u) => (u.id === id ? { ...u, hashedPassword } : u)));
  }
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
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("complystep:session"));
}

export { isFirebaseConfigured };
