import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentUser(): Promise<User | null> {
  const client = await createSupabaseServerClient();
  if (!client) return null;
  const { data: { user }, error } = await client.auth.getUser();
  return error ? null : user;
}
