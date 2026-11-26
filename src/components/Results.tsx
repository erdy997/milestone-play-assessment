import { CheckCircle2, ClipboardList, Download, Eye, HeartHandshake, Home, Loader2, MessageCircleQuestion, Pencil, RotateCcw, Stethoscope } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { HOME_ACTIVITIES, stageForMonths } from '../data/activities';
import { AGE_BANDS } from '../data/demoQuestionBank';
import { answerLabel, DISCLAIMER, DOMAIN_LABELS, RESPONSE_COLORS, RESPONSE_LABELS, tr, type StringKey } from '../i18n';
import { calculateAge } from '../lib/age';
import { buildRecommendations, formatAge, formatDate } from '../lib/format';
import { downloadReport } from '../lib/pdf';
import type { ModuleResult } from '../lib/modules';
import type { ScreeningResult } from '../lib/scoring';
import type { Lang, ProfessionalReview, QuestionBank, QuestionItem, ScreeningSession } from '../types';
import { RESPONSE_VALUES } from '../types';
import { DomainChart } from './DomainChart';
import { ModuleSection } from './ModuleSection';
import { Button, Card, cx, inputCls, Notice } from './ui';

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <Card className="space-y-3">
      <h3 className="flex items-center gap-2.5 text-lg font-bold text-navy">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-aqua-soft">{icon}</span>
        {title}
      </h3>
      {children}
    </Card>
  );
}

