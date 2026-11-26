import { AGE_BANDS, DEMO_QUESTION_BANK } from '../data/demoQuestionBank';
import type { QuestionBank } from '../types';
import { DOMAIN_IDS, MODULE_IDS, RESPONSE_VALUES } from '../types';
import { prefs } from './storage';

const isL = (v: unknown): boolean =>
  !!v && typeof v === 'object' && typeof (v as { en: unknown }).en === 'string' && typeof (v as { ms: unknown }).ms === 'string';

/** Validates an imported question bank. Returns a list of problems (empty = valid). */
export function validateBank(b: unknown): string[] {
  const e: string[] = [];
  if (!b || typeof b !== 'object') return ['Not a JSON object'];
  const q = b as Partial<QuestionBank>;
  if (typeof q.id !== 'string' || !q.id) e.push('id must be a non-empty string');
  if (!isL(q.name)) e.push('name must be { en, ms }');
  if (typeof q.version !== 'string') e.push('version must be a string');
  if (typeof q.isDemonstration !== 'boolean') e.push('isDemonstration must be true or false');
  if (!isL(q.attribution)) e.push('attribution must be { en, ms }');
  if (!isL(q.licence)) e.push('licence must be { en, ms }');
  const bandIds = AGE_BANDS.map((x) => x.id) as string[];
  if (!q.scoring || (q.scoring.mode !== 'descriptive' && q.scoring.mode !== 'points-cutoff')) {
    e.push('scoring.mode must be "descriptive" or "points-cutoff"');
  } else if (q.scoring.mode === 'points-cutoff') {
    const s = q.scoring;
    if (!s.points || RESPONSE_VALUES.some((r) => !(r in s.points))) e.push('scoring.points needs a value (number or null) for every response');
    if (!s.cutoffs || typeof s.cutoffs !== 'object') e.push('scoring.cutoffs missing');
    if (!isL(s.source)) e.push('scoring.source (citation of official scoring rules) must be { en, ms }');
  }
  if (!Array.isArray(q.items) || q.items.length === 0) e.push('items must be a non-empty array');
  else {
    const ids = new Set<string>();
    q.items.forEach((it, i) => {
      if (!it || typeof it.id !== 'string') e.push(`items[${i}].id missing`);
      else if (ids.has(it.id)) e.push(`items[${i}].id "${it.id}" is duplicated`);
      else ids.add(it.id);
      if (!DOMAIN_IDS.includes(it?.domain)) e.push(`items[${i}].domain must be one of ${DOMAIN_IDS.join(', ')}`);
      if (!bandIds.includes(it?.band)) e.push(`items[${i}].band must be one of ${bandIds.join(', ')}`);
      if (!isL(it?.text)) e.push(`items[${i}].text must be { en, ms }`);
    });
  }
  if (q.modules !== undefined) {
    if (!Array.isArray(q.modules)) e.push('modules must be an array');
    else q.modules.forEach((m, mi) => {
      if (!MODULE_IDS.includes(m?.id)) e.push(`modules[${mi}].id must be one of ${MODULE_IDS.join(', ')}`);
      for (const k of ['name', 'intro', 'note', 'attribution'] as const) if (!isL(m?.[k])) e.push(`modules[${mi}].${k} must be { en, ms }`);
      if (typeof m?.isDemonstration !== 'boolean') e.push(`modules[${mi}].isDemonstration must be true or false`);
      const cats = Array.isArray(m?.categories) ? m.categories : [];
      if (!cats.length) e.push(`modules[${mi}].categories must be a non-empty array`);
      cats.forEach((c, ci) => {
        if (typeof c?.id !== 'string' || !isL(c?.label) || !isL(c?.description) || !Array.isArray(c?.ideas)) e.push(`modules[${mi}].categories[${ci}] needs id, label, description, ideas`);
      });
      const catIds = cats.map((c) => c?.id);
      (Array.isArray(m?.items) ? m.items : []).forEach((it, ii) => {
        if (typeof it?.id !== 'string' || !catIds.includes(it?.category) || !isL(it?.text) || typeof it?.minMonths !== 'number' || typeof it?.maxMonths !== 'number') {
          e.push(`modules[${mi}].items[${ii}] needs id, a valid category, text { en, ms }, minMonths, maxMonths`);
        }
      });
    });
  }
  return e.slice(0, 12);
}

export function getActiveBank(): QuestionBank {
  const raw = prefs.getBank();
  if (raw) {
    try {
      const b = JSON.parse(raw);
      if (validateBank(b).length === 0) return b as QuestionBank;
    } catch { /* fall back */ }
  }
  return DEMO_QUESTION_BANK;
}
