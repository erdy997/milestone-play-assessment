import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DOMAIN_SHORT, RESPONSE_COLORS, RESPONSE_LABELS } from '../i18n';
import type { Counts } from '../lib/scoring';
import type { DomainId, Lang } from '../types';
import { RESPONSE_VALUES } from '../types';

export function DomainChart({ lang, rows, height = 300 }: { lang: Lang; rows: { domain: DomainId; counts: Counts }[]; height?: number }) {
  const data = rows.map((r) => ({ name: DOMAIN_SHORT[r.domain][lang], ...r.counts }));
  return (
    <div style={{ width: '100%', height }} data-testid="domain-chart">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, bottom: 4, left: 4 }} barCategoryGap={10}>
          <CartesianGrid horizontal={false} stroke="#E3E8F1" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#5E6A82' }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={104} tick={{ fontSize: 12, fill: '#172B5A', fontWeight: 600 }} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: 'rgba(165,222,210,.18)' }} contentStyle={{ borderRadius: 12, border: '1px solid #DDF3F6', fontSize: 13 }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} formatter={(v) => <span style={{ color: '#334155' }}>{v}</span>} />
          {RESPONSE_VALUES.map((r, i) => (
            <Bar
              key={r}
              dataKey={r}
              name={RESPONSE_LABELS[r][lang]}
              stackId="a"
              fill={RESPONSE_COLORS[r]}
              radius={i === RESPONSE_VALUES.length - 1 ? [0, 6, 6, 0] : 0}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
