import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, Leaf, ShieldCheck } from "lucide-react";
import { teaBrands, type OccasionKey } from "@/data/teaBrands";
import { TeaBrandsClient } from "./TeaBrandsClient";
import styles from "./tea-brands.module.css";

export const metadata: Metadata = {
  title: "Sản phẩm trà Thái Nguyên",
  description:
    "Khám phá 18 thương hiệu trà tiêu biểu tại Thái Nguyên theo vùng nguyên liệu Tân Cương, Đại Từ, Phú Lương, Bằng Phúc và Vô Tranh.",
};

const VALID_OCCASIONS: OccasionKey[] = ["daily", "gift", "experience"];

function isOccasionKey(value: unknown): value is OccasionKey {
  return VALID_OCCASIONS.includes(value as OccasionKey);
}

export default async function TeaBrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ occasion?: string | string[] }>;
}) {
  const { occasion: rawOccasion } = await searchParams;
  const initialOccasion = isOccasionKey(rawOccasion) ? rawOccasion : null;

  const kheCoc = teaBrands.find((brand) => brand.id === "khecoc")!;
  const haoDat = teaBrands.find((brand) => brand.id === "haodat")!;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <div className="eyebrow">
                <Leaf aria-hidden="true" />
                <span>Cẩm nang trà Thái Nguyên</span>
              </div>
              <h1>
                Mỗi vùng trà, <span className={styles.heroAccent}>một bản sắc riêng.</span>
              </h1>
              <p>
                Khám phá thương hiệu trà Thái Nguyên theo vùng trồng, mục đích thưởng thức và chứng nhận có nguồn.
              </p>
              <a href="#bo-loc" className="button button-primary">
                Khám phá theo vùng <ArrowDown aria-hidden="true" />
              </a>
            </div>

            <div className={styles.heroVisual} aria-hidden="true">
              <div className={styles.heroMainPhoto}>
                <Image
                  src="/images/hero-tea-hills.png"
                  alt="Đồi chè xanh tại Thái Nguyên"
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 420px"
                />
              </div>
              <div className={styles.heroSidePhotos}>
                <div className={styles.heroSubPhoto}>
                  <Image
                    src={kheCoc.image}
                    alt={kheCoc.imageAlt}
                    fill
                    priority
                    sizes="(max-width: 900px) 50vw, 240px"
                  />
                </div>
                <div className={styles.heroSubPhoto}>
                  <Image
                    src={haoDat.image}
                    alt={haoDat.imageAlt}
                    fill
                    sizes="(max-width: 900px) 50vw, 240px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TeaBrandsClient initialOccasion={initialOccasion} />

      <section className={styles.dataNoteSection} aria-labelledby="data-note-heading">
        <div className={styles.container}>
          <div className={styles.dataNoteCard}>
            <div className={styles.dataNoteIcon} aria-hidden="true">
              <ShieldCheck />
            </div>
            <div>
              <h2 id="data-note-heading">Thông tin để khám phá, chưa phải gian hàng</h2>
              <p>
                Nội dung ưu tiên xuất xứ, chứng nhận và kênh chính thức của từng cơ sở. Giá và danh mục sản phẩm là dữ liệu tham khảo tại thời điểm khảo sát tháng 11/2026, không phải báo giá bán hàng trực tiếp.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