export function Results({ lang, session, result, moduleResults = [], bank, onEdit, onNew, onReview }: {
  lang: Lang;
  session: ScreeningSession;
  result: ScreeningResult;
  moduleResults?: ModuleResult[];
  bank: QuestionBank;
  onEdit?: () => void;
  onNew: () => void;
  onReview: (r: ProfessionalReview) => void;
}) {
  const t = (k: StringKey, v?: Record<string, string>) => tr(lang, k, v);
  const [pdfState, setPdfState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const p = session.profile;
  const age = calculateAge(p.dob, p.screeningDate);
  const band = AGE_BANDS.find((b) => b.id === session.band);
  const recs = buildRecommendations(result, session, lang, moduleResults);
  const stage = stageForMonths(session.ageMonths);
  const focus = result.domains.filter((d) => d.notYet.length || d.emerging.length || d.clarify.length).map((d) => d.domain);
  const actDomains = focus.length ? focus : result.domains.map((d) => d.domain);

  const doPdf = () => {
    setPdfState('busy');
    // let the spinner paint first
    window.setTimeout(() => {
      try {
        downloadReport(session, result, bank, lang, moduleResults);
        setPdfState('done');
      } catch (e) {
        console.error(e);
        setPdfState('error');
      }
    }, 30);
  };

  const ItemList = ({ items, showResp }: { items: QuestionItem[]; showResp?: boolean }) =>
    items.length ? (
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li key={it.id} className="flex gap-2 text-sm text-slate-700">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
            <span>
              {it.text[lang]}
              {showResp && <span className="ml-1 text-xs font-semibold text-slate-500">({answerLabel(session.answers[it.id])[lang]})</span>}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-slate-500">{t('none')}</p>
    );

  const byDomain = (key: 'achieved' | 'emerging' | 'notYet' | 'clarify', showResp = false) => {
    const ds = result.domains.filter((d) => d[key].length);
    if (!ds.length) return <p className="text-sm text-slate-500">{t('none')}</p>;
    return (
      <div className="space-y-3">
        {ds.map((d) => (
          <div key={d.domain}>
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-navy-600">{DOMAIN_LABELS[d.domain][lang]}</p>
            <ItemList items={d[key]} showResp={showResp} />
          </div>
        ))}
      </div>
    );
  };

  const rv = session.review;
  const setRv = <K extends keyof ProfessionalReview>(k: K, v: ProfessionalReview[K]) => onReview({ ...rv, [k]: v });

  return (
    <div className="space-y-5">
      {/* profile header */}
      <Card className="bg-navy text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-aqua">{t('resultsTitle')}</p>
        <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl" data-testid="result-name">{p.childName || p.screeningId}</h2>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
          {[
            [t('dob'), formatDate(p.dob, lang)],
            [t('chronologicalAge'), age ? formatAge(age, lang) : '-'],
            [t('screeningDate'), formatDate(p.screeningDate, lang)],
            [t('ageGroup'), band?.label[lang] ?? session.band],
            ...(p.screeningId && p.childName ? [[t('screeningId'), p.screeningId]] : []),
            ...(p.caregiverName ? [[t('caregiver'), p.caregiverName]] : []),
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-white/60">{k}</dt>
              <dd className="font-semibold" data-testid={k === t('chronologicalAge') ? 'result-age' : undefined}>{v}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {/* PDF button */}
      <Card className="space-y-3 border-2 border-aqua">
        <Button onClick={doPdf} disabled={pdfState === 'busy'} className="w-full py-4 text-base leading-snug" data-testid="download-pdf">
          {pdfState === 'busy' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5 shrink-0" />}
          {pdfState === 'busy' ? t('generating') : t('downloadPdf')}
        </Button>
        {pdfState === 'done' && <p className="text-center text-sm font-medium text-navy" role="status">✓ {t('pdfDone')}</p>}
        {pdfState === 'error' && <p className="text-center text-sm font-medium text-red-700" role="alert">{t('pdfError')}</p>}
        <div className="flex flex-wrap justify-center gap-2">
          {onEdit && <Button variant="secondary" onClick={onEdit}><Pencil className="h-4 w-4" /> {t('editAnswers')}</Button>}
          <Button variant="ghost" onClick={onNew}><RotateCcw className="h-4 w-4" /> {t('newScreening')}</Button>
        </div>
      </Card>

      {bank.isDemonstration && <Notice tone="warn">{t('demoBanner')}</Notice>}
      <Notice>{result.mode === 'descriptive' ? t('descriptiveNote') : `${t('scoringOfficial')} ${bank.scoring.mode === 'points-cutoff' ? bank.scoring.source[lang] : ''}`}</Notice>

      {/* chart + table */}
      <Card className="space-y-4">
        <h3 className="text-lg font-bold text-navy">{t('responsesByDomain')}</h3>
        <DomainChart lang={lang} rows={result.domains} />
        <div className="-mx-2 overflow-x-auto">
          <table className="min-w-full text-sm" data-testid="summary-table">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-2 py-2">{t('domain')}</th>
                {RESPONSE_VALUES.map((r) => (
                  <th key={r} className="px-2 py-2 text-center">
                    <span className="inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ background: RESPONSE_COLORS[r] }} /> <span className="align-middle">{RESPONSE_LABELS[r][lang]}</span>
                  </th>
                ))}
                {result.mode === 'points-cutoff' && <th className="px-2 py-2">{t('score')}</th>}
              </tr>
            </thead>
            <tbody>
              {result.domains.map((d) => (
                <tr key={d.domain} className="border-t border-slate-100">
                  <td className="px-2 py-2.5 font-semibold text-navy">{DOMAIN_LABELS[d.domain][lang]}</td>
                  {RESPONSE_VALUES.map((r) => (
                    <td key={r} className={cx('px-2 py-2.5 text-center tabular-nums', d.counts[r] ? 'font-semibold text-slate-900' : 'text-slate-400')}>{d.counts[r]}</td>
                  ))}
                  {result.mode === 'points-cutoff' && (
                    <td className="px-2 py-2.5">{d.official?.score ?? '-'} {d.official?.label && <span className="text-xs text-slate-500">({d.official.label[lang]})</span>}</td>
                  )}
                </tr>
              ))}
              <tr className="border-t-2 border-navy/20 bg-navy-50 font-bold">
                <td className="px-2 py-2.5 text-navy">{t('total')}</td>
                {RESPONSE_VALUES.map((r) => <td key={r} className="px-2 py-2.5 text-center tabular-nums">{result.totals[r]}</td>)}
                {result.mode === 'points-cutoff' && <td />}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* domain cards */}
      <div>
        <h3 className="mb-3 text-lg font-bold text-navy">{t('domainSummary')}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {result.domains.map((d) => (
            <Card key={d.domain} className="space-y-3 !p-5">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-navy">{DOMAIN_LABELS[d.domain][lang]}</h4>
                <span className="text-xs text-slate-500">{d.answered}/{d.total} {t('items')}</span>
              </div>
              <div className="flex h-2.5 overflow-hidden rounded-full bg-mist" aria-hidden>
                {RESPONSE_VALUES.map((r) => d.counts[r] ? <div key={r} style={{ width: `${(d.counts[r] / Math.max(d.total, 1)) * 100}%`, background: RESPONSE_COLORS[r] }} /> : null)}
              </div>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between"><span className="text-slate-600">{t('catAchieved')}</span><b>{d.achieved.length}</b></li>
                <li className="flex justify-between"><span className="text-slate-600">{t('catEmerging')}</span><b>{d.emerging.length}</b></li>
                <li className="flex justify-between"><span className="text-slate-600">{t('catNotYet')}</span><b>{d.notYet.length}</b></li>
                <li className="flex justify-between"><span className="text-slate-600">{t('catClarify')}</span><b>{d.clarify.length}</b></li>
              </ul>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Section icon={<CheckCircle2 className="h-5 w-5 text-navy" />} title={t('strengths')}>
          <p className="text-xs text-slate-500">{t('catAchieved')}</p>
          {byDomain('achieved')}
        </Section>
        <Section icon={<Eye className="h-5 w-5 text-navy" />} title={t('monitor')}>
          <p className="text-xs font-semibold text-slate-500">{t('catEmerging')}</p>
          {byDomain('emerging')}
          <p className="pt-2 text-xs font-semibold text-slate-500">{t('catNotYet')}</p>
          {byDomain('notYet')}
        </Section>
        <Section icon={<MessageCircleQuestion className="h-5 w-5 text-navy" />} title={t('catClarify')}>
          {byDomain('clarify', true)}
        </Section>
        <Section icon={<HeartHandshake className="h-5 w-5 text-navy" />} title={t('parentConcerns')}>
          {session.concernDomains.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {session.concernDomains.map((d) => <span key={d} className="rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy">{DOMAIN_LABELS[d][lang]}</span>)}
            </div>
          )}
          {session.concerns.trim() ? <p className="whitespace-pre-wrap text-sm text-slate-700">{session.concerns}</p> : !session.concernDomains.length && <p className="text-sm text-slate-500">{t('noConcerns')}</p>}
        </Section>
      </div>

      {moduleResults.map((m) => <ModuleSection key={m.module.id} lang={lang} result={m} />)}

      <Section icon={<ClipboardList className="h-5 w-5 text-navy" />} title={t('reviewItems')}>
        <p className="text-sm text-slate-600">{result.reviewItems.length} {t('items')}</p>
        <ItemList items={result.reviewItems} showResp />
      </Section>

      <Section icon={<Stethoscope className="h-5 w-5 text-navy" />} title={t('recommendations')}>
        <ul className="space-y-2" data-testid="recommendations">
          {recs.map((r) => <li key={r} className="flex gap-2 text-sm text-slate-700"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />{r}</li>)}
        </ul>
      </Section>

      <Section icon={<Home className="h-5 w-5 text-navy" />} title={t('homeActivities')}>
        <div className="grid gap-4 sm:grid-cols-2">
          {actDomains.map((d) => (
            <div key={d}>
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-navy-600">{DOMAIN_LABELS[d][lang]}</p>
              <ul className="space-y-1">{HOME_ACTIVITIES[stage][d].map((a) => <li key={a.en} className="text-sm text-slate-700">• {a[lang]}</li>)}</ul>
            </div>
          ))}
        </div>
      </Section>

      <details className="group rounded-3xl bg-white p-5 shadow-card sm:p-7">
        <summary className="cursor-pointer list-none text-lg font-bold text-navy">
          <span className="mr-2 inline-block transition group-open:rotate-90">›</span>{t('proSection')}
        </summary>
        <p className="mt-2 text-sm text-slate-600">{t('proSectionSub')}</p>
        <div className="mt-4 grid gap-4">
          {([['otComments', 'otComments'], ['stComments', 'stComments'], ['otherObservations', 'otherObs']] as const).map(([k, label]) => (
            <div key={k}>
              <label htmlFor={k} className="mb-1.5 block text-sm font-semibold text-navy">{t(label)}</label>
              <textarea id={k} rows={3} className={inputCls} value={rv[k]} maxLength={1500} onChange={(e) => setRv(k, e.target.value)} />
            </div>
          ))}
          <div>
            <label htmlFor="referral" className="mb-1.5 block text-sm font-semibold text-navy">{t('referral')}</label>
            <select id="referral" className={inputCls} value={rv.referral} onChange={(e) => setRv('referral', e.target.value as ProfessionalReview['referral'])}>
              {(['', 'none', 'monitor', 'ot', 'st', 'paeds', 'multi'] as const).map((v) => <option key={v} value={v}>{t(`ref_${v}` as StringKey)}</option>)}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="reviewerName" className="mb-1.5 block text-sm font-semibold text-navy">{t('reviewerName')}</label>
              <input id="reviewerName" className={inputCls} value={rv.reviewerName} maxLength={80} onChange={(e) => setRv('reviewerName', e.target.value)} />
            </div>
            <div>
              <label htmlFor="reviewerRole" className="mb-1.5 block text-sm font-semibold text-navy">{t('reviewerRole')}</label>
              <input id="reviewerRole" className={inputCls} value={rv.reviewerRole} maxLength={80} onChange={(e) => setRv('reviewerRole', e.target.value)} />
            </div>
          </div>
        </div>
      </details>

      <Notice>{DISCLAIMER[lang]}</Notice>
    </div>
  );
}
