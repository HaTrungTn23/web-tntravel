import type { SupabaseClient, User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminSession {
  configured: boolean;
  client: SupabaseClient | null;
  user: User | null;
  isAdmin: boolean;
}

export async function getAdminSession(): Promise<AdminSession> {
  if (!isSupabaseConfigured()) return { configured: false, client: null, user: null, isAdmin: false };
  const client = await createSupabaseServerClient();
  if (!client) return { configured: false, client: null, user: null, isAdmin: false };
  const { data: { user } } = await client.auth.getUser();
  if (!user) return { configured: true, client, user: null, isAdmin: false };
  const { data } = await client.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  return { configured: true, client, user, isAdmin: Boolean(data) };
}
