import { NextResponse, type NextRequest } from "next/server";
import {
  verifyCredentials,
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth";
import { jsonError } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "");
  if (!email || !password) return jsonError("Email and password are required");

  const ok = await verifyCredentials(email, password);
  if (!ok) return jsonError("Invalid email or password", 401);

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
