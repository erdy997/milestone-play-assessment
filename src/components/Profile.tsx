import { CalendarCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { tr, type StringKey } from '../i18n';
import { bandForMonths, calculateAge, MAX_MONTHS, todayISO } from '../lib/age';
import { formatAge } from '../lib/format';
import { moduleItemsFor } from '../lib/modules';
import type { ChildProfile, Lang, ModuleId, SupplementaryModule } from '../types';
import { Button, Card, Field, inputCls } from './ui';

export function Profile({ lang, initial, initialModules, modules, onBack, onSubmit, hasItemsFor }: {
  lang: Lang;
  initial?: ChildProfile;
  initialModules?: ModuleId[];
  modules: SupplementaryModule[];
  onBack: () => void;
  onSubmit: (p: ChildProfile, ageMonths: number, modules: ModuleId[]) => void;
  hasItemsFor: (months: number) => boolean;
}) {
  const t = (k: StringKey) => tr(lang, k);
  const [p, setP] = useState<ChildProfile>(
    initial ?? { childName: '', screeningId: '', dob: '', gender: '', caregiverName: '', screeningDate: todayISO(), purpose: 'exhibition' },
  );
  const [touched, setTouched] = useState(false);
  const [selMods, setSelMods] = useState<ModuleId[]>(initialModules ?? modules.map((m) => m.id));
  const set = <K extends keyof ChildProfile>(k: K, v: ChildProfile[K]) => setP((o) => ({ ...o, [k]: v }));

  const age = useMemo(() => (p.dob ? calculateAge(p.dob, p.screeningDate) : null), [p.dob, p.screeningDate]);
  const band = age ? bandForMonths(age.totalMonths) : null;

  const errors: Partial<Record<'name' | 'dob', string>> = {};
  if (!p.childName.trim() && !p.screeningId.trim()) errors.name = t('errNameOrId');
  if (!p.dob) errors.dob = t('errDobRequired');
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(p.dob) || (!age && p.dob <= p.screeningDate)) errors.dob = t('errDobInvalid');
  else if (p.dob > p.screeningDate) errors.dob = t('errDobFuture');
  else if (age && age.totalMonths > MAX_MONTHS) errors.dob = t('errDobOld');
  else if (age && !hasItemsFor(age.totalMonths)) errors.dob = t('errNoItems');

  const valid = Object.keys(errors).length === 0;
  const minDob = (() => {
    const d = new Date(p.screeningDate);
    d.setFullYear(d.getFullYear() - 7);
    return d.toISOString().slice(0, 10);
  })();

  return (
    <Card>
      <h2 className="text-2xl font-bold text-navy">{t('profileTitle')}</h2>
      <p className="mt-1 text-sm text-slate-600">{t('profileSub')}</p>
      <form
        className="mt-6 grid gap-5 sm:grid-cols-2"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (valid && age) onSubmit({ ...p, childName: p.childName.trim(), screeningId: p.screeningId.trim(), caregiverName: p.caregiverName.trim() }, age.totalMonths, selMods.filter((id) => modules.some((m) => m.id === id && moduleItemsFor(m, age.totalMonths).length > 0)));
        }}
      >
        <Field label={t('childName')} htmlFor="childName" hint={t('nameOrId')} error={touched ? errors.name : undefined}>
          <input id="childName" className={inputCls} value={p.childName} maxLength={80} autoComplete="off" onChange={(e) => set('childName', e.target.value)} />
        </Field>
        <Field label={t('screeningId')} htmlFor="screeningId" optionalLabel={t('optional')}>
          <input id="screeningId" className={inputCls} value={p.screeningId} maxLength={40} autoComplete="off" placeholder="LPT-001" onChange={(e) => set('screeningId', e.target.value)} />
        </Field>
        <Field label={t('dob')} htmlFor="dob" error={touched ? errors.dob : undefined}>
          <input id="dob" type="date" className={inputCls} value={p.dob} min={minDob} max={p.screeningDate} onChange={(e) => set('dob', e.target.value)} />
        </Field>
        <Field label={t('screeningDate')} htmlFor="screeningDate">
          <input id="screeningDate" type="date" className={inputCls} value={p.screeningDate} max={todayISO()} onChange={(e) => e.target.value && set('screeningDate', e.target.value)} />
        </Field>

        <div className="sm:col-span-2" aria-live="polite">
          <div className="flex items-start gap-3 rounded-2xl bg-navy-50 p-4 ring-1 ring-aqua">
            <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-navy" />
            <div className="text-sm">
              <p className="font-semibold text-navy">{t('chronologicalAge')}</p>
              <p className="text-slate-700" data-testid="age-display">
                {age && age.totalMonths <= MAX_MONTHS ? formatAge(age, lang) : '—'}
              </p>
              {band && age && age.totalMonths <= MAX_MONTHS && (
                <p className="mt-1 text-slate-600">
                  {t('ageGroup')}: <span className="font-semibold text-navy" data-testid="band-display">{band.label[lang]}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <Field label={t('gender')} htmlFor="gender" optionalLabel={t('optional')}>
          <select id="gender" className={inputCls} value={p.gender} onChange={(e) => set('gender', e.target.value as ChildProfile['gender'])}>
            <option value="">—</option>
            <option value="male">{t('male')}</option>
            <option value="female">{t('female')}</option>
            <option value="preferNot">{t('preferNot')}</option>
          </select>
        </Field>
        <Field label={t('caregiver')} htmlFor="caregiver" optionalLabel={t('optional')}>
          <input id="caregiver" className={inputCls} value={p.caregiverName} maxLength={80} autoComplete="off" onChange={(e) => set('caregiverName', e.target.value)} />
        </Field>
        <Field label={t('purpose')} htmlFor="purpose">
          <select id="purpose" className={inputCls} value={p.purpose} onChange={(e) => set('purpose', e.target.value as ChildProfile['purpose'])}>
            {(['exhibition', 'parentCheck', 'followUp', 'other'] as const).map((v) => (
              <option key={v} value={v}>{t(`purpose_${v}` as StringKey)}</option>
            ))}
          </select>
        </Field>

        {modules.length > 0 && (
          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-semibold text-navy">{t('extraSections')}</legend>
            <p className="mb-2 text-xs text-slate-500">{t('extraSectionsSub')}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {modules.map((m) => {
                const n = age && age.totalMonths <= MAX_MONTHS ? moduleItemsFor(m, age.totalMonths).length : null;
                const disabled = n === 0;
                const on = selMods.includes(m.id) && !disabled;
                return (
                  <label key={m.id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3.5 transition ${on ? 'border-navy bg-navy-50' : 'border-slate-200 bg-white'} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}>
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 accent-[#172B5A]"
                      checked={on}
                      disabled={disabled}
                      data-testid={`module-${m.id}`}
                      onChange={(e) => setSelMods((o) => (e.target.checked ? [...o.filter((x) => x !== m.id), m.id] : o.filter((x) => x !== m.id)))}
                    />
                    <span className="text-sm">
                      <span className="block font-semibold text-navy">{m.name[lang]}</span>
                      <span className="block text-xs text-slate-500">
                        {disabled ? t('notForAge') : n != null ? `${n} ${t('questionsCount')}` : m.categories.map((c) => c.label[lang]).join(' · ')}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:col-span-2 sm:flex-row sm:justify-between">
          <Button type="button" variant="ghost" onClick={onBack}><ChevronLeft className="h-4 w-4" /> {t('back')}</Button>
          <Button type="submit" data-testid="profile-continue">{t('continue')} <ChevronRight className="h-4 w-4" /></Button>
        </div>
      </form>
    </Card>
  );
}
