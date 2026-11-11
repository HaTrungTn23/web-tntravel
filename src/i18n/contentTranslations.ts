import type { Destination } from "@/domain/models";
import type { Locale } from "./config";
import { villageContent } from "@/data/villageContent";
import { craftDestinationContent } from "@/data/craftContent";
import { greenDestinationContent } from "@/data/greenContent";
import { historyDestinationContent } from "@/data/historyContent";
import { teaDestinationContent } from "@/data/teaContent";
import { filesDestinationContent } from "@/data/filesDestinations";

type DestinationTranslation = { name: string; shortDescription: string };

const en: Record<string, DestinationTranslation> = {
  "tan-cuong": { name: "Tan Cuong", shortDescription: "A core destination for exploring the tea culture of Thai Nguyen." },
  "hao-dat": { name: "Hao Dat Cooperative", shortDescription: "A model destination connecting tea culture, hands-on experiences, local products and multilingual content." },
  "khong-gian-tra": { name: "Tan Cuong Tea Culture Space", shortDescription: "A place to discover the stories and cultural setting of local tea." },
  "nui-coc": { name: "Nui Coc Lake", shortDescription: "A nature destination combining tea country with green landscapes." },
  "thai-hai": { name: "Thai Hai Village", shortDescription: "A village experience within the project's connected destination network." },
  "la-bang": { name: "La Bang", shortDescription: "A tea-growing area featured in a journey through several tea regions." },
  "vo-tranh": { name: "Vo Tranh", shortDescription: "A tea-growing area connected to the Tea Culture theme." },
  "ghenh-che": { name: "Ghenh Che Lake", shortDescription: "A green landscape destination in the demonstration data set." },
  "ban-ten": { name: "Ten Village", shortDescription: "A mountain village destination in the project's structured data set." },
  "bao-tang-dan-toc": { name: "Museum of the Cultures of Vietnam's Ethnic Groups", shortDescription: "Exhibitions about culture, architecture, daily life and traditional crafts." },
  "dai-doi-915": { name: "Company 915 Historical Site", shortDescription: "A memorial and historical exhibition dedicated to Company 915." },
  "bo-dau": { name: "Bo Dau Chung Cake Village", shortDescription: "A craft village known for the ingredients and techniques behind traditional chung cakes." },
  "lan-tin-keo": { name: "Tin Keo Shack", shortDescription: "A historical stop within the ATK Dinh Hoa heritage complex." },
  "nha-tuong-niem-atk": { name: "President Ho Chi Minh Memorial House", shortDescription: "A memorial site in the ATK complex at Phu Dinh." },
  "khuon-tat": { name: "Khuon Tat Historical Site", shortDescription: "A heritage landscape within the ATK Dinh Hoa complex." },
  "suoi-kem": { name: "Kem Stream", shortDescription: "A stream landscape on a route combining nature with the La Bang tea region." },
  "hang-phuong-hoang": { name: "Phuong Hoang Cave", shortDescription: "A scenic cave reached by a walking route whose operating conditions should be checked in advance." },
  "suoi-mo-ga": { name: "Mo Ga Stream", shortDescription: "A natural attraction in the Phuong Hoang and Mo Ga area." },
  "xom-mo-ga": { name: "Mo Ga Hamlet", shortDescription: "A place to learn about community life in the Mo Ga area." },
  "pac-ngoi": { name: "Pac Ngoi Village", shortDescription: "A village of stilt houses and community life beside Ba Be Lake." },
  "ho-ba-be": { name: "Ba Be Lake and Fairy Pond", shortDescription: "A group of waterscapes featured on the Ba Be route." },
  "den-an-ma": { name: "An Ma Temple and Ba Goa Island", shortDescription: "A boat-route attraction connected to local stories and traditions." },
};

