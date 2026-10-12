import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service Role Client - HANYA UNTUK SERVER.
 * JANGAN PERNAH panggil dari client components.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("FATAL: createAdminClient() hanya boleh dipanggil di lingkungan server!");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
