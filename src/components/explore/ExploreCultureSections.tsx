import Image from "next/image";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { festivalStories, foodStories, localizeCultureStory } from "@/data/cultureCatalog";
import { FoodCatalogExplorer } from "./FoodCatalogExplorer";
import styles from "./explore-culture.module.css";

const copy = {
  vi: {
    foodTitle: "Ẩm thực Thái Nguyên",
    foodIntro: "Bốn câu chuyện để bắt đầu, từ thức quà Bờ Đậu đến hương vị núi rừng ATK.",
    festivalTitle: "Nhịp hội theo mùa",
    festivalIntro: "Tìm hiểu nghi lễ, trò chơi và không gian cộng đồng. Hãy xác nhận lịch tổ chức trước chuyến đi.",
    source: "Đọc nguồn tư liệu",
    illustration: "Ảnh minh họa được tạo cho giao diện. Thông tin bài viết dẫn theo Cổng Du lịch Thái Nguyên.",
    season: "Thời điểm trong tư liệu",
  },
  en: {
    foodTitle: "Flavours of Thai Nguyen",
    foodIntro: "Four stories to begin with, from Bo Dau gifts to the mountain flavours of the ATK region.",
    festivalTitle: "Festivals through the seasons",
    festivalIntro: "Explore rituals, games and community spaces. Confirm each festival schedule before travelling.",
    source: "Read the source",
    illustration: "Illustration created for this interface. Article information is sourced from the Thai Nguyen Tourism Portal.",
    season: "Timing in the source",
  },
  ru: {
    foodTitle: "Вкусы Тхайнгуена",
    foodIntro: "Четыре истории: от подарков из Бо Дау до горной кухни региона АТК.",
    festivalTitle: "Праздники по сезонам",
    festivalIntro: "Познакомьтесь с обрядами, играми и жизнью общин. Уточняйте расписание перед поездкой.",
    source: "Открыть источник",
    illustration: "Иллюстрация создана для интерфейса. Сведения взяты с туристического портала Тхайнгуена.",
    season: "Время по источнику",
  },
} satisfies Record<Locale, Record<string, string>>;

function StorySource({ href, label }: { href: string; label: string }) {
  return <a className={styles.sourceLink} href={href} target="_blank" rel="noreferrer">{label}<ArrowUpRight aria-hidden="true" /></a>;
}

function FestivalGallery({ id, title }: { id: string; title: string }) {
  return <div className={styles.festivalGallery}>
    {[0, 1, 2].map((index) => <div key={index}><Image src={`/api/culture-image/${id}?index=${index}`} alt={`${title}, ${index + 1}`} fill sizes="(max-width: 620px) 45vw, 260px" /></div>)}
  </div>;
}

export function ExploreCultureSections({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const foods = foodStories.map((story) => localizeCultureStory(story, locale));
  const festivals = festivalStories.map((story) => localizeCultureStory(story, locale));
  const featuredFood = foods[0];
  const featuredFestival = festivals[0];

  return <div className={styles.cultureRoot}>
    <section id="am-thuc" className={styles.foodSection} aria-labelledby="food-title">
      <div className={styles.container}>
        <header className={styles.sectionHeader}>
          <h2 id="food-title">{text.foodTitle}</h2>
          <p>{text.foodIntro}</p>
        </header>

        <div className={styles.foodFeature}>
          <figure className={styles.foodPhoto}>
            <div className={styles.foodPhotoMedia}><Image src="/images/culture/am-thuc-thai-nguyen.webp" alt={text.foodTitle} fill sizes="(max-width: 760px) 100vw, 58vw" /></div>
            <figcaption>{text.illustration}</figcaption>
          </figure>
          <article className={styles.featureCopy}>
            <div className={styles.storyMeta}><span><MapPin aria-hidden="true" />{featuredFood.region}</span><span><CalendarDays aria-hidden="true" />{featuredFood.season}</span></div>
            <h3>{featuredFood.title}</h3>
            <p>{featuredFood.summary}</p>
            <StorySource href={featuredFood.sourceUrl} label={text.source} />
          </article>
        </div>

        <div className={styles.foodStories}>
          {foods.slice(1).map((story) => <article key={story.id}>
            <div className={styles.storyMeta}><span>{story.region}</span><span>{story.season}</span></div>
            <h3>{story.title}</h3>
            <p>{story.summary}</p>
            <StorySource href={story.sourceUrl} label={text.source} />
          </article>)}
        </div>

        <FoodCatalogExplorer locale={locale} />
      </div>
    </section>

    <section id="le-hoi" className={styles.festivalSection} aria-labelledby="festival-title">
      <div className={styles.container}>
        <header className={styles.sectionHeader}>
          <h2 id="festival-title">{text.festivalTitle}</h2>
          <p>{text.festivalIntro}</p>
        </header>

        <figure className={styles.festivalPhoto}>
          <div className={styles.festivalPhotoMedia}><Image src="/images/culture/le-hoi-thai-nguyen.webp" alt={text.festivalTitle} fill sizes="(max-width: 760px) 100vw, 1240px" /></div>
          <figcaption>{text.illustration}</figcaption>
        </figure>

        <div className={styles.festivalLayout}>
          <article className={styles.festivalFeature}>
            <FestivalGallery id={featuredFestival.id} title={featuredFestival.title} />
            <span>{text.season}</span>
            <strong>{featuredFestival.season}</strong>
            <h3>{featuredFestival.title}</h3>
            <p>{featuredFestival.summary}</p>
            <div className={styles.featureRegion}><MapPin aria-hidden="true" />{featuredFestival.region}</div>
            <StorySource href={featuredFestival.sourceUrl} label={text.source} />
          </article>
          <div className={styles.festivalStories}>
            {festivals.slice(1).map((story) => <article key={story.id}>
              <FestivalGallery id={story.id} title={story.title} />
              <div className={styles.festivalStoryMeta}><span>{story.season}</span><small>{story.region}</small></div>
              <h3>{story.title}</h3>
              <p>{story.summary}</p>
              <StorySource href={story.sourceUrl} label={text.source} />
            </article>)}
          </div>
        </div>
      </div>
    </section>
  </div>;
}
