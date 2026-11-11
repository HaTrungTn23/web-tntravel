import { notFound } from 'next/navigation';
import type { Season } from '@/domain/models';
import { DestinationCard } from '@/components/common/DestinationCard';
import { getLocalizedLabels } from '@/lib/labels';
import { destinationRepository } from '@/repositories';
import { getServerLocale } from '@/i18n/server';
import { translate } from '@/i18n/messages';
const seasons: Season[] = ['spring', 'summer', 'autumn', 'winter'];
export function generateStaticParams() { return seasons.map((season) => ({ season })); }
export default async function SeasonPage({ params }: { params: Promise<{ season: string }> }) { const { season: raw } = await params; if (!seasons.includes(raw as Season)) notFound(); const locale = await getServerLocale(); const t = (key: Parameters<typeof translate>[1]) => translate(locale, key); const labels = getLocalizedLabels(locale); const season = raw as Season; const destinations = destinationRepository.getAll().filter((item) => item.seasons.includes(season)); return <div className='page-wrap'><header className='page-intro'><div className='eyebrow'>{t("season.kicker")}</div><h1>{labels.season[season]}<br /><em>{t("season.title")}</em></h1><p>{t("season.body")}</p></header><div className='card-grid'>{destinations.map((item) => <DestinationCard destination={item} key={item.id} />)}</div></div>; }
