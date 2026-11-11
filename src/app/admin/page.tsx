import { redirect } from "next/navigation";
import { Database, ShieldAlert } from "lucide-react";
import { getAdminSession } from "@/services/admin/auth";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session.configured) return <main className="admin-centered"><div className="admin-setup-card"><Database /><h1>Kết nối Supabase</h1><p>Sao chép <code>.env.example</code> thành <code>.env.local</code>, điền URL và publishable key, sau đó chạy migration trong thư mục <code>supabase/migrations</code>.</p><p>Tạo tài khoản trong Supabase Auth rồi thêm UUID của tài khoản vào bảng <code>admin_users</code>.</p></div></main>;
  if (!session.user) redirect("/admin/login");
  if (!session.isAdmin) return <main className="admin-centered"><div className="admin-setup-card"><ShieldAlert /><h1>Tài khoản chưa có quyền</h1><p>Thêm user ID <code>{session.user.id}</code> vào bảng <code>admin_users</code> trong Supabase.</p></div></main>;
  redirect("/admin/destinations");
}
