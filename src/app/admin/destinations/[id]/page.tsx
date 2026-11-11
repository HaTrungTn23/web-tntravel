import { notFound, redirect } from "next/navigation";
import { DestinationEditor } from "@/components/admin/DestinationEditor";
import { destinationRepository } from "@/repositories";
import { getAdminSession } from "@/services/admin/auth";
import { getAdminDestinationContent } from "@/services/content/destinationContent";

export default async function AdminDestinationEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAdminSession();
  if (!session.configured) redirect("/admin");
  if (!session.user) redirect("/admin/login");
  if (!session.isAdmin || !session.client) redirect("/admin");
  const destination = destinationRepository.getById(id);
  if (!destination) notFound();
  const content = await getAdminDestinationContent(destination, session.client);
  return <main className="admin-page"><DestinationEditor destination={{ id: destination.id, name: destination.name, slug: destination.slug }} initialContent={content} /></main>;
}
