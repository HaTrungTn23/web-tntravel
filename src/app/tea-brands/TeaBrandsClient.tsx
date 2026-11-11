"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Info,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  teaBrands,
  teaRegions,
  type OccasionKey,
  type TeaBrand,
  type TeaRegionId,
} from "@/data/teaBrands";
import styles from "./tea-brands.module.css";

const OCCASION_LABELS: Record<OccasionKey, string> = {
  daily: "Hằng ngày",
  gift: "Làm quà",
  experience: "Trải nghiệm",
};

type CardVariant = "grid" | "split" | "spotlight";

function TeaBrandCard({
  brand,
  variant = "grid",
}: {
  brand: TeaBrand;
  variant?: CardVariant;
}) {
  const variantClass =
    variant === "spotlight"
      ? styles.brandCardSpotlight
      : variant === "split"
        ? styles.brandCardSplit
        : "";

  return (
    <article className={`${styles.brandCard} ${variantClass}`}>
      <div className={styles.cardMedia}>
        <div className={styles.cardHeroImage}>
          <Image
            src={brand.image}
            alt={brand.imageAlt}
            fill
            sizes={
              variant === "spotlight"
                ? "(max-width: 900px) 100vw, 540px"
                : "(max-width: 680px) 100vw, (max-width: 1050px) 50vw, 390px"
            }
            className={styles.cardImg}
          />
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardTags}>
          <span className={styles.regionPill}>
            <MapPin aria-hidden="true" />
            {brand.region}
          </span>
          {brand.occasions.map((key) => (
            <span key={key} className={styles.occasionPill}>
              {OCCASION_LABELS[key]}
            </span>
          ))}
        </div>

        <div className={styles.cardTitleGroup}>
          <h3>{brand.shortName}</h3>
          <p className={styles.cardLegalName}>{brand.name}</p>
        </div>

        <p className={styles.cardProduct}>
          <span>Tiêu biểu:</span> {brand.featuredProduct.name}
        </p>

        <div className={brand.hasVerifiedCert ? styles.cardCert : styles.cardCertMuted}>
          {brand.hasVerifiedCert ? (
            <BadgeCheck aria-hidden="true" />
          ) : (
            <Info aria-hidden="true" />
          )}
          <span>{variant === "spotlight" ? brand.certification : brand.certHighlight}</span>
        </div>

        {brand.touristNote && (
          <p className={styles.cardTourist}>{brand.touristNote}</p>
        )}

        <div className={styles.cardFooter}>
          <div className={styles.cardPrice}>
            <small>Giá tham khảo, {brand.productCount} sản phẩm</small>
            <b>{brand.price}</b>
          </div>
          <a
            href={brand.website}
            target="_blank"
            rel="noreferrer"
            className={styles.cardLink}
            aria-label={`Xem nguồn thông tin ${brand.name}`}
          >
            Xem nguồn <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

type Props = { initialOccasion?: OccasionKey | null };

function RegionBrandRail({
  regionName,
  brands,
}: {
  regionName: string;
  brands: TeaBrand[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = Math.max(300, track.clientWidth + 22);
    const maxScroll = track.scrollWidth - track.clientWidth;

    if (direction === 1 && track.scrollLeft >= maxScroll - 8) {
      track.scrollTo({ left: 0, behavior: reduceMotion ? "auto" : "smooth" });
      return;
    }
    if (direction === -1 && track.scrollLeft <= 8) {
      track.scrollTo({ left: maxScroll, behavior: reduceMotion ? "auto" : "smooth" });
      return;
    }

    track.scrollBy({
      left: direction * step,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className={styles.railShell}>
      <button
        type="button"
        className={`${styles.railArrow} ${styles.railArrowPrev}`}
        onClick={() => move(-1)}
        aria-label={`Xem các thương hiệu trước của vùng ${regionName}`}
      >
        <ArrowLeft aria-hidden="true" />
      </button>

      <div
        ref={trackRef}
        className={styles.railTrack}
        tabIndex={0}
        aria-label={`Danh sách thương hiệu vùng ${regionName}`}
      >
        {brands.map((brand) => (
          <TeaBrandCard key={brand.id} brand={brand} />
        ))}
      </div>

      <button
        type="button"
        className={`${styles.railArrow} ${styles.railArrowNext}`}
        onClick={() => move(1)}
        aria-label={`Xem các thương hiệu tiếp theo của vùng ${regionName}`}
      >
        <ArrowRight aria-hidden="true" />
      </button>
    </div>
  );
}

export function TeaBrandsClient({ initialOccasion }: Props) {
  const [query, setQuery] = useState("");
  const [occasion, setOccasion] = useState<OccasionKey | null>(
    initialOccasion ?? null
  );
  const [selectedRegion, setSelectedRegion] = useState<TeaRegionId | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("vi");
    return teaBrands.filter((brand) => {
      const matchesRegion = !selectedRegion || brand.regionGroup === selectedRegion;
      const matchesOccasion = !occasion || brand.occasions.includes(occasion);
      if (!q) return matchesRegion && matchesOccasion;
      const hay = `${brand.name} ${brand.shortName} ${brand.region} ${brand.featuredProduct.name} ${brand.featuredProduct.detail} ${brand.certification} ${brand.touristNote ?? ""}`.toLocaleLowerCase("vi");
      return matchesRegion && matchesOccasion && hay.includes(q);
    });
  }, [query, occasion, selectedRegion]);

  const isFiltering = Boolean(query.trim() || occasion || selectedRegion);

  const resetFilters = () => {
    setQuery("");
    setOccasion(null);
    setSelectedRegion(null);
  };

  return (
    <>
      <section className={styles.controlsBand} id="bo-loc" aria-label="Tìm kiếm và lọc thương hiệu trà">
        <div className={styles.container}>
          <div className={styles.controlsPanel}>
            <div className={styles.controlsRowPrimary}>
              <label className={styles.searchField}>
                <Search aria-hidden="true" />
                <span className={styles.srOnly}>Tìm thương hiệu, sản phẩm hoặc vùng trà</span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm theo thương hiệu, sản phẩm, vùng..."
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Xóa từ khóa tìm kiếm"
                    className={styles.clearInputBtn}
                  >
                    <X aria-hidden="true" />
                  </button>
                )}
              </label>

              <div className={styles.filterGroup} role="group" aria-label="Lọc theo mục đích">
                <span className={styles.filterGroupIcon} aria-hidden="true">
                  <SlidersHorizontal />
                </span>
                <button
                  type="button"
                  aria-pressed={occasion === null}
                  onClick={() => setOccasion(null)}
                >
                  Tất cả
                </button>
                {(["daily", "gift", "experience"] as OccasionKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={occasion === key}
                    onClick={() => setOccasion(occasion === key ? null : key)}
                  >
                    {OCCASION_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.controlsRowSecondary}>
              <div className={styles.regionChips} role="group" aria-label="Lọc theo vùng trà">
                <button
                  type="button"
                  aria-pressed={selectedRegion === null}
                  onClick={() => setSelectedRegion(null)}
                >
                  Tất cả vùng
                </button>
                {teaRegions.map((region) => (
                  <button
                    key={region.id}
                    type="button"
                    aria-pressed={selectedRegion === region.id}
                    onClick={() =>
                      setSelectedRegion(selectedRegion === region.id ? null : region.id)
                    }
                  >
                    {region.name}
                  </button>
                ))}
              </div>

              <div className={styles.resultStatus} aria-live="polite">
                <span>
                  {isFiltering
                    ? `Hiển thị ${filtered.length} thương hiệu phù hợp`
                    : `${teaBrands.length} thương hiệu tại ${teaRegions.length} vùng trà`}
                </span>
                {isFiltering && (
                  <button type="button" className={styles.resetBtn} onClick={resetFilters}>
                    Đặt lại
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {isFiltering ? (
        <section className={styles.catalogSection} aria-label="Kết quả tìm kiếm thương hiệu trà">
          <div className={styles.container}>
            {filtered.length === 0 ? (
              <div className={styles.emptyState}>
                <h2>Không tìm thấy thương hiệu phù hợp</h2>
                <p>Hãy thử từ khóa ngắn hơn hoặc đặt lại bộ lọc để xem đầy đủ {teaRegions.length} vùng trà.</p>
                <button type="button" className="button button-primary" onClick={resetFilters}>
                  Xem tất cả thương hiệu
                </button>
              </div>
            ) : (
              <div className={styles.gridThree}>
                {filtered.map((brand) => (
                  <TeaBrandCard key={brand.id} brand={brand} />
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        <div className={styles.regionsStack}>
          {teaRegions.map((region, regionIdx) => {
            const regionBrands = teaBrands.filter(
              (brand) => brand.regionGroup === region.id
            );
            const gridVariant: CardVariant =
              regionBrands.length === 1
                ? "spotlight"
                : regionBrands.length === 2
                  ? "split"
                  : "grid";
            const gridClass =
              regionBrands.length === 1
                ? styles.gridSingle
                : regionBrands.length === 2
                  ? styles.gridTwo
                  : styles.gridThree;

            return (
              <section
                key={region.id}
                id={region.id}
                className={`${styles.regionSection} ${regionIdx % 2 === 1 ? styles.regionTinted : ""}`}
                aria-labelledby={`region-${region.id}`}
              >
                <div className={styles.container}>
                  <header className={styles.regionHeader}>
                    <div className={styles.regionTitleRow}>
                      <h2 id={`region-${region.id}`}>{region.name}</h2>
                      <span className={styles.regionCount}>
                        {regionBrands.length} thương hiệu
                      </span>
                    </div>
                    <p className={styles.regionLead}>
                      {region.tagline}. {region.note}
                    </p>
                  </header>

                  {regionBrands.length > 3 ? (
                    <RegionBrandRail
                      regionName={region.name}
                      brands={regionBrands}
                    />
                  ) : (
                    <div className={gridClass}>
                      {regionBrands.map((brand) => (
                        <TeaBrandCard
                          key={brand.id}
                          brand={brand}
                          variant={gridVariant}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
