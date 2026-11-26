import { DOMAIN_LABELS } from '../i18n';
import type { QuestionBank, ScreeningSession } from '../types';
import { DOMAIN_IDS, RESPONSE_VALUES } from '../types';
import { scoreModules } from './modules';
import { scoreScreening } from './scoring';

const esc = (v: unknown) => {
  const s = v == null ? '' : String(v);
  // Neutralise spreadsheet formula injection, then quote.
  const safe = /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
  return '"' + safe.replace(/"/g, '""') + '"';
};

export function sessionsToCsv(sessions: ScreeningSession[], bank: QuestionBank): string {
  const head = [
    'session_id', 'status', 'created_at', 'completed_at', 'screening_date', 'child_name', 'screening_id', 'dob',
    'age_months', 'age_band', 'gender', 'caregiver', 'purpose', 'language', 'question_bank', 'bank_version',
  ];
  for (const d of DOMAIN_IDS) for (const r of RESPONSE_VALUES) head.push(`${d}_${r}`);
  // supplementary modules: answered items and number reported often/always per category
  const modCols = (bank.modules ?? []).flatMap((m) => m.categories.map((c) => ({ m: m.id, c: c.id })));
  for (const { m, c } of modCols) head.push(`${m}_${c}_answered`, `${m}_${c}_often_always`);
  head.push('modules_included', 'parent_concern_domains', 'parent_concerns', 'referral');
  const rows = [head.map(esc).join(',')];
  for (const s of sessions) {
    const res = scoreScreening(bank, s.band, s.answers);
    const row: unknown[] = [
      s.id, s.completedAt ? 'completed' : 'in_progress', s.createdAt, s.completedAt ?? '', s.profile.screeningDate,
      s.profile.childName, s.profile.screeningId, s.profile.dob, s.ageMonths, s.band, s.profile.gender,
      s.profile.caregiverName, s.profile.purpose, s.lang, s.bankId, s.bankVersion,
    ];
    for (const d of res.domains) for (const r of RESPONSE_VALUES) row.push(d.counts[r]);
    const mres = scoreModules(bank, s.modules, s.ageMonths, s.answers);
    for (const { m, c } of modCols) {
      const cr = mres.find((x) => x.module.id === m)?.categories.find((x) => x.category.id === c);
      row.push(cr ? cr.answered : '', cr ? cr.frequent.length : '');
    }
    row.push((s.modules ?? []).join('; '));
    row.push(s.concernDomains.map((d) => DOMAIN_LABELS[d].en).join('; '), s.concerns, s.review.referral);
    rows.push(row.map(esc).join(','));
  }
  return '﻿' + rows.join('\r\n');
}

export function downloadBlob(data: BlobPart, filename: string, type: string) {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

