// Three variants of the Explore dropdown and its three peer-level surfaces, switchable via ?variant=.
import { notFound } from "next/navigation";
import { ExploreNavigationPrototype, type PrototypeData } from "@/components/prototype/ExploreNavigationPrototype";
import { destinationRepository } from "@/repositories";
import { foodDocuments } from "@/data/foodDocumentCatalog";
import { festivalStories } from "@/data/cultureCatalog";

export default async function ExploreNavigationPrototypePage({ searchParams }: { searchParams: Promise<{ variant?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { variant: requestedVariant } = await searchParams;
  const variant = ["A", "B", "C"].includes(requestedVariant ?? "") ? requestedVariant! : "A";
  const destinationImages = [
    "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=1400&q=82",
    "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=1400&q=82",
    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1400&q=82",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=82",
    "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=82",
    "https://images.unsplash.com/photo-1523920290228-4f321a939b4c?auto=format&fit=crop&w=1400&q=82",
  ];
  const data: PrototypeData = {
    destinations: destinationRepository.getAll().slice(0, 6).map((item, index) => ({
      id: item.id,
      title: item.name,
      description: item.shortDescription,
      image: destinationImages[index],
    })),
    food: foodDocuments.slice(0, 6).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.excerpt,
      image: `/api/culture-image/${item.id}`,
    })),
    festivals: festivalStories.map((item) => ({
      id: item.id,
      title: item.title.vi,
      description: item.summary.vi,
      image: `/api/culture-image/${item.id}`,
    })),
  };

  return <ExploreNavigationPrototype variant={variant} data={data} />;
}
