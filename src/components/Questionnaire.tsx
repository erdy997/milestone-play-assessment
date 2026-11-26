import { Brain, Check, ChevronLeft, ChevronRight, CircleDashed, CircleHelp, EyeOff, Hand, Hourglass, Repeat, Save, Sparkles, type LucideIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { answerLabel, DOMAIN_LABELS, DOMAIN_SHORT, tr, type StringKey } from '../i18n';
import { moduleItemsFor } from '../lib/modules';
import type { Answers, DomainId, FrequencyValue, L, Lang, QuestionItem, ResponseValue, SupplementaryModule } from '../types';
import { DOMAIN_IDS, FREQUENCY_VALUES, RESPONSE_VALUES } from '../types';
import { Button, Card, cx, inputCls } from './ui';

type AnyValue = ResponseValue | FrequencyValue;

/** One question card. Developmental items use the 5-option scale; module items use the frequency scale. */
export interface Step {
  id: string;
  group: string;
  groupLabel: L;
  groupShort: L;
  subLabel?: L; // e.g. sensory pattern name
  text: L;
  hint?: L;
  scale: 'dev' | 'freq';
}

const ICONS: Record<AnyValue, LucideIcon> = {
  achieved: Check,
  sometimes: Hourglass,
  notYet: CircleDashed,
  notSure: CircleHelp,
  notObserved: EyeOff,
  always: Repeat,
  often: Check,
  rarely: CircleDashed,
  never: EyeOff,
};

const GROUP_BG: Record<string, string> = {
  grossMotor: 'bg-[#172B5A]',
  fineMotor: 'bg-[#2E4C8E]',
  communication: 'bg-[#3F63A8]',
  cognitive: 'bg-[#5A86C9]',
  socialEmotional: 'bg-[#7FB3DE]',
  sensory: 'bg-[#D9828B]',
  learning: 'bg-[#4FA3B3]',
};
const GROUP_ICON: Record<string, LucideIcon> = { sensory: Hand, learning: Brain };

export function buildSteps(items: QuestionItem[], modules: SupplementaryModule[], months: number): Step[] {
  const dev: Step[] = items.map((it) => ({
    id: it.id,
    group: it.domain,
    groupLabel: DOMAIN_LABELS[it.domain],
    groupShort: DOMAIN_SHORT[it.domain],
    text: it.text,
    hint: it.hint,
    scale: 'dev',
  }));
  const mod: Step[] = modules.flatMap((m) =>
    moduleItemsFor(m, months).map((it) => ({
      id: it.id,
      group: m.id,
      groupLabel: m.name,
      groupShort: m.id === 'sensory' ? { en: 'Sensory', ms: 'Sensori' } : { en: 'Learning', ms: 'Belajar' },
      subLabel: m.categories.find((c) => c.id === it.category)?.label,
      text: it.text,
      scale: 'freq' as const,
    })),
  );
  return [...dev, ...mod];
}

export function Questionnaire({ lang, steps, answers, onAnswer, concerns, concernDomains, onConcerns, onFinish, onExit, startIndex = 0 }: {
  lang: Lang;
  steps: Step[];
  answers: Answers;
  onAnswer: (id: string, v: AnyValue) => void;
  concerns: string;
  concernDomains: DomainId[];
  onConcerns: (text: string, domains: DomainId[]) => void;
  onFinish: () => void;
  onExit: () => void;
  startIndex?: number;
}) {
  const t = (k: StringKey) => tr(lang, k);
  const [idx, setIdx] = useState(Math.min(startIndex, steps.length));
  const [warn, setWarn] = useState('');
  const advanceTimer = useRef<number | undefined>(undefined);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);
  useEffect(() => {
    setWarn('');
    headingRef.current?.focus({ preventScroll: true });
  }, [idx]);

  const answeredCount = steps.filter((i) => answers[i.id]).length;
  const groups = useMemo(() => {
    const order: string[] = [];
    for (const s of steps) if (!order.includes(s.group)) order.push(s.group);
    return order.map((g) => {
      const gs = steps.filter((s) => s.group === g);
      return { g, short: gs[0].groupShort, total: gs.length, done: gs.filter((s) => answers[s.id]).length, first: steps.findIndex((s) => s.group === g) };
    });
  }, [steps, answers]);
  const onConcernStep = idx >= steps.length;
  const step = steps[idx];
  const groupSteps = step ? steps.filter((i) => i.group === step.group) : [];
  const posInGroup = step ? groupSteps.findIndex((i) => i.id === step.id) + 1 : 0;
  const values: AnyValue[] = step?.scale === 'freq' ? FREQUENCY_VALUES : RESPONSE_VALUES;
  const GroupIcon = step ? GROUP_ICON[step.group] ?? Sparkles : Sparkles;

  const choose = (v: AnyValue) => {
    if (!step) return;
    onAnswer(step.id, v);
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => setIdx((i) => Math.min(i + 1, steps.length)), 320);
  };
  const next = () => {
    if (step && !answers[step.id]) {
      setWarn(t('selectAnswer'));
      return;
    }
    setIdx((i) => Math.min(i + 1, steps.length));
  };
  const finish = () => {
    if (steps.some((i) => !answers[i.id])) {
      setWarn(t('unanswered'));
      return;
    }
    onFinish();
  };

  return (
    <div className="space-y-4">
      {/* progress */}
      <div className="rounded-3xl bg-white p-4 shadow-card sm:p-5">
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="font-semibold text-navy">
            {onConcernStep ? t('concernsTitle') : `${t('question')} ${idx + 1} ${t('of')} ${steps.length}`}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500"><Save className="h-3.5 w-3.5" /> {t('saved')}</span>
        </div>
        <div
          className="mt-3 h-2.5 overflow-hidden rounded-full bg-mist"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-valuenow={answeredCount}
          aria-label={`${answeredCount} / ${steps.length}`}
        >
          <div className="h-full rounded-full bg-navy transition-all duration-500" style={{ width: `${(answeredCount / Math.max(steps.length, 1)) * 100}%` }} />
        </div>
        <div className="-mx-1 mt-4 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:gap-2" role="tablist" aria-label="Sections">
          {groups.map(({ g, short, total, done, first }) => {
            const active = step?.group === g;
            const complete = done === total;
            return (
              <button
                key={g}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  const firstUnanswered = steps.findIndex((i) => i.group === g && !answers[i.id]);
                  setIdx(firstUnanswered >= 0 ? firstUnanswered : first);
                }}
                className={cx(
                  'flex min-w-[64px] flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-center transition',
                  active ? 'bg-navy text-white' : 'bg-mist text-navy hover:bg-navy-50',
                )}
                data-testid={`domain-tab-${g}`}
              >
                <span className={cx('flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-1 text-[10px] font-bold', complete ? 'bg-aqua text-navy' : active ? 'bg-white/20' : 'bg-white')}>
                  {complete ? <Check className="h-3.5 w-3.5" /> : `${done}/${total}`}
                </span>
                <span className="text-[10px] font-semibold leading-tight sm:text-xs">{short[lang]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {!onConcernStep && step && (
        <Card className="space-y-5">
          <div className="flex items-center gap-3">
            <span className={cx('flex h-10 w-10 items-center justify-center rounded-xl text-white', GROUP_BG[step.group] ?? 'bg-navy')}>
              <GroupIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-navy-600">{step.groupLabel[lang]}</p>
              <p className="text-xs text-slate-500">
                {step.subLabel ? `${step.subLabel[lang]} · ` : ''}{posInGroup} / {groupSteps.length}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-500">{step.scale === 'freq' ? t('howOften') : t('doesYourChild')}</p>
            <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-xl font-bold leading-snug text-slate-900 outline-none sm:text-2xl" data-testid="question-text">
              {step.text[lang]}
            </h2>
            {step.hint && <p className="mt-2 text-sm text-slate-500">{step.hint[lang]}</p>}
          </div>
          <div role="radiogroup" aria-label={step.text[lang]} className="grid gap-2.5 sm:grid-cols-2">
            {values.map((v) => {
              const I = ICONS[v];
              const sel = answers[step.id] === v;
              const lbl = answerLabel(v);
              return (
                <button
                  key={v}
                  role="radio"
                  aria-checked={sel}
                  onClick={() => choose(v)}
                  data-testid={`answer-${v}`}
                  className={cx(
                    'flex min-h-[56px] items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-base font-semibold transition',
                    sel ? 'border-navy bg-navy text-white' : 'border-slate-200 bg-white text-slate-800 hover:border-aqua hover:bg-navy-50',
                    v === 'notObserved' && 'sm:col-span-2',
                  )}
                >
                  <span className={cx('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', sel ? 'bg-white/20' : 'bg-aqua-soft text-navy')}>
                    <I className="h-4 w-4" />
                  </span>
                  <span>
                    {lbl[lang]}
                    <span className={cx('block text-xs font-normal', sel ? 'text-white/70' : 'text-slate-500')}>{lbl[lang === 'en' ? 'ms' : 'en']}</span>
                  </span>
                </button>
              );
            })}
          </div>
          {warn && <p className="text-sm font-medium text-red-700" role="alert">{warn}</p>}
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <Button variant="ghost" onClick={() => (idx === 0 ? onExit() : setIdx(idx - 1))} data-testid="prev">
              <ChevronLeft className="h-4 w-4" /> {idx === 0 ? t('back') : t('previous')}
            </Button>
            <Button onClick={next} data-testid="next">
              {t('next')} <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {onConcernStep && (
        <Card className="space-y-5">
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-navy outline-none">{t('concernsTitle')}</h2>
            <p className="mt-1 text-sm text-slate-600">{t('concernsSub')}</p>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-navy">{t('concernsDomains')}</legend>
            <div className="flex flex-wrap gap-2">
              {DOMAIN_IDS.map((d) => {
                const on = concernDomains.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={on}
                    onClick={() => onConcerns(concerns, on ? concernDomains.filter((x) => x !== d) : [...concernDomains, d])}
                    className={cx('min-h-[44px] rounded-full border px-4 text-sm font-medium transition', on ? 'border-navy bg-navy text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-aqua')}
                  >
                    {DOMAIN_LABELS[d][lang]}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div>
            <label htmlFor="concerns" className="mb-1.5 block text-sm font-semibold text-navy">{t('concernsText')}</label>
            <textarea id="concerns" rows={4} maxLength={1500} className={inputCls} value={concerns} onChange={(e) => onConcerns(e.target.value, concernDomains)} data-testid="concerns" />
          </div>
          {warn && (
            <div className="flex flex-wrap items-center gap-3" role="alert">
              <p className="text-sm font-medium text-red-700">{warn}</p>
              <Button variant="secondary" onClick={() => setIdx(steps.findIndex((i) => !answers[i.id]))}>{t('goTo')}</Button>
            </div>
          )}
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <Button variant="ghost" onClick={() => setIdx(steps.length - 1)}><ChevronLeft className="h-4 w-4" /> {t('previous')}</Button>
            <Button onClick={finish} data-testid="see-results">{t('seeResults')} <ChevronRight className="h-4 w-4" /></Button>
          </div>
        </Card>
      )}
    </div>
  );
}
