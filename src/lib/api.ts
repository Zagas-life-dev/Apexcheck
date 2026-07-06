import { NextResponse } from "next/server";
import { getSession, type AdminSession } from "@/lib/auth";

// Returns the admin session, or null. Use in route handlers under /api that
// mutate protected data (middleware only guards /admin pages, not /api).
export async function requireSession(): Promise<AdminSession | null> {
  return getSession();
}

export function jsonError(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export const unauthorized = () => jsonError("Unauthorized", 401);
