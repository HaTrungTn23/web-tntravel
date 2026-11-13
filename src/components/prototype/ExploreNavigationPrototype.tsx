"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays, ChevronDown, Compass, Map, PackageOpen, Route, UtensilsCrossed } from "lucide-react";
import { PrototypeSwitcher } from "./PrototypeSwitcher";
import styles from "./explore-navigation-prototype.module.css";

export type PrototypeItem = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export type PrototypeData = {
  destinations: PrototypeItem[];
  food: PrototypeItem[];
  festivals: PrototypeItem[];
};

type SectionKey = keyof PrototypeData;

const sections: Array<{ key: SectionKey; label: string; note: string }> = [
  { key: "destinations", label: "Điểm đến", note: "Bản đồ, vùng trà và cảnh quan" },
  { key: "food", label: "Ẩm thực", note: "Món ngon và sản vật địa phương" },
  { key: "festivals", label: "Lễ hội", note: "Nghi lễ và nhịp hội theo mùa" },
];

const variants = [
  { key: "A", label: "Mega menu biên tập" },
  { key: "B", label: "Popover nhỏ gọn" },
  { key: "C", label: "Cửa sổ xem trước" },
];

function SectionIcon({ section }: { section: SectionKey }) {
  if (section === "food") return <UtensilsCrossed aria-hidden="true" />;
  if (section === "festivals") return <CalendarDays aria-hidden="true" />;
  return <Map aria-hidden="true" />;
}

function chooseCopy(section: SectionKey) {
  if (section === "food") return { kicker: "Ẩm thực Thái Nguyên", title: "Đi qua vùng đất bằng vị giác.", body: "Mỗi món ăn mở ra một câu chuyện về nguyên liệu, làng nghề và cộng đồng địa phương." };
  if (section === "festivals") return { kicker: "Lễ hội Thái Nguyên", title: "Theo nhịp mùa, gặp nhịp người.", body: "Khám phá nghi lễ, trò chơi dân gian và những ngày hội gắn với từng vùng đất." };
  return { kicker: "Điểm đến Thái Nguyên", title: "Mỗi nơi chốn có một câu chuyện.", body: "Tìm vùng trà, hồ xanh, bản làng và các dấu tích lịch sử trên một mặt bằng khám phá riêng." };
}

function Brand() {
  return <div className={styles.brand}><span><Compass aria-hidden="true" /></span><b>THÁI NGUYÊN<small>TRONG TẦM TAY</small></b></div>;
}

function UtilityNav() {
  return <div className={styles.utilityNav}><span><Route aria-hidden="true" />Tạo hành trình</span><span><PackageOpen aria-hidden="true" />Sản phẩm chè</span><span>Của tôi</span></div>;
}

function VariantASurface({ section, data }: { section: SectionKey; data: PrototypeData }) {
  const copy = chooseCopy(section);
  return <main className={styles.aSurface}>
    <div className={styles.aIntro}><span>{copy.kicker}</span><h1>{copy.title}</h1><p>{copy.body}</p></div>
    <div className={styles.aGrid}>
      {data[section].slice(0, 5).map((item, index) => <article className={index === 0 ? styles.aLeadCard : undefined} key={item.id}>
        <Image src={item.image} alt="" fill sizes={index === 0 ? "60vw" : "30vw"} />
        <div><small>{String(index + 1).padStart(2, "0")}</small><h2>{item.title}</h2><p>{item.description}</p></div>
      </article>)}
    </div>
  </main>;
}

export function VariantA({ data }: { data: PrototypeData }) {
  const [section, setSection] = useState<SectionKey>("destinations");
  const [open, setOpen] = useState(true);
  return <div className={`${styles.prototypeRoot} ${styles.variantA}`}>
    <header className={styles.aHeader}>
      <Brand />
      <nav><span>Tạo hành trình</span><button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>Khám phá<ChevronDown aria-hidden="true" /></button><span>Sản phẩm chè</span><span>Của tôi</span></nav>
      {open ? <div className={styles.aMenu}>
        <div className={styles.aMenuHeading}><b>Chọn không gian khám phá</b><small>Ba giao diện độc lập, cùng một hệ sinh thái nội dung</small></div>
        <div className={styles.aMenuGrid}>{sections.map((item, index) => <button type="button" key={item.key} onClick={() => { setSection(item.key); setOpen(false); }}>
          <span className={styles.aMenuImage}><Image src={data[item.key][0].image} alt="" fill sizes="28vw" /></span>
          <span className={styles.aMenuText}><small>0{index + 1}</small><b>{item.label}</b><em>{item.note}</em></span>
        </button>)}</div>
      </div> : null}
    </header>
    <VariantASurface section={section} data={data} />
  </div>;
}

