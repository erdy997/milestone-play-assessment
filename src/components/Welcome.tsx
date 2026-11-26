import { Baby, Clock, FileDown, Lock, PlayCircle, RotateCcw } from 'lucide-react';
import { DISCLAIMER, tr } from '../i18n';
import type { Lang } from '../types';
import { Button, Card, FullLogo, Notice } from './ui';

export function Welcome({ lang, setLang, onStart, canResume, onResume, isDemo }: {
  lang: Lang; setLang: (l: Lang) => void; onStart: () => void; canResume: boolean; onResume: () => void; isDemo: boolean;
}) {
  const t = (k: Parameters<typeof tr>[1]) => tr(lang, k);
  const feats = [
    { icon: Baby, text: t('feat1') },
    { icon: Clock, text: t('feat2') },
    { icon: Lock, text: t('feat3') },
    { icon: FileDown, text: t('feat4') },
  ];
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-navy px-6 py-10 text-white shadow-card sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-aqua/20" aria-hidden />
        <div className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-aqua/10" aria-hidden />
        <div className="relative">
          <div className="mb-7 flex flex-col items-start gap-2">
            <FullLogo className="w-40 sm:w-48" />
            <p className="text-xs font-medium tracking-wide text-white/75">{t('motto')}</p>
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{t('appName')}</h1>
          <p className="mt-3 text-lg font-medium text-aqua sm:text-xl">{t('tagline')}</p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85">{t('welcomeIntro')}</p>

          <div className="mt-7">
            <p id="lang-label" className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/70">{t('chooseLanguage')}</p>
            <div role="radiogroup" aria-labelledby="lang-label" className="inline-flex rounded-2xl bg-white/10 p-1">
              {(['ms', 'en'] as Lang[]).map((l) => (
                <button
                  key={l}
                  role="radio"
                  aria-checked={lang === l}
                  onClick={() => setLang(l)}
                  className={`min-h-[44px] rounded-xl px-5 text-sm font-semibold transition ${lang === l ? 'bg-white text-navy' : 'text-white hover:bg-white/10'}`}
                >
                  {l === 'ms' ? 'Bahasa Melayu' : 'English'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="teal" onClick={onStart} className="px-7 py-3.5 text-base" data-testid="start">
              <PlayCircle className="h-5 w-5" /> {t('start')}
            </Button>
            {canResume && (
              <Button variant="secondary" onClick={onResume} className="bg-transparent text-white border-white/40 hover:border-white">
                <RotateCcw className="h-4 w-4" /> {t('resume')}
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {feats.map(({ icon: I, text }) => (
          <div key={text} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-aqua-soft text-navy"><I className="h-5 w-5" /></span>
            <span className="text-sm font-medium text-slate-700">{text}</span>
          </div>
        ))}
      </div>

      <Card className="space-y-3">
        {isDemo && <Notice tone="warn">{t('demoBanner')}</Notice>}
        <Notice>{DISCLAIMER[lang]}</Notice>
      </Card>
    </div>
  );
}
