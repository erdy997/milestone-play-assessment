import { Brain, Hand, Lightbulb } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FREQUENCY_COLORS, FREQUENCY_LABELS, tr, type StringKey } from '../i18n';
import type { ModuleResult } from '../lib/modules';
import type { Lang } from '../types';
import { FREQUENCY_VALUES } from '../types';
import { Card, cx, Notice } from './ui';

export function FreqChart({ lang, result, height }: { lang: Lang; result: ModuleResult; height?: number }) {
  const data = result.categories.map((c) => ({ name: c.category.label[lang], ...c.counts }));
  return (
    <div style={{ width: '100%', height: height ?? 70 + data.length * 44 }} data-testid={`chart-${result.module.id}`}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, bottom: 4, left: 4 }} barCategoryGap={10}>
          <CartesianGrid horizontal={false} stroke="#E3E8F1" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#5E6A82' }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={112} tick={{ fontSize: 12, fill: '#172B5A', fontWeight: 600 }} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: 'rgba(159,221,230,.2)' }} contentStyle={{ borderRadius: 12, fontSize: 13 }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} formatter={(v) => <span style={{ color: '#334155' }}>{v}</span>} />
          {FREQUENCY_VALUES.map((f) => (
            <Bar key={f} dataKey={f} name={FREQUENCY_LABELS[f][lang]} stackId="a" fill={FREQUENCY_COLORS[f]} isAnimationActive={false} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ModuleSection({ lang, result }: { lang: Lang; result: ModuleResult }) {
  const t = (k: StringKey) => tr(lang, k);
  const m = result.module;
  const Icon = m.id === 'sensory' ? Hand : Brain;
  return (
    <Card className="space-y-4" >
      <div data-testid={`module-result-${m.id}`} className="space-y-4">
        <h3 className="flex items-center gap-2.5 text-lg font-bold text-navy">
          <span className={cx('flex h-9 w-9 items-center justify-center rounded-xl text-white', m.id === 'sensory' ? 'bg-[#D9828B]' : 'bg-[#4FA3B3]')}>
            <Icon className="h-5 w-5" />
          </span>
          {m.name[lang]}
        </h3>
        {m.isDemonstration && <Notice tone="warn">{t('moduleDemo')}</Notice>}
        <p className="text-sm text-slate-600">{m.note[lang]}</p>
        <FreqChart lang={lang} result={result} />
        <div className="grid gap-3 sm:grid-cols-2">
          {result.categories.map((c) => (
            <div key={c.category.id} className="rounded-2xl bg-mist p-4">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-bold text-navy">{c.category.label[lang]}</p>
                <p className="text-xs text-slate-500 tabular-nums">
                  {t('oftenAlways')}: <b className="text-navy">{c.frequent.length}</b> / {c.total}
                </p>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">{c.category.description[lang]}</p>
              {c.frequent.length > 0 ? (
                <>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-navy-600">{t('frequentlyReported')}</p>
                  <ul className="mt-1 space-y-1">
                    {c.frequent.map((it) => <li key={it.id} className="text-sm text-slate-700">• {it.text[lang]}</li>)}
                  </ul>
                  <p className="mt-3 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-navy-600"><Lightbulb className="h-3.5 w-3.5" /> {t('ideasToTry')}</p>
                  <ul className="mt-1 space-y-1">
                    {c.category.ideas.map((i) => <li key={i.en} className="text-sm text-slate-700">• {i[lang]}</li>)}
                  </ul>
                </>
              ) : (
                <p className="mt-3 text-sm text-slate-500">{t('noFrequent')}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
