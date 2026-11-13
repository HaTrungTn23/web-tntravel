import rawArticles from "./foodArticles.json";
import type { FoodDocumentKind } from "./foodDocumentCatalog";

export type FoodArticle = {
  id: string;
  title: string;
  text: string;
  sourceUrl: string;
  sourceCategory: string;
  kind: FoodDocumentKind;
  wordCount: number;
  imageUrl: string | null;
};

export const foodArticles = rawArticles as FoodArticle[];

export function getFoodArticle(id: string) {
  return foodArticles.find((article) => article.id === id);
}

export function splitArticleParagraphs(text: string) {
  const sourceParagraphs = text.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);

  return sourceParagraphs.flatMap((paragraph) => {
    if (paragraph.length <= 760) return [paragraph];

    const sentences = paragraph.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [paragraph];
    const chunks: string[] = [];
    let current = "";

    for (const sentence of sentences) {
      if (current && current.length + sentence.length > 680) {
        chunks.push(current);
        current = sentence;
      } else {
        current = current ? `${current} ${sentence}` : sentence;
      }
    }

    if (current) chunks.push(current);
    return chunks;
  });
}
