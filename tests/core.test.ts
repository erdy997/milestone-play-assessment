import { describe, expect, it } from 'vitest';
import { bandForMonths, calculateAge } from '../src/lib/age';
import { scoreScreening, itemsFor } from '../src/lib/scoring';
import { validateBank } from '../src/lib/bank';
import { DEMO_QUESTION_BANK, AGE_BANDS } from '../src/data/demoQuestionBank';
import { DOMAIN_IDS } from '../src/types';
import { pdfSafe, reportFileName } from '../src/lib/pdf';
import { checkPublicUrl } from '../src/components/Admin';

describe('age calculation', () => {
  it('counts completed months', () => {
    expect(calculateAge('2024-01-15', '2024-07-14')!.totalMonths).toBe(5);
    expect(calculateAge('2024-01-15', '2024-07-15')!.totalMonths).toBe(6);
    expect(calculateAge('2020-11-26', '2026-11-26')!.totalMonths).toBe(72);
    expect(calculateAge('2026-11-26', '2026-11-26')!.totalMonths).toBe(0);
  });
  it('handles month-end birthdays and leap years', () => {
    expect(calculateAge('2024-01-31', '2024-02-29')!.totalMonths).toBe(1); // last day of Feb counts
    expect(calculateAge('2024-01-31', '2024-02-28')!.totalMonths).toBe(0);
    expect(calculateAge('2024-02-29', '2025-02-28')!.totalMonths).toBe(12);
    const a = calculateAge('2023-03-10', '2026-11-26')!;
    expect([a.years, a.months, a.days, a.totalMonths]).toEqual([3, 8, 16, 44]);
  });
  it('rejects bad input', () => {
    expect(calculateAge('2026-12-01', '2026-11-26')).toBeNull();
    expect(calculateAge('2026-02-30', '2026-11-26')).toBeNull();
    expect(calculateAge('', '2026-11-26')).toBeNull();
  });
  it('maps every month 0..72 to exactly one band', () => {
    for (let m = 0; m <= 72; m++) expect(bandForMonths(m)).not.toBeNull();
    expect(bandForMonths(73)).toBeNull();
    expect(bandForMonths(5)!.id).toBe('0-5');
    expect(bandForMonths(6)!.id).toBe('6-11');
    expect(bandForMonths(72)!.id).toBe('60-72');
  });
});

describe('question bank', () => {
  it('demo bank is valid and covers every band x domain', () => {
    expect(validateBank(DEMO_QUESTION_BANK)).toEqual([]);
    for (const b of AGE_BANDS) for (const d of DOMAIN_IDS) {
      expect(DEMO_QUESTION_BANK.items.filter((i) => i.band === b.id && i.domain === d).length).toBeGreaterThan(0);
    }
    expect(DEMO_QUESTION_BANK.isDemonstration).toBe(true);
  });
  it('rejects malformed banks', () => {
    expect(validateBank({}).length).toBeGreaterThan(0);
    expect(validateBank({ ...DEMO_QUESTION_BANK, items: [{ id: 'x', domain: 'nope', band: '0-5', text: { en: 'a', ms: 'b' } }] }).length).toBeGreaterThan(0);
  });
});

