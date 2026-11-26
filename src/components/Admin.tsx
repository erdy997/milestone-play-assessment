import { BookOpen, Download, ExternalLink, FileDown, KeyRound, Lock, QrCode, Trash2, Upload, Users } from 'lucide-react';
import QRCode from 'qrcode';
import { useMemo, useRef, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AGE_BANDS, DEMO_QUESTION_BANK } from '../data/demoQuestionBank';
import { tr, type StringKey } from '../i18n';
import { validateBank } from '../lib/bank';
import { downloadBlob, sessionsToCsv } from '../lib/csv';
import { formatDate } from '../lib/format';
import { downloadReport } from '../lib/pdf';
import { scoreModules } from '../lib/modules';
import { emptyCounts, scoreScreening } from '../lib/scoring';
import { deleteAllData, prefs } from '../lib/storage';
import type { DomainId, Lang, QuestionBank, ScreeningSession } from '../types';
import { DOMAIN_IDS, RESPONSE_VALUES } from '../types';
import { DomainChart } from './DomainChart';
import { Button, Card, inputCls, Notice } from './ui';

const PIN_KEY = 'lzp.adminPin';

async function hashPin(pin: string): Promise<string> {
  const data = new TextEncoder().encode('lzp:' + pin);
  if (crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 0;
  for (const b of data) h = (h * 31 + b) | 0;
  return 'weak-' + h;
}
const readPin = () => { try { return localStorage.getItem(PIN_KEY); } catch { return null; } };

/** Classifies whether a URL is usable as a public exhibition link. */
export function checkPublicUrl(raw: string): { ok: boolean; url?: string; local?: boolean } {
  let u: URL;
  try { u = new URL(raw.trim()); } catch { return { ok: false }; }
  if (u.protocol !== 'https:') return { ok: false };
  const h = u.hostname;
  const local = h === 'localhost' || h.endsWith('.local') || /^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h) || /^172\.(1[6-9]|2\d|3[01])\./.test(h) || h === '0.0.0.0' || !h.includes('.');
  return { ok: true, url: u.toString(), local };
}

function PinGate({ lang, onUnlock }: { lang: Lang; onUnlock: () => void }) {
  const t = (k: StringKey) => tr(lang, k);
  const existing = readPin();
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');
  const L = lang === 'ms'
    ? { set: 'Tetapkan PIN pentadbir (pilihan) untuk melindungi data di peranti kongsi.', enter: 'Masukkan PIN pentadbir', wrong: 'PIN salah.', save: 'Tetapkan PIN & masuk', skip: 'Teruskan tanpa PIN', open: 'Buka' }
    : { set: 'Set an admin PIN (optional) to protect data on a shared exhibition device.', enter: 'Enter admin PIN', wrong: 'Incorrect PIN.', save: 'Set PIN & open', skip: 'Continue without a PIN', open: 'Open' };
  return (
    <Card className="mx-auto max-w-md space-y-4">
      <h2 className="flex items-center gap-2 text-xl font-bold text-navy"><Lock className="h-5 w-5" /> {t('adminTitle')}</h2>
      <p className="text-sm text-slate-600">{existing ? L.enter : L.set}</p>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          if (existing) {
            if ((await hashPin(pin)) === existing) onUnlock(); else setErr(L.wrong);
          } else if (pin.length >= 4) {
            try { localStorage.setItem(PIN_KEY, await hashPin(pin)); } catch { /* ignore */ }
            onUnlock();
          } else setErr(lang === 'ms' ? 'PIN mesti sekurang-kurangnya 4 digit.' : 'PIN must be at least 4 digits.');
        }}
      >
        <input aria-label="PIN" className={inputCls} inputMode="numeric" type="password" autoComplete="off" value={pin} onChange={(e) => { setPin(e.target.value); setErr(''); }} data-testid="pin" />
        {err && <p className="text-sm text-red-700" role="alert">{err}</p>}
        <Button type="submit" className="w-full"><KeyRound className="h-4 w-4" /> {existing ? L.open : L.save}</Button>
        {!existing && <Button type="button" variant="ghost" className="w-full" onClick={onUnlock} data-testid="skip-pin">{L.skip}</Button>}
      </form>
    </Card>
  );
}