function VariantBSurface({ section, data }: { section: SectionKey; data: PrototypeData }) {
  const copy = chooseCopy(section);
  return <main className={styles.bSurface}>
    <aside><SectionIcon section={section} /><span>{copy.kicker}</span><h1>{copy.title}</h1><p>{copy.body}</p><button type="button">Mở bản đồ nội dung</button></aside>
    <div className={styles.bFeed}>{data[section].map((item, index) => <article key={item.id}>
      <div className={styles.bImage}><Image src={item.image} alt="" fill sizes="(max-width: 760px) 100vw, 38vw" /></div>
      <div><small>{index === 0 ? "Gợi ý bắt đầu" : `Nội dung ${String(index + 1).padStart(2, "0")}`}</small><h2>{item.title}</h2><p>{item.description}</p><span>Khám phá nội dung</span></div>
    </article>)}</div>
  </main>;
}

export function VariantB({ data }: { data: PrototypeData }) {
  const [section, setSection] = useState<SectionKey>("destinations");
  const [open, setOpen] = useState(true);
  return <div className={`${styles.prototypeRoot} ${styles.variantB}`}>
    <header className={styles.bHeader}>
      <Brand />
      <div className={styles.bNavWrap}>
        <button className={styles.bExploreButton} type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}><Compass aria-hidden="true" />Khám phá<ChevronDown aria-hidden="true" /></button>
        {open ? <div className={styles.bMenu}><small>ĐI TỚI</small>{sections.map((item) => <button className={section === item.key ? styles.active : undefined} type="button" key={item.key} onClick={() => { setSection(item.key); setOpen(false); }}><span><SectionIcon section={item.key} /></span><b>{item.label}<small>{item.note}</small></b><em>{data[item.key].length}</em></button>)}</div> : null}
      </div>
      <UtilityNav />
    </header>
    <VariantBSurface section={section} data={data} />
  </div>;
}

function VariantCSurface({ section, data }: { section: SectionKey; data: PrototypeData }) {
  const copy = chooseCopy(section);
  const [lead, ...rest] = data[section];
  return <main className={styles.cSurface}>
    <section className={styles.cHero}>
      <Image src={lead.image} alt="" fill priority sizes="100vw" />
      <div><span>{copy.kicker}</span><h1>{lead.title}</h1><p>{lead.description}</p><button type="button">Bắt đầu khám phá</button></div>
    </section>
    <section className={styles.cJournal}><div><small>TUYỂN CHỌN</small><h2>{copy.title}</h2><p>{copy.body}</p></div><div className={styles.cRail}>{rest.map((item) => <article key={item.id}><div><Image src={item.image} alt="" fill sizes="300px" /></div><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>
  </main>;
}

export function VariantC({ data }: { data: PrototypeData }) {
  const [section, setSection] = useState<SectionKey>("destinations");
  const [open, setOpen] = useState(true);
  const activeSection = sections.find((item) => item.key === section)!;
  return <div className={`${styles.prototypeRoot} ${styles.variantC}`}>
    <header className={styles.cHeader}>
      <Brand />
      <nav><span>Tạo hành trình</span><button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>Khám phá<ChevronDown aria-hidden="true" /></button><span>Sản phẩm chè</span><span>Của tôi</span></nav>
      {open ? <div className={styles.cMenu}>
        <div className={styles.cMenuList}><small>CHỌN CHUYÊN ĐỀ</small>{sections.map((item) => <button type="button" key={item.key} className={section === item.key ? styles.active : undefined} onClick={() => setSection(item.key)}><SectionIcon section={item.key} /><span><b>{item.label}</b><em>{item.note}</em></span></button>)}</div>
        <div className={styles.cMenuPreview}><Image src={data[section][0].image} alt="" fill sizes="280px" /><div><small>ĐANG CHỌN</small><b>{activeSection.label}</b><button type="button" onClick={() => setOpen(false)}>Mở giao diện</button></div></div>
      </div> : null}
    </header>
    <VariantCSurface section={section} data={data} />
  </div>;
}

export function ExploreNavigationPrototype({ variant, data }: { variant: string; data: PrototypeData }) {
  return <>
    {variant === "B" ? <VariantB data={data} /> : variant === "C" ? <VariantC data={data} /> : <VariantA data={data} />}
    <PrototypeSwitcher variants={variants} current={variant} />
  </>;
}
