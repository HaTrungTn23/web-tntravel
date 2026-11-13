"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { foodDocuments, type FoodDocumentKind } from "@/data/foodDocumentCatalog";
import styles from "./explore-culture.module.css";

type Filter = "all" | FoodDocumentKind;

const copy = {
  vi: {
    eyebrow: "Tạp chí ẩm thực",
    title: "34 câu chuyện để đọc và khám phá",
    intro: "Mỗi món ăn, sản vật và địa chỉ được kể lại thành một bài viết có hình ảnh, nội dung đầy đủ và những gợi ý liên quan.",
    search: "Tìm theo tên món, địa danh hoặc nội dung",
    clear: "Xóa từ khóa",
    filters: { all: "Tất cả", specialty: "Món và đặc sản", venue: "Địa chỉ thưởng thức", story: "Câu chuyện bản địa" },
    kinds: { specialty: "Món và đặc sản", venue: "Địa chỉ thưởng thức", story: "Câu chuyện bản địa" },
    result: (count: number) => `${count} bài viết phù hợp`,
    read: "Đọc bài viết",
    words: (count: number) => `${count} từ`,
    more: "Xem thêm bài viết",
    emptyTitle: "Chưa tìm thấy nội dung phù hợp",
    emptyBody: "Hãy thử một tên món khác hoặc quay về xem toàn bộ tư liệu.",
    reset: "Xem tất cả",
  },
  en: {
    eyebrow: "Food library",
    title: "Read all 34 food stories",
    intro: "Each dish, local product and place to eat is presented as a complete visual story with related reading.",
    search: "Search by dish, place or description",
    clear: "Clear search",
    filters: { all: "All", specialty: "Food and produce", venue: "Places to eat", story: "Local stories" },
    kinds: { specialty: "Food and produce", venue: "Places to eat", story: "Local story" },
    result: (count: number) => `${count} matching articles`,
    read: "Read article",
    words: (count: number) => `${count} words`,
    more: "Show more articles",
    emptyTitle: "No matching documents",
    emptyBody: "Try another dish name or return to the full collection.",
    reset: "View all",
  },
  ru: {
    eyebrow: "Гастрономическая библиотека",
    title: "Все 34 гастрономические истории",
    intro: "Каждое блюдо, местный продукт и заведение представлено как полноценная визуальная статья.",
    search: "Поиск по блюду, месту или описанию",
    clear: "Очистить поиск",
    filters: { all: "Все", specialty: "Блюда и продукты", venue: "Где поесть", story: "Местные истории" },
    kinds: { specialty: "Блюда и продукты", venue: "Где поесть", story: "Местная история" },
    result: (count: number) => `Найдено статей: ${count}`,
    read: "Читать статью",
    words: (count: number) => `Слов: ${count}`,
    more: "Показать еще",
    emptyTitle: "Ничего не найдено",
    emptyBody: "Попробуйте другое название или вернитесь ко всей коллекции.",
    reset: "Показать все",
  },
} satisfies Record<Locale, {
  eyebrow: string;
  title: string;
  intro: string;
  search: string;
  clear: string;
  filters: Record<Filter, string>;
  kinds: Record<FoodDocumentKind, string>;
  result: (count: number) => string;
  read: string;
  words: (count: number) => string;
  more: string;
  emptyTitle: string;
  emptyBody: string;
  reset: string;
}>;

const PAGE_SIZE = 8;

function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("vi");
}

export function FoodCatalogExplorer({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = normalizeSearch(query.trim());
    return foodDocuments.filter((document) => {
      if (filter !== "all" && document.kind !== filter) return false;
      if (!normalizedQuery) return true;
      return normalizeSearch(`${document.title} ${document.excerpt} ${document.sourceCategory}`).includes(normalizedQuery);
    });
  }, [filter, query]);

  const visibleDocuments = filteredDocuments.slice(0, visibleCount);

  function selectFilter(nextFilter: Filter) {
    setFilter(nextFilter);
    setVisibleCount(PAGE_SIZE);
  }

  function resetCatalog() {
    setFilter("all");
    setQuery("");
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <section className={styles.catalog} aria-labelledby="food-catalog-title">
      <header className={styles.catalogHeader}>
        <span>{text.eyebrow}</span>
        <h3 id="food-catalog-title">{text.title}</h3>
        <p>{text.intro}</p>
      </header>

      <div className={styles.catalogTools}>
        <label className={styles.catalogSearch}>
          <Search aria-hidden="true" />
          <span className={styles.srOnly}>{text.search}</span>
          <input
            type="search"
            value={query}
            placeholder={text.search}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
          />
          {query ? <button type="button" onClick={() => setQuery("")} aria-label={text.clear}><X aria-hidden="true" /></button> : null}
        </label>

        <div className={styles.catalogFilters} aria-label={text.eyebrow}>
          {(Object.keys(text.filters) as Filter[]).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={filter === item}
              onClick={() => selectFilter(item)}
            >
              {text.filters[item]}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.catalogResult} aria-live="polite">{text.result(filteredDocuments.length)}</p>

      {visibleDocuments.length ? (
        <div className={styles.catalogGrid}>
          {visibleDocuments.map((document, index) => (
            <article className={index % 5 === 0 ? styles.catalogCardWide : undefined} key={document.id}>
              <Link className={styles.catalogCardImage} href={`/explore/food/${document.id}`} tabIndex={-1} aria-hidden="true">
                <Image src={`/api/culture-image/${document.id}`} alt="" fill sizes="(max-width: 620px) 100vw, 50vw" />
              </Link>
              <div className={styles.catalogCardTop}>
                <span>{text.kinds[document.kind]}</span>
                <small>{document.id.toUpperCase()}</small>
              </div>
              <h4><Link href={`/explore/food/${document.id}`}>{document.title}</Link></h4>
              <p>{document.excerpt}</p>
              <div className={styles.catalogCardBottom}>
                <small>{text.words(document.wordCount)}</small>
                <Link href={`/explore/food/${document.id}`}>
                  {text.read}<ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.catalogEmpty}>
          <h4>{text.emptyTitle}</h4>
          <p>{text.emptyBody}</p>
          <button type="button" onClick={resetCatalog}>{text.reset}</button>
        </div>
      )}

      {visibleCount < filteredDocuments.length ? (
        <button className={styles.catalogMore} type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
          {text.more}<span>{Math.min(PAGE_SIZE, filteredDocuments.length - visibleCount)}</span>
        </button>
      ) : null}
    </section>
  );
}
