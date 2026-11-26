import { Languages, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { Component, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Admin } from './components/Admin';
import { Profile } from './components/Profile';
import { buildSteps, Questionnaire } from './components/Questionnaire';
import { Results } from './components/Results';
import { Logo } from './components/ui';
import { Welcome } from './components/Welcome';
import { DISCLAIMER, tr } from './i18n';
import { bandForMonths } from './lib/age';
import { getActiveBank } from './lib/bank';
import { activeModules, scoreModules } from './lib/modules';
import { itemsFor, scoreScreening } from './lib/scoring';
import { loadDraft, loadSessions, newId, prefs, saveDraft, upsertSession } from './lib/storage';
import type { ChildProfile, Lang, ModuleId, ScreeningSession } from './types';

type View = 'welcome' | 'profile' | 'screen' | 'results' | 'admin';
const VIEWS: View[] = ['welcome', 'profile', 'screen', 'results', 'admin'];

const readHash = (): View => {
  const v = window.location.hash.replace(/^#\/?/, '') as View;
  return VIEWS.includes(v) ? v : 'welcome';
};

class ErrorBoundary extends Component<{ children: ReactNode }, { err: Error | null }> {
  state = { err: null as Error | null };
  static getDerivedStateFromError(err: Error) { return { err }; }
  render() {
    if (this.state.err) {
      return (
        <div className="mx-auto max-w-lg p-6 text-center">
          <h1 className="text-xl font-bold text-navy">Something went wrong / Ralat berlaku</h1>
          <p className="mt-2 text-sm text-slate-600">{this.state.err.message}</p>
          <button className="mt-4 rounded-xl bg-navy px-4 py-2 text-white" onClick={() => { window.location.hash = ''; window.location.reload(); }}>Reload / Muat semula</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const emptyReview = (): ScreeningSession['review'] => ({ otComments: '', stComments: '', otherObservations: '', referral: '', reviewerName: '', reviewerRole: '' });

function AppInner() {
  const [lang, setLangState] = useState<Lang>(() => (prefs.getLang() === 'en' ? 'en' : 'ms'));
  const [view, setView] = useState<View>(readHash);
  const [bank, setBank] = useState(getActiveBank);
  const [session, setSession] = useState<ScreeningSession | null>(() => loadDraft());
  const [sessions, setSessions] = useState<ScreeningSession[]>(loadSessions);
  const [readOnly, setReadOnly] = useState(false);
  const [startIndex, setStartIndex] = useState<number | null>(null); // null = resume at first unanswered

  const setLang = (l: Lang) => { setLangState(l); prefs.setLang(l); };
  useEffect(() => { document.documentElement.lang = lang === 'ms' ? 'ms' : 'en'; }, [lang]);

  const go = useCallback((v: View) => {
    setView(v);
    const h = v === 'welcome' ? '' : `#/${v}`;
    if (window.location.hash !== h) history.pushState(null, '', h || window.location.pathname + window.location.search);
    window.scrollTo({ top: 0 });
  }, []);
  useEffect(() => {
    const on = () => setView(readHash());
    window.addEventListener('popstate', on);
    window.addEventListener('hashchange', on);
    return () => { window.removeEventListener('popstate', on); window.removeEventListener('hashchange', on); };
  }, []);

  // Guard views that need a session
  useEffect(() => {
    if ((view === 'screen' || view === 'results') && !session) go('welcome');
    if (view === 'results' && session && !session.completedAt) go('screen');
  }, [view, session, go]);

  const persist = (s: ScreeningSession) => {
    setSession(s);
    upsertSession(s);
    if (!readOnly) saveDraft(s);
    setSessions(loadSessions());
  };

  const items = useMemo(() => (session ? itemsFor(bank, session.band) : []), [bank, session]);
  const steps = useMemo(
    () => (session ? buildSteps(items, activeModules(bank, session.modules, session.ageMonths), session.ageMonths) : []),
    [items, bank, session],
  );
  const result = useMemo(() => (session ? scoreScreening(bank, session.band, session.answers) : null), [bank, session]);
  const moduleResults = useMemo(() => (session ? scoreModules(bank, session.modules, session.ageMonths, session.answers) : []), [bank, session]);

  const startProfile = (p: ChildProfile, ageMonths: number, modules: ModuleId[]) => {
    const band = bandForMonths(ageMonths)!;
    // Re-use the current draft if the parent went back to edit the profile
    const base: ScreeningSession = session && !session.completedAt && !readOnly
      ? session
      : { id: newId(), createdAt: new Date().toISOString(), lang, bankId: bank.id, bankVersion: bank.version, profile: p, ageMonths, band: band.id, answers: {}, concerns: '', concernDomains: [], review: emptyReview() };
    const bandChanged = base.band !== band.id;
    const s: ScreeningSession = { ...base, lang, profile: p, ageMonths, band: band.id, modules, answers: bandChanged ? {} : base.answers };
    setReadOnly(false);
    setStartIndex(null);
    persist(s);
    go('screen');
  };

  const newScreening = () => {
    saveDraft(null);
    setSession(null);
    setReadOnly(false);
    go('profile');
  };

  const draft = !readOnly && session && !session.completedAt ? session : null;

  let body: ReactNode = null;
  if (view === 'welcome') {
    body = (
      <Welcome
        lang={lang}
        setLang={setLang}
        isDemo={bank.isDemonstration}
        canResume={!!draft}
        onResume={() => { setStartIndex(null); go('screen'); }}
        onStart={() => { if (draft) { saveDraft(null); setSession(null); } setReadOnly(false); go('profile'); }}
      />
    );
  } else if (view === 'profile') {
    body = (
      <Profile
        lang={lang}
        initial={draft?.profile}
        initialModules={draft?.modules}
        modules={bank.modules ?? []}
        onBack={() => go('welcome')}
        onSubmit={startProfile}
        hasItemsFor={(m) => { const b = bandForMonths(m); return !!b && itemsFor(bank, b.id).length > 0; }}
      />
    );
  } else if (view === 'screen' && session) {
    body = (
      <Questionnaire
        key={session.id + String(startIndex)}
        lang={lang}
        steps={steps}
        startIndex={startIndex ?? (() => { const f = steps.findIndex((i) => !session.answers[i.id]); return f < 0 ? steps.length : f; })()}
        answers={session.answers}
        onAnswer={(id, v) => persist({ ...session, answers: { ...session.answers, [id]: v } })}
        concerns={session.concerns}
        concernDomains={session.concernDomains}
        onConcerns={(c, d) => persist({ ...session, concerns: c, concernDomains: d })}
        onExit={() => go('profile')}
        onFinish={() => { persist({ ...session, completedAt: session.completedAt ?? new Date().toISOString(), lang }); go('results'); }}
      />
    );
  } else if (view === 'results' && session && result) {
    body = (
      <Results
        lang={lang}
        session={session}
        result={result}
        moduleResults={moduleResults}
        bank={bank}
        onEdit={readOnly ? undefined : () => { setStartIndex(0); go('screen'); }}
        onNew={newScreening}
        onReview={(r) => persist({ ...session, review: r })}
      />
    );
  } else if (view === 'admin') {
    body = (
      <Admin
        lang={lang}
        sessions={sessions}
        bank={bank}
        onChanged={() => {
          setSessions(loadSessions());
          setBank(getActiveBank());
          const d = loadDraft();
          setSession(d);
        }}
        onOpenSession={(s) => { setReadOnly(true); setSession(s); go('results'); }}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-navy/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <button onClick={() => go('welcome')} className="flex min-w-0 items-center gap-2.5 text-left" aria-label={tr(lang, 'home')}>
            <Logo className="h-9 w-9 shrink-0" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold tracking-wide text-navy">LET'Z PLAY</span>
              <span className="block truncate text-[11px] font-medium text-navy-600">Development Check</span>
            </span>
          </button>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLang(lang === 'ms' ? 'en' : 'ms')}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-navy/15 px-3 text-sm font-semibold text-navy hover:bg-navy-50"
              aria-label={lang === 'ms' ? 'Switch to English' : 'Tukar ke Bahasa Melayu'}
              data-testid="lang-toggle"
            >
              <Languages className="h-4 w-4" />
              <span className={lang === 'ms' ? 'text-navy' : 'text-slate-400'}>BM</span>
              <span className="text-slate-300">/</span>
              <span className={lang === 'en' ? 'text-navy' : 'text-slate-400'}>EN</span>
            </button>
            <button onClick={() => go('admin')} className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-navy hover:bg-navy-50" data-testid="admin-link">
              <LayoutDashboard className="h-4 w-4" /> <span className="hidden sm:inline">{tr(lang, 'admin')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:py-8">{body}</main>

      <footer className="border-t border-navy/10 bg-white">
        <div className="mx-auto max-w-4xl space-y-3 px-4 py-6 text-xs text-slate-500">
          <p className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-navy" /> <span><b className="text-navy">{tr(lang, 'privacy')}:</b> {tr(lang, 'privacyText')}</span></p>
          <p className="leading-relaxed">{DISCLAIMER[lang]}</p>
          <p className="font-semibold text-navy">LET'Z PLAY THERAPY · <span className="font-normal italic">Nurturing Abilities, Inspiring Possibilities.</span></p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}
