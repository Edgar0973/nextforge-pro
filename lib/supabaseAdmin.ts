// lib/supabaseAdmin.ts
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  // Do not throw at import-time (will break builds).
  // Log a clear error instead; server code can guard or use getSupabaseAdmin().
  console.error(
    "[supabaseAdmin] Missing Supabase env vars. " +
      "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is undefined. " +
      "Check .env.local for local dev and your hosting Environment Variables (Production)."
  );
}

// Either export a real client or null; existing code can check it.
export const supabaseAdmin: SupabaseClient | null =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

/**
 * Preferred helper for new code.
 *
 * Usage:
 *   const client = getSupabaseAdmin();
 *   const { data, error } = await client.from("quote_requests").select("*");
 *
 * This will throw a clear runtime error if the env vars are missing,
 * instead of letting you call methods on `null`.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    throw new Error(
      "[supabaseAdmin] Supabase admin client is not initialized. " +
        "Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }
  return supabaseAdmin;
}