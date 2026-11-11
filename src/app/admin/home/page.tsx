import { redirect } from "next/navigation";
import { HomeGalleryEditor } from "@/components/admin/HomeGalleryEditor";
import { getAdminSession } from "@/services/admin/auth";
import { getAdminHomeGalleryContent } from "@/services/content/homeGalleryContent";
import { createDefaultHomeHeroSlides } from "@/services/content/homeGalleryContent";
import { getPublishedDestinationContent } from "@/services/content/destinationContent";
import { destinationRepository } from "@/repositories";

export default async function AdminHomePage() {
  const session = await getAdminSession();
  if (!session.configured) redirect("/admin");
  if (!session.user) redirect("/admin/login");
  if (!session.isAdmin || !session.client) redirect("/admin");
  const content = await getAdminHomeGalleryContent(session.client);
  const tanCuong = destinationRepository.getAll().find((destination) => destination.id === "tan-cuong");
  const destinationContent = tanCuong ? await getPublishedDestinationContent(tanCuong) : null;
  const cover = destinationContent?.media.find((item) => item.type === "image" && item.isCover)
    ?? destinationContent?.media.find((item) => item.type === "image");
  const defaultHeroSlides = createDefaultHomeHeroSlides(cover ? { id: cover.id, url: cover.url, alt: cover.alt } : undefined);
  return <main className="admin-page"><HomeGalleryEditor initialContent={content} defaultHeroSlides={defaultHeroSlides} /></main>;
}
