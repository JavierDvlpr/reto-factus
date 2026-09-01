/**
 * Supabase Client — Singleton pattern for browser and server environments.
 * Supports Realtime subscriptions via postgres_changes.
 *
 * Configure via .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
 *
 * If env vars are missing, a mock client is returned so the app boots without errors.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/core/config/constants";

// ─── Singleton ────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _client: SupabaseClient<any, "public", any> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSupabaseClient(): SupabaseClient<any, "public", any> {
  if (_client) return _client;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn(
      "[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set. " +
        "Using local in-memory fallback repositories."
    );
    _client = createClient("https://placeholder.supabase.co", "placeholder_key", {
      auth: { persistSession: false },
      realtime: { params: { eventsPerSecond: 0 } },
    });
    return _client;
  }

  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: { eventsPerSecond: 10 },
    },
  });

  return _client;
}

/** Indicates whether Supabase is fully configured. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL !== "https://placeholder.supabase.co"
  );
}

// Named export for convenience
export const supabase = getSupabaseClient();
