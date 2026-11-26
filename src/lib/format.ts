import { DOMAIN_LABELS, tr } from '../i18n';
import type { Lang, ScreeningSession } from '../types';
import type { AgeResult } from './age';
import { parseISODate } from './age';
import type { ModuleResult } from './modules';
import type { ScreeningResult } from './scoring';

const MONTHS: Record<Lang, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ms: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'],
};

export function formatDate(iso: string, lang: Lang): string {
  const d = parseISODate(iso);
  if (!d) return iso || '-';
  return `${d.getDate()} ${MONTHS[lang][d.getMonth()]} ${d.getFullYear()}`;
}

export function formatAge(a: AgeResult, lang: Lang): string {
  const parts: string[] = [];
  if (a.years) parts.push(`${a.years} ${tr(lang, 'years')}`);
  parts.push(`${a.months} ${tr(lang, 'months')}`);
  parts.push(`${a.days} ${tr(lang, 'days')}`);
  return `${parts.join(' ')} (${a.totalMonths} ${tr(lang, 'months')})`;
}

/**
 * Recommendations are based only on the presence of particular responses or parent concerns.
 * No percentage thresholds and no classification of the child.
 */
export function buildRecommendations(r: ScreeningResult, s: ScreeningSession, lang: Lang, mods: ModuleResult[] = []): string[] {
  const out: string[] = [];
  if (s.concerns.trim() || s.concernDomains.length) out.push(tr(lang, 'recConcerns'));
  if (r.domainsWithNotYet.length) {
    out.push(tr(lang, 'recNotYet', { domains: r.domainsWithNotYet.map((d) => DOMAIN_LABELS[d][lang]).join(', ') }));
  }
  if (r.hasClarify) out.push(tr(lang, 'recClarify'));
  const sensory = mods.find((m) => m.module.id === 'sensory');
  if (sensory?.anyFrequent) {
    out.push(tr(lang, 'recSensory', { cats: sensory.categories.filter((c) => c.frequent.length).map((c) => c.category.label[lang]).join(', ') }));
  }
  const learning = mods.find((m) => m.module.id === 'learning');
  if (learning?.anyFrequent) {
    const cats = [...learning.categories].filter((c) => c.frequent.length).sort((a, b) => b.frequent.length - a.frequent.length);
    out.push(tr(lang, 'recLearning', { cats: cats.map((c) => c.category.label[lang]).join(', ') }));
  }
  out.push(tr(lang, 'recGeneral'));
  out.push(tr(lang, 'recRescreen'));
  out.push(tr(lang, 'recLoss'));
  return out;
}