describe('scoring', () => {
  const items = itemsFor(DEMO_QUESTION_BANK, '24-35');
  it('counts responses per domain descriptively', () => {
    const vals = ['achieved', 'sometimes', 'notYet'] as const;
    const answers = Object.fromEntries(items.map((it, i) => [it.id, vals[i % 3]]));
    const r = scoreScreening(DEMO_QUESTION_BANK, '24-35', answers);
    expect(r.total).toBe(15);
    expect(r.answered).toBe(15);
    expect(r.domains).toHaveLength(5);
    for (const d of r.domains) expect(d.counts.achieved + d.counts.sometimes + d.counts.notYet).toBe(3);
    expect(r.domainsWithNotYet).toHaveLength(5);
    expect(r.mode).toBe('descriptive');
    expect(r.domains[0].official).toBeUndefined();
  });
  it('applies configured official cut-offs only in points-cutoff mode', () => {
    const bank = {
      ...DEMO_QUESTION_BANK,
      scoring: {
        mode: 'points-cutoff' as const,
        points: { achieved: 10, sometimes: 5, notYet: 0, notSure: null, notObserved: null },
        cutoffs: { '24-35': { grossMotor: [{ minScore: 25, label: { en: 'Above cut-off', ms: 'Atas' } }, { minScore: 0, label: { en: 'Below cut-off', ms: 'Bawah' } }] } },
        source: { en: 'Test manual', ms: 'Manual ujian' },
      },
    };
    const gm = items.filter((i) => i.domain === 'grossMotor');
    const r = scoreScreening(bank, '24-35', { [gm[0].id]: 'achieved', [gm[1].id]: 'achieved', [gm[2].id]: 'sometimes' });
    expect(r.domains[0].official).toEqual({ score: 25, label: { en: 'Above cut-off', ms: 'Atas' } });
  });
});

describe('pdf helpers & qr url', () => {
  it('normalises characters and builds file name', () => {
    expect(pdfSafe('Let’z – “ok”…')).toBe('Let\'z - "ok"...');
    const s = { id: 'abc', profile: { screeningId: 'LPT 001/x', childName: 'Ali', screeningDate: '2026-11-26' } } as never;
    expect(reportFileName(s)).toBe('Development_Check_LPT_001_x_2026-11-26.pdf');
  });
  it('accepts only https public URLs, flags local ones', () => {
    expect(checkPublicUrl('http://example.com').ok).toBe(false);
    expect(checkPublicUrl('not a url').ok).toBe(false);
    expect(checkPublicUrl('https://user.github.io/app/')).toEqual({ ok: true, url: 'https://user.github.io/app/', local: false });
    expect(checkPublicUrl('https://localhost:5173/').local).toBe(true);
    expect(checkPublicUrl('https://192.168.1.4/').local).toBe(true);
  });
});

import { DEMO_MODULES } from '../src/data/demoModules';
import { moduleItemsFor, scoreModule, activeModules } from '../src/lib/modules';

describe('supplementary modules (sensory, learning)', () => {
  it('demo bank includes both modules and stays valid', () => {
    expect(DEMO_QUESTION_BANK.modules?.map((m) => m.id)).toEqual(['sensory', 'learning']);
    expect(validateBank(DEMO_QUESTION_BANK)).toEqual([]);
    for (const m of DEMO_MODULES) expect(m.isDemonstration).toBe(true);
  });
  it('filters items by age', () => {
    const [sensory, learning] = DEMO_MODULES;
    expect(moduleItemsFor(learning, 6)).toHaveLength(0);
    expect(moduleItemsFor(learning, 44)).toHaveLength(12);
    expect(moduleItemsFor(sensory, 3)).toHaveLength(0);
    expect(moduleItemsFor(sensory, 44)).toHaveLength(16);
    expect(activeModules(DEMO_QUESTION_BANK, ['sensory', 'learning'], 8).map((m) => m.id)).toEqual(['sensory']);
    expect(activeModules(DEMO_QUESTION_BANK, undefined, 44)).toEqual([]);
  });
  it('counts frequencies and lists often/always behaviours without scoring', () => {
    const sensory = DEMO_MODULES[0];
    const its = moduleItemsFor(sensory, 44);
    const answers = Object.fromEntries(its.map((it, i) => [it.id, (['always', 'often', 'rarely', 'never'] as const)[i % 4]]));
    const r = scoreModule(sensory, 44, answers);
    expect(r.answered).toBe(16);
    for (const c of r.categories) {
      expect(c.counts.always + c.counts.often).toBe(c.frequent.length);
      expect(c.frequent).toHaveLength(2);
    }
    expect(r.anyFrequent).toBe(true);
  });
  it('rejects malformed modules', () => {
    expect(validateBank({ ...DEMO_QUESTION_BANK, modules: [{ id: 'x' }] }).length).toBeGreaterThan(0);
  });
});
