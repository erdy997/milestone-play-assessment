import logoBadge from '../assets/logo-badge.png?inline';
import logoFull from '../assets/logo-full.png?inline';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ');
}

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'teal';
export function Button({ variant = 'primary', className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const v: Record<Variant, string> = {
    primary: 'bg-navy text-white hover:bg-navy-700 focus-visible:ring-navy',
    teal: 'bg-aqua text-navy hover:bg-[#86d2dd] focus-visible:ring-navy',
    secondary: 'bg-white text-navy border border-navy/20 hover:border-navy/50 focus-visible:ring-navy',
    ghost: 'text-navy hover:bg-navy-50 focus-visible:ring-navy',
    danger: 'bg-red-700 text-white hover:bg-red-800 focus-visible:ring-red-700',
  };
  return (
    <button
      {...rest}
      className={cx(
        'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        v[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  const hasBg = /(^|\s)bg-/.test(className ?? '');
  return <section className={cx('rounded-3xl p-5 shadow-card sm:p-7', !hasBg && 'bg-white', className)}>{children}</section>;
}

export function Notice({ tone = 'info', children, className }: { tone?: 'info' | 'warn'; children: ReactNode; className?: string }) {
  const Icon = tone === 'warn' ? AlertTriangle : Info;
  return (
    <div
      role="note"
      className={cx(
        'flex gap-3 rounded-2xl p-4 text-sm leading-relaxed',
        tone === 'warn' ? 'bg-amber-50 text-amber-900 ring-1 ring-amber-200' : 'bg-navy-50 text-navy ring-1 ring-aqua',
        className,
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  );
}

export function Field({ label, hint, error, htmlFor, children, optionalLabel }: { label: string; hint?: string; error?: string; htmlFor: string; children: ReactNode; optionalLabel?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-navy">
        {label} {optionalLabel && <span className="font-normal text-slate-500">({optionalLabel})</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && (
        <p className="text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputCls =
  'block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-navy focus:outline-none focus:ring-2 focus:ring-aqua';

export function Logo({ className = 'h-10 w-10' }: { className?: string }) {
  return <img src={logoBadge} alt="Let'z Play Therapy" className={cx('rounded-full bg-white object-contain', className)} />;
}

export function FullLogo({ className = 'w-40' }: { className?: string }) {
  return <img src={logoFull} alt="Let'z Play Therapy" className={className} />;
}
