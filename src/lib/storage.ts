import type { ScreeningSession } from '../types';

const KEY_SESSIONS = 'lzp.sessions.v1';
const KEY_DRAFT = 'lzp.draft.v1';
const KEY_LANG = 'lzp.lang';
const KEY_BANK = 'lzp.questionBank.v1';
const KEY_QR = 'lzp.qrUrl';

function safeGet(store: Storage | undefined, key: string): string | null {
  try { return store ? store.getItem(key) : null; } catch { return null; }
}
function safeSet(store: Storage | undefined, key: string, val: string): boolean {
  try { store?.setItem(key, val); return true; } catch { return false; }
}
function safeRemove(store: Storage | undefined, key: string) {
  try { store?.removeItem(key); } catch { /* ignore */ }
}
const ls = () => (typeof window !== 'undefined' ? window.localStorage : undefined);
const ss = () => (typeof window !== 'undefined' ? window.sessionStorage : undefined);

export function loadSessions(): ScreeningSession[] {
  const raw = safeGet(ls(), KEY_SESSIONS);
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch { return []; }
}

export function upsertSession(s: ScreeningSession) {
  const all = loadSessions();
  const i = all.findIndex((x) => x.id === s.id);
  if (i >= 0) all[i] = s; else all.push(s);
  safeSet(ls(), KEY_SESSIONS, JSON.stringify(all));
}

/** The in-progress screening for this browser tab session ("save progress during the current session"). */
export function saveDraft(s: ScreeningSession | null) {
  if (s) safeSet(ss(), KEY_DRAFT, JSON.stringify(s)); else safeRemove(ss(), KEY_DRAFT);
}
export function loadDraft(): ScreeningSession | null {
  const raw = safeGet(ss(), KEY_DRAFT);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

/** Deletes all screening records (children's data). Settings such as the question bank, QR URL and admin PIN are kept. */
export function deleteAllData() {
  safeRemove(ls(), KEY_SESSIONS);
  safeRemove(ss(), KEY_DRAFT);
}

export const prefs = {
  getLang: () => safeGet(ls(), KEY_LANG),
  setLang: (l: string) => safeSet(ls(), KEY_LANG, l),
  getBank: () => safeGet(ls(), KEY_BANK),
  setBank: (json: string | null) => (json ? safeSet(ls(), KEY_BANK, json) : (safeRemove(ls(), KEY_BANK), true)),
  getQr: () => safeGet(ls(), KEY_QR),
  setQr: (u: string) => safeSet(ls(), KEY_QR, u),
};

export function newId(): string {
  const c = typeof crypto !== 'undefined' ? crypto : undefined;
  if (c && 'randomUUID' in c) return c.randomUUID();
  return 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2);
}
