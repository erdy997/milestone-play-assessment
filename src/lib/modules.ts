import type { FrequencyValue, ModuleCategory, ModuleId, ModuleItem, QuestionBank, ResponseValue, SupplementaryModule } from '../types';
import { FREQUENCY_VALUES } from '../types';

export type FreqCounts = Record<FrequencyValue, number>;
export const emptyFreq = (): FreqCounts => ({ always: 0, often: 0, sometimes: 0, rarely: 0, never: 0, notSure: 0 });

export interface CategoryResult {
  category: ModuleCategory;
  total: number;
  answered: number;
  counts: FreqCounts;
  /** Behaviours reported "often" or "always". */
  frequent: ModuleItem[];
}

export interface ModuleResult {
  module: SupplementaryModule;
  total: number;
  answered: number;
  categories: CategoryResult[];
  anyFrequent: boolean;
}

export function moduleItemsFor(m: SupplementaryModule, months: number): ModuleItem[] {
  // keep category order stable
  return m.categories.flatMap((c) => m.items.filter((i) => i.category === c.id && months >= i.minMonths && months <= i.maxMonths));
}

export function activeModules(bank: QuestionBank, enabled: ModuleId[] | undefined, months: number): SupplementaryModule[] {
  return (bank.modules ?? []).filter((m) => (enabled ?? []).includes(m.id) && moduleItemsFor(m, months).length > 0);
}

export function scoreModule(m: SupplementaryModule, months: number, answers: Record<string, ResponseValue | FrequencyValue>): ModuleResult {
  const its = moduleItemsFor(m, months);
  const categories = m.categories
    .map((category) => {
      const ci = its.filter((i) => i.category === category.id);
      const counts = emptyFreq();
      const frequent: ModuleItem[] = [];
      let answered = 0;
      for (const it of ci) {
        const a = answers[it.id] as FrequencyValue | undefined;
        if (!a || !FREQUENCY_VALUES.includes(a)) continue;
        counts[a]++;
        answered++;
        if (a === 'always' || a === 'often') frequent.push(it);
      }
      return { category, total: ci.length, answered, counts, frequent };
    })
    .filter((c) => c.total > 0);
  return {
    module: m,
    total: its.length,
    answered: categories.reduce((s, c) => s + c.answered, 0),
    categories,
    anyFrequent: categories.some((c) => c.frequent.length > 0),
  };
}

export function scoreModules(bank: QuestionBank, enabled: ModuleId[] | undefined, months: number, answers: Record<string, ResponseValue | FrequencyValue>): ModuleResult[] {
  return activeModules(bank, enabled, months).map((m) => scoreModule(m, months, answers));
}
