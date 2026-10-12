import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service Role Client - HANYA UNTUK SERVER.
 * JANGAN PERNAH panggil dari client components.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("FATAL: createAdminClient() hanya boleh dipanggil di lingkungan server!");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    if (process.env.NODE_ENV === "production" && typeof process.env.VERCEL !== "undefined") {
      console.warn("[AdminClient] Perhatian: NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum disetel di Vercel.");
    }
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
