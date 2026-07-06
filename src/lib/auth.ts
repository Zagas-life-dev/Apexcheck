import "server-only";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { env } from "@/lib/env";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  verifySessionToken,
  type AdminSession,
} from "@/lib/auth-edge";

export { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken, verifySessionToken };
export type { AdminSession };

export async function verifyCredentials(email: string, password: string): Promise<boolean> {
  if (email.trim().toLowerCase() !== env.auth.adminEmail.trim().toLowerCase()) {
    return false;
  }
  if (env.auth.adminPasswordHash) {
    return bcrypt.compare(password, env.auth.adminPasswordHash);
  }
  if (env.auth.adminPassword) {
    // Dev-only plaintext comparison when no hash is configured.
    return password === env.auth.adminPassword;
  }
  return false;
}

// Reads and verifies the admin session from the request cookies.
export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
