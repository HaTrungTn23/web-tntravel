import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminSession } from "@/services/admin/auth";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (!session.configured) redirect("/admin");
  if (session.user && session.isAdmin) redirect("/admin/destinations");
  return <main className="admin-centered"><div className="admin-login-panel"><p className="admin-kicker">Khu vực dành cho biên tập viên</p><h1>Đăng nhập quản trị</h1><p>Quản lý nội dung, hình ảnh và video của từng điểm đến.</p><AdminLoginForm /></div></main>;
}
