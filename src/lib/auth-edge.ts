// Edge-safe auth primitives (JWT only, via jose). Importable from middleware.
// No bcrypt, no next/headers, no "server-only" here.
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { env } from "@/lib/env";

export const SESSION_COOKIE = "apx_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)
const ALG = "HS256";

const secret = new TextEncoder().encode(env.auth.jwtSecret);

export interface AdminSession extends JWTPayload {
  email: string;
  role: "admin";
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ email: env.auth.adminEmail, role: "admin" })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "admin") return null;
    return payload as AdminSession;
  } catch {
    return null;
  }
}