export function Admin({ lang, sessions, bank, onChanged, onOpenSession }: {
  lang: Lang;
  sessions: ScreeningSession[];
  bank: QuestionBank;
  onChanged: () => void;
  onOpenSession: (s: ScreeningSession) => void;
}) {
  const t = (k: StringKey) => tr(lang, k);
  const [unlocked, setUnlocked] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [msg, setMsg] = useState('');
  const [qrUrl, setQrUrl] = useState(prefs.getQr() ?? '');
  const [qrImg, setQrImg] = useState('');
  const [qrErr, setQrErr] = useState('');
  const [qrLocal, setQrLocal] = useState(false);
  const [qrFor, setQrFor] = useState('');
  const [bankMsg, setBankMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const completed = sessions.filter((s) => s.completedAt);
  const sorted = [...sessions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const ageDist = useMemo(
    () => AGE_BANDS.map((b) => ({ name: b.label[lang].replace(/ (months|bulan)$/, ''), count: sessions.filter((s) => s.band === b.id).length })),
    [sessions, lang],
  );
  const domainAgg = useMemo(() => {
    const agg: Record<DomainId, ReturnType<typeof emptyCounts>> = Object.fromEntries(DOMAIN_IDS.map((d) => [d, emptyCounts()])) as never;
    for (const s of completed) {
      const r = scoreScreening(bank, s.band, s.answers);
      for (const d of r.domains) for (const v of RESPONSE_VALUES) agg[d.domain][v] += d.counts[v];
    }
    return DOMAIN_IDS.map((d) => ({ domain: d, counts: agg[d] }));
  }, [completed, bank]);

  if (!unlocked) return <PinGate lang={lang} onUnlock={() => setUnlocked(true)} />;

  const genQr = async () => {
    setQrErr(''); setQrImg('');
    const c = checkPublicUrl(qrUrl);
    if (!c.ok || !c.url) { setQrErr(t('qrInvalid')); return; }
    setQrLocal(!!c.local);
    try {
      const img = await QRCode.toDataURL(c.url, { errorCorrectionLevel: 'M', margin: 2, width: 720, color: { dark: '#172B5A', light: '#FFFFFF' } });
      setQrImg(img);
      setQrFor(c.url);
      prefs.setQr(c.url);
    } catch { setQrErr(t('qrInvalid')); }
  };

  const tiles = [
    { label: t('totalSessions'), value: sessions.length, testid: 'stat-total' },
    { label: t('completed'), value: completed.length, testid: 'stat-completed' },
    { label: t('inProgress'), value: sessions.length - completed.length, testid: 'stat-progress' },
    { label: t('screeningDate'), value: sorted[0] ? formatDate(sorted[0].profile.screeningDate, lang) : '—', testid: 'stat-latest' },
  ];

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="text-2xl font-bold text-navy">{t('adminTitle')}</h2>
        <p className="mt-1 text-sm text-slate-600">{t('adminSub')}</p>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {tiles.map((x) => (
            <div key={x.label} className="rounded-2xl bg-mist p-4">
              <p className="text-xs font-semibold text-slate-500">{x.label}</p>
              <p className="mt-1 text-2xl font-extrabold text-navy tabular-nums" data-testid={x.testid}>{x.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={() => downloadBlob(sessionsToCsv(sessions, bank), `Development_Check_Export_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8')} disabled={!sessions.length} data-testid="export-csv">
            <Download className="h-4 w-4" /> {t('exportCsv')}
          </Button>
          {!confirmDel ? (
            <Button variant="secondary" className="!text-red-700" onClick={() => setConfirmDel(true)} data-testid="delete-all"><Trash2 className="h-4 w-4" /> {t('deleteAll')}</Button>
          ) : (
            <div className="flex w-full flex-col gap-2 rounded-2xl bg-red-50 p-3 ring-1 ring-red-200 sm:flex-row sm:items-center">
              <p className="flex-1 text-sm text-red-800">{t('deleteConfirm')}</p>
              <Button variant="danger" onClick={() => { deleteAllData(); setConfirmDel(false); setMsg(t('deleted')); onChanged(); }} data-testid="confirm-delete">{t('confirmDelete')}</Button>
              <Button variant="ghost" onClick={() => setConfirmDel(false)}>{t('cancel')}</Button>
            </div>
          )}
        </div>
        {msg && <p className="mt-3 text-sm font-medium text-navy" role="status">{msg}</p>}
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 flex items-center gap-2 font-bold text-navy"><Users className="h-5 w-5" /> {t('ageDistribution')}</h3>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={ageDist} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#E3E8F1" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#5E6A82' }} axisLine={false} tickLine={false} interval={0} angle={-40} textAnchor="end" height={44} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5E6A82' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} formatter={(v) => [v, t('sessions')]} />
                <Bar dataKey="count" fill="#172B5A" radius={[6, 6, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs text-slate-500">{t('months')}</p>
        </Card>
        <Card>
          <h3 className="mb-3 font-bold text-navy">{t('domainStats')}</h3>
          {completed.length ? <DomainChart lang={lang} rows={domainAgg} height={260} /> : <p className="text-sm text-slate-500">{t('noData')}</p>}
        </Card>
      </div>

      <Card>
        <h3 className="mb-3 font-bold text-navy">{t('sessions')}</h3>
        {!sessions.length ? <p className="text-sm text-slate-500">{t('noData')}</p> : (
          <div className="-mx-2 overflow-x-auto">
            <table className="min-w-full text-sm" data-testid="sessions-table">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-2 py-2">{t('screeningDate')}</th>
                  <th className="px-2 py-2">{t('childName')} / ID</th>
                  <th className="px-2 py-2">{t('age')}</th>
                  <th className="px-2 py-2">{t('status')}</th>
                  <th className="px-2 py-2" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((s) => (
                  <tr key={s.id} className="border-t border-slate-100">
                    <td className="whitespace-nowrap px-2 py-2.5">{formatDate(s.profile.screeningDate, lang)}</td>
                    <td className="px-2 py-2.5 font-medium">{s.profile.childName || s.profile.screeningId}</td>
                    <td className="whitespace-nowrap px-2 py-2.5">{s.ageMonths} {t('months')}</td>
                    <td className="px-2 py-2.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.completedAt ? 'bg-aqua-soft text-navy' : 'bg-amber-50 text-amber-800'}`}>{s.completedAt ? t('completed') : t('inProgress')}</span>
                    </td>
                    <td className="whitespace-nowrap px-2 py-2.5 text-right">
                      {s.completedAt && (
                        <>
                          <Button variant="ghost" className="!min-h-[36px] !px-2" onClick={() => onOpenSession(s)}>{t('view')}</Button>
                          <Button variant="ghost" className="!min-h-[36px] !px-2" aria-label="PDF" onClick={() => downloadReport(s, scoreScreening(bank, s.band, s.answers), bank, lang, scoreModules(bank, s.modules, s.ageMonths, s.answers))}><FileDown className="h-4 w-4" /></Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="space-y-4">
        <h3 className="flex items-center gap-2 font-bold text-navy"><QrCode className="h-5 w-5" /> {t('qrTitle')}</h3>
        <p className="text-sm text-slate-600">{t('qrSub')}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="qrUrl" className="sr-only">{t('qrUrl')}</label>
          <input id="qrUrl" className={inputCls} placeholder="https://your-username.github.io/letzplay-development-check/" value={qrUrl} onChange={(e) => setQrUrl(e.target.value)} inputMode="url" data-testid="qr-url" />
          <Button onClick={genQr} data-testid="qr-generate"><QrCode className="h-4 w-4" /> {t('qrGenerate')}</Button>
        </div>
        <Button variant="ghost" className="!min-h-[36px] !px-2 text-xs" onClick={() => setQrUrl(window.location.href.split('#')[0])}>{t('qrUseCurrent')}</Button>
        {qrErr && <p className="text-sm font-medium text-red-700" role="alert">{qrErr}</p>}
        {qrImg && (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-mist p-5 sm:flex-row sm:items-start">
            <img src={qrImg} alt={`QR: ${qrFor}`} className="h-48 w-48 rounded-xl bg-white p-2" data-testid="qr-image" />
            <div className="space-y-2 text-sm">
              <p className="break-all font-semibold text-navy" data-testid="qr-for">{qrFor}</p>
              {qrLocal && <Notice tone="warn">{t('qrLocal')}</Notice>}
              <div className="flex flex-wrap gap-2">
                <a className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-navy px-4 text-sm font-semibold text-white" href={qrImg} download="LetzPlay_Development_Check_QR.png"><Download className="h-4 w-4" /> {t('qrDownload')}</a>
                <a className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-navy/20 px-4 text-sm font-semibold text-navy" href={qrFor} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /> {t('qrTest')}</a>
              </div>
            </div>
          </div>
        )}
        <Notice>{t('qrNotDeployed')}</Notice>
      </Card>

      <Card className="space-y-3">
        <h3 className="flex items-center gap-2 font-bold text-navy"><BookOpen className="h-5 w-5" /> {t('bankTitle')}</h3>
        <dl className="grid gap-1 text-sm">
          <div><dt className="inline text-slate-500">{t('bankActive')}: </dt><dd className="inline font-semibold" data-testid="bank-name">{bank.name[lang]} (v{bank.version})</dd></div>
          <div><dt className="inline text-slate-500">{t('status')}: </dt><dd className="inline">{bank.isDemonstration ? t('bankDemo') : t('bankConfigured')}</dd></div>
          <div className="text-slate-600">{bank.attribution[lang]}</div>
          <div className="text-slate-600">{bank.licence[lang]}</div>
          <div className="text-slate-500">{bank.items.length} {t('items')} · scoring: {bank.scoring.mode}</div>
          {(bank.modules ?? []).map((m) => <div key={m.id} className="text-slate-500">+ {m.name[lang]}: {m.items.length} {t('items')} ({m.isDemonstration ? t('bankDemo') : t('bankConfigured')})</div>)}
        </dl>
        <Notice tone="warn">{t('bankNote')}</Notice>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => downloadBlob(JSON.stringify(bank, null, 2), 'question-bank-template.json', 'application/json')}><Download className="h-4 w-4" /> {t('bankExport')}</Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> {t('bankImport')}</Button>
          {bank.id !== DEMO_QUESTION_BANK.id && <Button variant="ghost" onClick={() => { prefs.setBank(null); setBankMsg(null); onChanged(); }}>{t('bankReset')}</Button>}
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            data-testid="bank-file"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = '';
              if (!f) return;
              try {
                const json = JSON.parse(await f.text());
                const errs = validateBank(json);
                if (errs.length) { setBankMsg({ ok: false, text: `${t('bankInvalid')}: ${errs.join('; ')}` }); return; }
                prefs.setBank(JSON.stringify(json));
                setBankMsg({ ok: true, text: t('bankImported') });
                onChanged();
              } catch {
                setBankMsg({ ok: false, text: t('bankInvalid') });
              }
            }}
          />
        </div>
        {bankMsg && <p className={`text-sm font-medium ${bankMsg.ok ? 'text-navy' : 'text-red-700'}`} role="status">{bankMsg.text}</p>}
      </Card>
    </div>
  );
}
