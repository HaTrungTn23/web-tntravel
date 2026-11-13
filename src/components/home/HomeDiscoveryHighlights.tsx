import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, CalendarDays, MapPin } from "lucide-react";
import { festivalStories, foodStories, localizeCultureStory } from "@/data/cultureCatalog";
import { teaBrands } from "@/data/teaBrands";
import type { Locale } from "@/i18n/config";
import styles from "./HomeDiscoveryHighlights.module.css";

type Props = {
  locale: Locale;
};

const copy = {
  vi: {
    introLabel: "Khám phá xứ Trà",
    introTitle: "Không chỉ có những điểm đến",
    introBody: "Từ mâm cơm bản địa, nhịp hội theo mùa đến những thức trà làm quà, mỗi lát cắt mở ra một cách khác để cảm nhận Thái Nguyên.",
    foodTitle: "Nếm câu chuyện của vùng đất",
    foodBody: "Những món ăn được lưu truyền qua gian bếp, mùa vụ và ký ức của cộng đồng.",
    foodCta: "Khám phá thêm",
    festivalTitle: "Hẹn nhau theo mùa lễ hội",
    festivalBody: "Theo dấu nghi lễ, trò diễn và những cuộc gặp gỡ cộng đồng trên khắp vùng đất chè.",
    festivalCta: "Khám phá thêm",
    teaTitle: "Chọn một thức trà để mang về",
    teaBody: "Một tuyển chọn nhỏ từ các vùng trà tiêu biểu, dành cho thưởng thức hằng ngày, trải nghiệm và làm quà.",
    teaCta: "Khám phá thêm",
    product: "Sản phẩm tiêu biểu",
  },
  en: {
    introLabel: "Discover tea country",
    introTitle: "There is more beyond the destinations",
    introBody: "Local dishes, seasonal celebrations and teas to take home each offer a different way to experience Thai Nguyen.",
    foodTitle: "Taste the stories of the land",
    foodBody: "Recipes carried through family kitchens, harvest seasons and community memory.",
    foodCta: "Explore more",
    festivalTitle: "Meet again in festival season",
    festivalBody: "Follow rituals, performances and community gatherings across the tea country.",
    festivalCta: "Explore more",
    teaTitle: "Choose a tea to take home",
    teaBody: "A small selection from signature tea regions, for daily drinking, experiences and gifts.",
    teaCta: "Explore more",
    product: "Featured product",
  },
  ru: {
    introLabel: "Откройте чайный край",
    introTitle: "Здесь есть больше, чем достопримечательности",
    introBody: "Местная кухня, сезонные праздники и чай в подарок помогают по-разному почувствовать Тхайнгуен.",
    foodTitle: "Попробуйте истории этого края",
    foodBody: "Блюда, которые сохраняются в домашних кухнях, сезонных обычаях и памяти общин.",
    foodCta: "Узнать больше",
    festivalTitle: "Встретимся в сезон праздников",
    festivalBody: "Обряды, представления и встречи общин по всему чайному краю.",
    festivalCta: "Узнать больше",
    teaTitle: "Выберите чай с собой",
    teaBody: "Небольшая подборка из известных чайных регионов для каждого дня, знакомства и подарка.",
    teaCta: "Узнать больше",
    product: "Избранный продукт",
  },
} satisfies Record<Locale, Record<string, string>>;

const featuredFoods = [
  { storyId: "banh-chung-bo-dau", articleId: "tn-001" },
  { storyId: "banh-ngai", articleId: "tn-002" },
  { storyId: "banh-trung-kien", articleId: "tn-003" },
];

const featuredTeaIds = ["haodat", "huongvan", "khecoc", "labang"];

export function HomeDiscoveryHighlights({ locale }: Props) {
  const text = copy[locale];
  const foods = featuredFoods.flatMap(({ storyId, articleId }) => {
    const story = foodStories.find((item) => item.id === storyId);
    return story ? [{ ...localizeCultureStory(story, locale), articleId }] : [];
  });
  const festivals = festivalStories.slice(0, 4).map((story) => localizeCultureStory(story, locale));
  const teas = featuredTeaIds.flatMap((id) => {
    const brand = teaBrands.find((item) => item.id === id);
    return brand ? [brand] : [];
  });

  return (
    <div className={styles.discovery}>
      <header className={styles.discoveryIntro}>
        <p className={styles.introLabel}>{text.introLabel}</p>
        <div>
          <h2>{text.introTitle}</h2>
          <p>{text.introBody}</p>
        </div>
      </header>

      <section className={styles.foodSection} aria-labelledby="home-food-title">
        <div className={styles.sectionHeading}>
          <div>
            <h2 id="home-food-title">{text.foodTitle}</h2>
            <p>{text.foodBody}</p>
          </div>
          <Link href="/cuisine" className={styles.sectionLink}>
            {text.foodCta} <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.foodMosaic}>
          {foods.map((food, index) => (
            <Link
              href={`/explore/food/${food.articleId}`}
              className={index === 0 ? styles.foodLead : styles.foodCard}
              key={food.id}
            >
              <Image
                src={`/api/culture-image/${food.articleId}?index=${index === 0 ? 0 : 1}`}
                alt={food.title}
                fill
                sizes={index === 0 ? "(max-width: 820px) 100vw, 62vw" : "(max-width: 820px) 100vw, 38vw"}
              />
              <span className={styles.mediaShade} />
              <span className={styles.foodCopy}>
                <small><MapPin aria-hidden="true" /> {food.region}</small>
                <strong>{food.title}</strong>
                {index === 0 ? <span>{food.summary}</span> : null}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.festivalSection} aria-labelledby="home-festival-title">
        <div className={styles.festivalVisual}>
          <Image
            src={`/api/culture-image/${festivals[0].id}?index=0`}
            alt={festivals[0].title}
            fill
            sizes="(max-width: 900px) 100vw, 44vw"
          />
          <span className={styles.festivalCaption}>{festivals[0].region}</span>
        </div>

        <div className={styles.festivalContent}>
          <div className={styles.festivalHeading}>
            <h2 id="home-festival-title">{text.festivalTitle}</h2>
            <p>{text.festivalBody}</p>
          </div>
          <ol className={styles.festivalList}>
            {festivals.map((festival, index) => (
              <li key={festival.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{festival.title}</strong>
                  <small><CalendarDays aria-hidden="true" /> {festival.season}</small>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/festivals" className={styles.festivalLink}>
            {text.festivalCta} <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className={styles.teaSection} aria-labelledby="home-tea-title">
        <div className={styles.sectionHeading}>
          <div>
            <h2 id="home-tea-title">{text.teaTitle}</h2>
            <p>{text.teaBody}</p>
          </div>
          <Link href="/tea-brands" className={styles.sectionLink}>
            {text.teaCta} <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.teaShelf}>
          {teas.map((tea, index) => (
            <Link href="/tea-brands" className={styles.teaCard} key={tea.id}>
              <span className={styles.teaImage}>
                <Image
                  src={tea.image}
                  alt={tea.imageAlt}
                  fill
                  sizes="(max-width: 720px) 78vw, 300px"
                />
                {index < 2 ? <small><Award aria-hidden="true" /> {tea.certHighlight}</small> : null}
              </span>
              <span className={styles.teaCopy}>
                <small>{tea.region}</small>
                <strong>{tea.shortName}</strong>
                <span>{text.product}: {tea.featuredProduct.name}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
