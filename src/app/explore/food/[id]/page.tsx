import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Clock3, Layers3 } from "lucide-react";
import { foodArticles, getFoodArticle, splitArticleParagraphs } from "@/data/foodArticles";
import { getServerLocale } from "@/i18n/server";
import type { Locale } from "@/i18n/config";
import styles from "./food-article.module.css";

const copy = {
  vi: {
    back: "Quay lại ẩm thực",
    kicker: "Câu chuyện ẩm thực Thái Nguyên",
    words: (count: number) => `${count} từ`,
    readTime: (minutes: number) => `${minutes} phút đọc`,
    category: "Chuyên mục",
    language: "Ngôn ngữ bài viết",
    vietnamese: "Tiếng Việt",
    imageCaption: "Hình ảnh trong tư liệu du lịch Thái Nguyên.",
    related: "Đọc tiếp những câu chuyện liên quan",
    read: "Đọc bài viết",
  },
  en: {
    back: "Back to food stories",
    kicker: "A taste of Thai Nguyen",
    words: (count: number) => `${count} words`,
    readTime: (minutes: number) => `${minutes} min read`,
    category: "Category",
    language: "Article language",
    vietnamese: "Vietnamese",
    imageCaption: "Image from the Thai Nguyen tourism archive.",
    related: "Continue with related stories",
    read: "Read article",
  },
  ru: {
    back: "Назад к гастрономическим историям",
    kicker: "Вкусы Тхайнгуена",
    words: (count: number) => `Слов: ${count}`,
    readTime: (minutes: number) => `Чтение: ${minutes} мин`,
    category: "Категория",
    language: "Язык статьи",
    vietnamese: "Вьетнамский",
    imageCaption: "Изображение из туристического архива Тхайнгуена.",
    related: "Похожие истории",
    read: "Читать статью",
  },
} satisfies Record<Locale, Record<string, string | ((value: number) => string)>>;

export function generateStaticParams() {
  return foodArticles.map((article) => ({ id: article.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = getFoodArticle(id);
  if (!article) return {};
  return {
    title: `${article.title} | Ẩm thực Thái Nguyên`,
    description: splitArticleParagraphs(article.text)[0]?.slice(0, 158),
  };
}

export default async function FoodArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, locale] = await Promise.all([params, getServerLocale()]);
  const article = getFoodArticle(id);
  if (!article) notFound();

  const text = copy[locale];
  const paragraphs = splitArticleParagraphs(article.text);
  const readingMinutes = Math.max(1, Math.ceil(article.wordCount / 220));
  const related = foodArticles
    .filter((candidate) => candidate.id !== article.id && candidate.kind === article.kind)
    .slice(0, 3);

  return (
    <main className={styles.articlePage}>
      <article>
        <header className={styles.hero}>
          <Link className={styles.backLink} href="/explore#am-thuc"><ArrowLeft aria-hidden="true" />{text.back as string}</Link>
          <p className={styles.kicker}>{text.kicker as string}</p>
          <h1>{article.title}</h1>
          <div className={styles.heroMeta}>
            <span><Clock3 aria-hidden="true" />{(text.readTime as (value: number) => string)(readingMinutes)}</span>
            <span><BookOpen aria-hidden="true" />{(text.words as (value: number) => string)(article.wordCount)}</span>
          </div>
        </header>

        <figure className={styles.heroImage}>
          <div><Image src={`/api/culture-image/${article.id}`} alt={article.title} fill priority sizes="(max-width: 760px) 100vw, 1240px" /></div>
          <figcaption>{text.imageCaption as string}</figcaption>
        </figure>

        <div className={styles.articleLayout}>
          <aside className={styles.articleFacts}>
            <Layers3 aria-hidden="true" />
            <dl>
              <div><dt>{text.category as string}</dt><dd>{article.sourceCategory}</dd></div>
              <div><dt>{text.language as string}</dt><dd>{text.vietnamese as string}</dd></div>
            </dl>
          </aside>

          <div className={styles.articleBody}>
            {paragraphs.map((paragraph, index) => (
              <Fragment key={`${article.id}-${index}`}>
                <p className={index === 0 ? styles.lead : undefined}>{paragraph}</p>
                {index === 0 ? (
                  <div className={styles.inlineGallery}>
                    {[1, 2].map((imageIndex) => (
                      <figure key={imageIndex}>
                        <div><Image src={`/api/culture-image/${article.id}?index=${imageIndex}`} alt={`${article.title}, ${imageIndex + 1}`} fill sizes="(max-width: 560px) 100vw, 360px" /></div>
                        <figcaption>{text.imageCaption as string}</figcaption>
                      </figure>
                    ))}
                  </div>
                ) : null}
              </Fragment>
            ))}
          </div>
        </div>
      </article>

      <section className={styles.related} aria-labelledby="related-food-title">
        <h2 id="related-food-title">{text.related as string}</h2>
        <div className={styles.relatedGrid}>
          {related.map((item) => (
            <article key={item.id}>
              <Link className={styles.relatedImage} href={`/explore/food/${item.id}`} tabIndex={-1} aria-hidden="true">
                <Image src={`/api/culture-image/${item.id}`} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" />
              </Link>
              <div>
                <span>{item.sourceCategory}</span>
                <h3><Link href={`/explore/food/${item.id}`}>{item.title}</Link></h3>
                <Link className={styles.relatedLink} href={`/explore/food/${item.id}`}>{text.read as string}<ArrowRight aria-hidden="true" /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
