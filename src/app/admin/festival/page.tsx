import { redirect } from "next/navigation";
import { FestivalEditor } from "@/components/admin/FestivalEditor";
import { getAdminSession } from "@/services/admin/auth";
import { getAdminFestivalContent } from "@/services/content/festivalContent";

export default async function AdminFestivalPage() {
  const session = await getAdminSession();
  if (!session.configured) redirect("/admin");
  if (!session.user) redirect("/admin/login");
  if (!session.isAdmin || !session.client) redirect("/admin");
  const content = await getAdminFestivalContent(session.client);
  return <main className="admin-page"><FestivalEditor initialContent={content} /></main>;
}