const ru: Record<string, DestinationTranslation> = {
  "tan-cuong": { name: "Танкыонг", shortDescription: "Главное место для знакомства с чайной культурой провинции Тхайнгуен." },
  "hao-dat": { name: "Кооператив Хаодат", shortDescription: "Образцовая площадка, объединяющая чайную культуру, практические занятия, местные продукты и многоязычные материалы." },
  "khong-gian-tra": { name: "Пространство чайной культуры Танкыонга", shortDescription: "Место для знакомства с историями и культурной средой местного чая." },
  "nui-coc": { name: "Озеро Нуикок", shortDescription: "Природное место, объединяющее чайный край и зелёные пейзажи." },
  "thai-hai": { name: "Деревня Тхайхай", shortDescription: "Знакомство с деревенской жизнью в единой сети туристических мест проекта." },
  "la-bang": { name: "Лабанг", shortDescription: "Чайный район, включённый в маршрут по нескольким зонам выращивания чая." },
  "vo-tranh": { name: "Вотрань", shortDescription: "Чайный район, связанный с тематикой чайной культуры." },
  "ghenh-che": { name: "Озеро Геньче", shortDescription: "Зелёный природный объект в демонстрационном наборе данных." },
  "ban-ten": { name: "Деревня Тен", shortDescription: "Горная деревня в структурированном наборе данных проекта." },
  "bao-tang-dan-toc": { name: "Музей культур народов Вьетнама", shortDescription: "Экспозиции о культуре, архитектуре, повседневной жизни и традиционных ремёслах." },
  "dai-doi-915": { name: "Исторический мемориал роты 915", shortDescription: "Мемориальное пространство и историческая экспозиция, посвящённые роте 915." },
  "bo-dau": { name: "Деревня баньчынг Бодау", shortDescription: "Ремесленная деревня, известная ингредиентами и техникой приготовления традиционных пирогов баньчынг." },
  "lan-tin-keo": { name: "Хижина Тинкео", shortDescription: "Историческое место в комплексе АТК Диньхоа." },
  "nha-tuong-niem-atk": { name: "Мемориальный дом президента Хо Ши Мина", shortDescription: "Мемориальное место в комплексе АТК в Фудине." },
  "khuon-tat": { name: "Исторический комплекс Кхуонтат", shortDescription: "Историко-природное пространство в комплексе АТК Диньхоа." },
  "suoi-kem": { name: "Ручей Кем", shortDescription: "Природный ручей на маршруте, объединяющем природу и чайный район Лабанг." },
  "hang-phuong-hoang": { name: "Пещера Фыонгхоанг", shortDescription: "Живописная пещера с пешим маршрутом, условия работы которого следует уточнять заранее." },
  "suoi-mo-ga": { name: "Ручей Мога", shortDescription: "Природная достопримечательность в районе Фыонгхоанг и Мога." },
  "xom-mo-ga": { name: "Посёлок Мога", shortDescription: "Место для знакомства с жизнью местного сообщества в районе Мога." },
  "pac-ngoi": { name: "Деревня Пакнгой", shortDescription: "Деревня с домами на сваях и общественной жизнью на берегу озера Бабе." },
  "ho-ba-be": { name: "Озеро Бабе и пруд Фей", shortDescription: "Группа водных пейзажей на маршруте по Бабе." },
  "den-an-ma": { name: "Храм Анма и остров Багоа", shortDescription: "Место на лодочном маршруте, связанное с местными историями и традициями." },
};

const translations: Record<Exclude<Locale, "vi">, Record<string, DestinationTranslation>> = { en, ru };

for (const [id, content] of Object.entries(villageContent)) {
  for (const locale of ["en", "ru"] as const) {
    translations[locale][id] = { name: content[locale].cardTitle, shortDescription: content[locale].cardDescription };
  }
}

for (const [id, content] of Object.entries(craftDestinationContent)) {
  for (const locale of ["en", "ru"] as const) {
    translations[locale][id] = { name: content[locale].cardTitle, shortDescription: content[locale].cardDescription };
  }
}

for (const [id, content] of Object.entries(greenDestinationContent)) {
  for (const locale of ["en", "ru"] as const) {
    translations[locale][id] = { name: content[locale].cardTitle, shortDescription: content[locale].cardDescription };
  }
}

for (const [id, content] of Object.entries(historyDestinationContent)) {
  for (const locale of ["en", "ru"] as const) {
    translations[locale][id] = { name: content[locale].cardTitle, shortDescription: content[locale].cardDescription };
  }
}

for (const [id, content] of Object.entries(teaDestinationContent)) {
  for (const locale of ["en", "ru"] as const) {
    translations[locale][id] = { name: content[locale].cardTitle, shortDescription: content[locale].cardDescription };
  }
}

for (const [id, content] of Object.entries(filesDestinationContent)) {
  for (const locale of ["en", "ru"] as const) {
    translations[locale][id] = { name: content[locale].title, shortDescription: content[locale].description };
  }
}

export function getDestinationTranslation(destination: Destination, locale: Locale): DestinationTranslation {
  if (locale === "vi") return { name: destination.name, shortDescription: destination.shortDescription };
  return translations[locale][destination.id] ?? { name: destination.name, shortDescription: destination.shortDescription };
}

export function localizeDestination(destination: Destination, locale: Locale): Destination {
  if (locale === "vi") return destination;
  const localized = getDestinationTranslation(destination, locale);
  return {
    ...destination,
    ...localized,
    media: destination.media.map((item) => ({ ...item, alt: `${localized.name}, ${locale === "en" ? "illustrative image" : "иллюстрация"}` })),
  };
}

export function hasDestinationTranslation(id: string, locale: Exclude<Locale, "vi">) {
  return Boolean(translations[locale][id]);
}
