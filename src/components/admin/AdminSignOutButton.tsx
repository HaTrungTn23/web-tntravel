"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminSignOutButton() {
  const router = useRouter();
  return <button className="admin-signout" type="button" onClick={async () => {
    await createSupabaseBrowserClient()?.auth.signOut();
    router.replace("/admin/login"); router.refresh();
  }}><LogOut /> Đăng xuất</button>;
}
