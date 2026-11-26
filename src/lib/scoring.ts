import type { Answers, AgeBandId, DomainId, L, QuestionBank, QuestionItem, ResponseValue } from '../types';
import { DOMAIN_IDS, RESPONSE_VALUES } from '../types';

export type Counts = Record<ResponseValue, number>;

export interface DomainResult {
  domain: DomainId;
  total: number;
  answered: number;
  counts: Counts;
  achieved: QuestionItem[];
  emerging: QuestionItem[]; // "sometimes"
  notYet: QuestionItem[];
  clarify: QuestionItem[]; // notSure + notObserved
  /** Only when an authorised instrument with official cut-offs is configured. */
  official?: { score: number; label: L | null };
}

export interface ScreeningResult {
  domains: DomainResult[];
  totals: Counts;
  answered: number;
  total: number;
  /** Items flagged for professional review: not yet + inconsistent + unclear. */
  reviewItems: QuestionItem[];
  domainsWithNotYet: DomainId[];
  hasClarify: boolean;
  mode: QuestionBank['scoring']['mode'];
}

export const emptyCounts = (): Counts => ({ achieved: 0, sometimes: 0, notYet: 0, notSure: 0, notObserved: 0 });

export function itemsFor(bank: QuestionBank, band: AgeBandId): QuestionItem[] {
  // keep domain order stable
  return DOMAIN_IDS.flatMap((d) => bank.items.filter((i) => i.band === band && i.domain === d));
}

export function scoreScreening(
  bank: QuestionBank,
  band: AgeBandId,
  answers: Answers,
): ScreeningResult {
  const items = itemsFor(bank, band);
  const totals = emptyCounts();
  const domains: DomainResult[] = DOMAIN_IDS.map((domain) => {
    const di = items.filter((i) => i.domain === domain);
    const counts = emptyCounts();
    const r: DomainResult = { domain, total: di.length, answered: 0, counts, achieved: [], emerging: [], notYet: [], clarify: [] };
    for (const it of di) {
      const a = answers[it.id] as ResponseValue | undefined;
      if (!a || !RESPONSE_VALUES.includes(a)) continue;
      counts[a]++;
      totals[a]++;
      r.answered++;
      if (a === 'achieved') r.achieved.push(it);
      else if (a === 'sometimes') r.emerging.push(it);
      else if (a === 'notYet') r.notYet.push(it);
      else r.clarify.push(it);
    }
    if (bank.scoring.mode === 'points-cutoff') {
      const sc = bank.scoring;
      let score = 0;
      for (const it of di) {
        const a = answers[it.id] as ResponseValue | undefined;
        const p = a && RESPONSE_VALUES.includes(a) ? sc.points[a] : null;
        if (typeof p === 'number') score += p;
      }
      const bands = sc.cutoffs[band]?.[domain] ?? [];
      const sorted = [...bands].sort((x, y) => y.minScore - x.minScore);
      const hit = sorted.find((c) => score >= c.minScore) ?? null;
      r.official = { score, label: hit ? hit.label : null };
    }
    return r;
  });
  const reviewItems = domains.flatMap((d) => [...d.notYet, ...d.emerging, ...d.clarify]);
  return {
    domains,
    totals,
    answered: domains.reduce((s, d) => s + d.answered, 0),
    total: items.length,
    reviewItems,
    domainsWithNotYet: domains.filter((d) => d.notYet.length > 0).map((d) => d.domain),
    hasClarify: domains.some((d) => d.clarify.length > 0),
    mode: bank.scoring.mode,
  };
}
