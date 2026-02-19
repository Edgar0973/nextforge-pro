// lib/supabaseAdmin.ts
import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  // Do not throw at import-time (will break builds).
  // Log a clear error instead; API routes will guard against null.
  console.error(
    "[supabaseAdmin] Missing Supabase env vars. " +
      "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is undefined. " +
      "Check .env.local for local dev and Vercel project Environment Variables (Production)."
  );
}

// Either export a real client or null; API routes must check it.
export const supabaseAdmin =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;