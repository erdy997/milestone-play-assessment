import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HOME_ACTIVITIES, stageForMonths } from '../data/activities';
import { AGE_BANDS } from '../data/demoQuestionBank';
import logoBadge from '../assets/logo-badge.png?inline';
import logoFull from '../assets/logo-full.png?inline';
import { answerLabel, DISCLAIMER, DOMAIN_LABELS, FREQUENCY_COLORS, FREQUENCY_LABELS, RESPONSE_COLORS, RESPONSE_LABELS, tr, type StringKey } from '../i18n';
import type { Lang, QuestionBank, ScreeningSession } from '../types';
import { FREQUENCY_VALUES, RESPONSE_VALUES } from '../types';
import type { ModuleResult } from './modules';
import { calculateAge } from './age';
import { buildRecommendations, formatAge, formatDate } from './format';
import type { ScreeningResult } from './scoring';

// Brand: navy + aqua (from the Let'z Play logo)
const GREEN: [number, number, number] = [23, 43, 90]; // navy
const TEAL: [number, number, number] = [159, 221, 230]; // aqua
const GREY: [number, number, number] = [244, 246, 250];
const TEXT: [number, number, number] = [30, 38, 58];
const MUTED: [number, number, number] = [94, 106, 130];
const PINK: [number, number, number] = [217, 130, 139];

const PAGE_W = 210;
const PAGE_H = 297;
const M = 18; // side margin
const TOP = 36; // content start below header
const BOTTOM = 22; // reserved for footer

/** Standard PDF fonts only cover WinAnsi; normalise typographic characters so nothing renders as garbage. */
export function pdfSafe(s: string): string {
  return s
    .replace(/[‘’‚′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/[–—−]/g, '-')
    .replace(/…/g, '...')
    .replace(/→/g, '->')
    .replace(/ /g, ' ')
    .replace(/[^\x00-\xFF]/g, '');
}

function hex(c: string): [number, number, number] {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function reportFileName(s: ScreeningSession): string {
  const raw = s.profile.screeningId || s.profile.childName || s.id.slice(0, 8);
  const id = pdfSafe(raw).trim().replace(/[^A-Za-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40) || 'Child';
  return `Development_Check_${id}_${s.profile.screeningDate}.pdf`;
}

export function buildReportPdf(session: ScreeningSession, result: ScreeningResult, bank: QuestionBank, lang: Lang, mods: ModuleResult[] = []): jsPDF {
  const t = (k: StringKey, v?: Record<string, string>) => pdfSafe(tr(lang, k, v));
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
  doc.setProperties({ title: t('pdfTitle'), subject: t('appName'), author: "Let'z Play Therapy", creator: "Let'z Play Development Check" });
  const p = session.profile;
  const childLabel = p.childName || p.screeningId || '-';
  let y = TOP;
  let sectionTitle = '';

  const header = (title: string) => {
    sectionTitle = title;
    doc.setFillColor(...GREEN);
    doc.rect(0, 0, PAGE_W, 24, 'F');
    // logo badge
    try { doc.addImage(logoBadge, 'PNG', M - 1, 4, 16, 16, 'lzp-badge'); } catch { /* logo optional */ }
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text("LET'Z PLAY THERAPY", M + 16, 11);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...TEAL);
    doc.text('Nurturing Abilities, Inspiring Possibilities.', M + 16, 15.5);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(pdfSafe(tr(lang, 'appName')), PAGE_W - M, 11, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...TEAL);
    doc.text(pdfSafe(childLabel).slice(0, 50) + '  |  ' + formatDate(p.screeningDate, lang), PAGE_W - M, 15.5, { align: 'right' });
    // section heading
    doc.setTextColor(...GREEN);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text(title, M, TOP - 4);
    doc.setDrawColor(...TEAL);
    doc.setLineWidth(0.8);
    doc.line(M, TOP - 1.5, M + 24, TOP - 1.5);
    y = TOP + 4;
  };

  const newPage = (title: string) => {
    doc.addPage();
    header(title);
  };

  const ensure = (h: number) => {
    if (y + h > PAGE_H - BOTTOM) {
      // keep the caller's text style across the page break
      const font = doc.getFont();
      const size = doc.getFontSize();
      const color = doc.getTextColor();
      doc.addPage();
      header(sectionTitle);
      doc.setFont(font.fontName, font.fontStyle);
      doc.setFontSize(size);
      doc.setTextColor(color);
    }
  };

  const h2 = (text: string) => {
    ensure(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(...GREEN);
    doc.text(text, M, y);
    y += 6;
  };

  const para = (text: string, opts: { size?: number; color?: [number, number, number]; indent?: number; bullet?: boolean; bold?: boolean } = {}) => {
    const size = opts.size ?? 9.5;
    const indent = opts.indent ?? 0;
    const lh = size * 0.45;
    doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...(opts.color ?? TEXT));
    const w = PAGE_W - 2 * M - indent - (opts.bullet ? 4 : 0);
    const lines: string[] = doc.splitTextToSize(pdfSafe(text), w);
    lines.forEach((ln, i) => {
      ensure(lh + 1);
      if (opts.bullet && i === 0) {
        doc.setFillColor(...GREEN);
        doc.circle(M + indent + 1.2, y - lh * 0.35, 0.7, 'F');
      }
      doc.text(ln, M + indent + (opts.bullet ? 4 : 0), y);
      y += lh;
    });
    y += 1.2;
  };

  const callout = (title: string, body: string, fill: [number, number, number] = GREY) => {
    doc.setFontSize(8.8);
    const lines: string[] = doc.splitTextToSize(pdfSafe(body), PAGE_W - 2 * M - 10);
    const h = 10 + lines.length * 4;
    ensure(h + 4);
    doc.setFillColor(...fill);
    doc.setDrawColor(...TEAL);
    doc.setLineWidth(0.4);
    doc.roundedRect(M, y, PAGE_W - 2 * M, h, 2.5, 2.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...GREEN);
    doc.text(title, M + 5, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(...TEXT);
    doc.text(lines, M + 5, y + 11);
    y += h + 5;
  };

  const tableBase = {
    margin: { left: M, right: M, top: TOP + 4, bottom: BOTTOM },
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 2.4, textColor: TEXT, lineColor: [221, 227, 238] as [number, number, number], lineWidth: 0.2, overflow: 'linebreak' as const },
    headStyles: { fillColor: GREEN, textColor: [255, 255, 255] as [number, number, number], fontStyle: 'bold' as const },
    alternateRowStyles: { fillColor: [248, 250, 253] as [number, number, number] },
    willDrawPage: (data: { pageNumber: number }) => {
      if (data.pageNumber > 1) header(sectionTitle);
    },
  };
  const lastY = () => (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

  // ---------------- PAGE 1: CHILD PROFILE ----------------
  header(t('pdfP1'));
  // full logo on a navy tile (the logo's white lettering needs a dark ground)
  const tileW = 40, tileH = 36, tileX = PAGE_W - M - tileW, tileY = TOP - 8;
  doc.setFillColor(...GREEN);
  doc.roundedRect(tileX, tileY, tileW, tileH, 3, 3, 'F');
  try { doc.addImage(logoFull, 'PNG', tileX + 3.5, tileY + 3, 33, 33 * (520 / 620), 'lzp-full'); } catch { /* logo optional */ }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(...GREEN);
  doc.text(doc.splitTextToSize(t('pdfTitle'), PAGE_W - 2 * M - tileW - 6), M, y + 4);
  y += 11;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(doc.splitTextToSize(t('tagline'), PAGE_W - 2 * M - tileW - 6), M, y);
  y = Math.max(y + 8, tileY + tileH + 6);

  const age = calculateAge(p.dob, p.screeningDate);
  const band = AGE_BANDS.find((b) => b.id === session.band);
  const genderKey = p.gender ? (p.gender as StringKey) : null;
  const purposeKey = `purpose_${p.purpose}` as StringKey;
  const profileRows: [string, string][] = [
    [t('childName'), pdfSafe(p.childName) || t('notProvided')],
    [t('screeningId'), pdfSafe(p.screeningId) || t('notProvided')],
    [t('dob'), formatDate(p.dob, lang)],
    [t('chronologicalAge'), age ? pdfSafe(formatAge(age, lang)) : '-'],
    [t('ageMonths'), String(session.ageMonths)],
    [t('ageGroup'), band ? pdfSafe(band.label[lang]) : session.band],
    [t('gender'), genderKey ? t(genderKey) : t('notProvided')],
    [t('caregiver'), pdfSafe(p.caregiverName) || t('notProvided')],
    [t('screeningDate'), formatDate(p.screeningDate, lang)],
    [t('purpose'), t(purposeKey)],
    [t('questionnaireUsed'), pdfSafe(`${bank.name[lang]} (v${bank.version})`)],
    [t('itemsCompleted'), `${result.answered} / ${result.total}`],
    ...mods.map((m): [string, string] => [pdfSafe(m.module.name[lang]), `${m.answered} / ${m.total}`]),
  ];
  autoTable(doc, {
    ...tableBase,
    startY: y,
    body: profileRows,
    theme: 'grid',
    columnStyles: { 0: { cellWidth: 58, fontStyle: 'bold', textColor: GREEN, fillColor: GREY }, 1: { cellWidth: 'auto' } },
  });
  y = lastY() + 8;
  callout(t('aboutReport'), t('aboutReportText'));
  if (bank.isDemonstration) callout(pdfSafe(tr(lang, 'bankDemo')), t('demoBanner') + ' ' + pdfSafe(bank.licence[lang]), [253, 246, 235]);
  else callout(t('questionnaireUsed'), pdfSafe(bank.attribution[lang] + ' ' + bank.licence[lang]));
  callout(lang === 'ms' ? 'Penafian' : 'Disclaimer', pdfSafe(DISCLAIMER[lang]));

  // ---------------- PAGE 2: DEVELOPMENTAL SUMMARY ----------------
  newPage(t('pdfP2'));
  para(t('descriptiveNote'), { size: 9, color: MUTED });
  y += 1;
  const official = result.mode === 'points-cutoff';
  const head = [t('domain'), lang === 'ms' ? 'Item' : 'Items', ...RESPONSE_VALUES.map((r) => pdfSafe(RESPONSE_LABELS[r][lang]))];
  if (official) head.push(t('score'));
  const body = result.domains.map((d) => {
    const row = [pdfSafe(DOMAIN_LABELS[d.domain][lang]), String(d.total), ...RESPONSE_VALUES.map((r) => String(d.counts[r]))];
    if (official) row.push(d.official ? `${d.official.score}${d.official.label ? ' - ' + pdfSafe(d.official.label[lang]) : ''}` : '-');
    return row;
  });
  body.push([t('total'), String(result.total), ...RESPONSE_VALUES.map((r) => String(result.totals[r])), ...(official ? [''] : [])]);
  autoTable(doc, {
    ...tableBase,
    startY: y,
    head: [head],
    body,
    theme: 'grid',
    styles: { ...tableBase.styles, fontSize: 8.5, halign: 'center' },
    columnStyles: { 0: { halign: 'left', cellWidth: 46, fontStyle: 'bold' } },
    didParseCell: (data) => {
      if (data.section === 'body' && data.row.index === body.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = TEAL;
      }
    },
  });
  y = lastY() + 9;

  // Chart: horizontal stacked bars per domain
  h2(t('responsesByDomain'));
  const labelW = 48;
  const barX = M + labelW;
  const barW = PAGE_W - M - barX - 8;
  const barH = 7;
  ensure(result.domains.length * (barH + 4) + 18);
  result.domains.forEach((d) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...TEXT);
    const lab: string[] = doc.splitTextToSize(pdfSafe(DOMAIN_LABELS[d.domain][lang]), labelW - 3);
    doc.text(lab, M, y + (lab.length > 1 ? 2.4 : 4.6));
    doc.setFillColor(235, 239, 246);
    doc.rect(barX, y, barW, barH, 'F');
    let x = barX;
    const denom = Math.max(d.total, 1);
    RESPONSE_VALUES.forEach((r) => {
      const n = d.counts[r];
      if (!n) return;
      const w = (n / denom) * barW;
      doc.setFillColor(...hex(RESPONSE_COLORS[r]));
      doc.rect(x, y, w, barH, 'F');
      if (w > 5) {
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        const dark = r === 'achieved' || r === 'sometimes';
        if (dark) doc.setTextColor(255, 255, 255); else doc.setTextColor(...TEXT);
        doc.text(String(n), x + w / 2, y + 4.8, { align: 'center' });
      }
      x += w;
    });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(String(d.total), barX + barW + 2, y + 4.8);
    y += barH + 4;
  });
  // legend
  let lx = M;
  y += 1;
  RESPONSE_VALUES.forEach((r) => {
    const label = pdfSafe(RESPONSE_LABELS[r][lang]);
    doc.setFillColor(...hex(RESPONSE_COLORS[r]));
    doc.rect(lx, y - 2.6, 3, 3, 'F');
    doc.setFontSize(8);
    doc.setTextColor(...TEXT);
    doc.text(label, lx + 4.5, y);
    lx += 4.5 + doc.getTextWidth(label) + 6;
  });
  y += 8;

  // ---------------- SENSORY & LEARNING PROFILE (optional modules) ----------------
  if (mods.length) {
    newPage(t('pdfModules'));
    callout(pdfSafe(tr(lang, 'bankDemo')), t('moduleDemo'), [253, 246, 235]);
    mods.forEach((mr, mi) => {
      if (mi > 0) y += 2;
      ensure(70);
      h2(pdfSafe(mr.module.name[lang]));
      para(mr.module.note[lang], { size: 8.6, color: MUTED });
      const fhead = [t('category'), ...FREQUENCY_VALUES.map((f) => pdfSafe(FREQUENCY_LABELS[f][lang])), t('oftenAlways')];
      autoTable(doc, {
        ...tableBase,
        startY: y,
        head: [fhead],
        body: mr.categories.map((c) => [pdfSafe(c.category.label[lang]), ...FREQUENCY_VALUES.map((f) => String(c.counts[f])), `${c.frequent.length} / ${c.total}`]),
        theme: 'grid',
        styles: { ...tableBase.styles, fontSize: 8, halign: 'center' },
        columnStyles: { 0: { halign: 'left', cellWidth: 38, fontStyle: 'bold' } },
      });
      y = lastY() + 5;
      // stacked bars
      const lw = 38, bx = M + lw, bw = PAGE_W - M - bx - 8, bh = 5.5;
      ensure(mr.categories.length * (bh + 3) + 10);
      mr.categories.forEach((c) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...TEXT);
        doc.text(pdfSafe(c.category.label[lang]).slice(0, 26), M, y + 4);
        doc.setFillColor(235, 239, 246);
        doc.rect(bx, y, bw, bh, 'F');
        let x = bx;
        FREQUENCY_VALUES.forEach((f) => {
          const n = c.counts[f];
          if (!n) return;
          const w = (n / Math.max(c.total, 1)) * bw;
          doc.setFillColor(...hex(FREQUENCY_COLORS[f]));
          doc.rect(x, y, w, bh, 'F');
          if (w > 4) {
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            if (f === 'always' || f === 'often') doc.setTextColor(255, 255, 255);
            else doc.setTextColor(...TEXT);
            doc.text(String(n), x + w / 2, y + 3.9, { align: 'center' });
          }
          x += w;
        });
        y += bh + 3;
      });
      let fx = M;
      y += 1.5;
      FREQUENCY_VALUES.forEach((f) => {
        const label = pdfSafe(FREQUENCY_LABELS[f][lang]);
        doc.setFillColor(...hex(FREQUENCY_COLORS[f]));
        doc.rect(fx, y - 2.6, 3, 3, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.6);
        doc.setTextColor(...TEXT);
        doc.text(label, fx + 4.2, y);
        fx += 4.2 + doc.getTextWidth(label) + 5;
      });
      y += 6;
      // frequent behaviours + ideas
      const withFreq = mr.categories.filter((c) => c.frequent.length);
      para(t('frequentlyReported'), { bold: true, size: 9, color: GREEN });
      if (!withFreq.length) para(t('noFrequent'), { size: 8.8, color: MUTED });
      withFreq.forEach((c) => {
        para(c.category.label[lang], { bold: true, size: 8.8, color: PINK });
        c.frequent.forEach((it) => para(it.text[lang], { bullet: true, indent: 2, size: 8.6 }));
        para(t('ideasToTry') + ': ' + c.category.ideas.map((i) => i[lang]).join(' '), { indent: 2, size: 8.4, color: MUTED });
      });
    });
  }

  // ---------------- PAGE 3: OBSERVATIONS & RECOMMENDATIONS ----------------
  newPage(t('pdfP3'));
  const listByDomain = (key: 'achieved' | 'emerging' | 'notYet' | 'clarify') => {
    let any = false;
    result.domains.forEach((d) => {
      const arr = d[key];
      if (!arr.length) return;
      any = true;
      para(DOMAIN_LABELS[d.domain][lang], { bold: true, size: 9.2, color: GREEN });
      arr.forEach((it) => {
        const suffix = key === 'clarify' ? ` (${answerLabel(session.answers[it.id])[lang]})` : '';
        para(it.text[lang] + suffix, { bullet: true, indent: 2, size: 8.8 });
      });
    });
    if (!any) para(t('none'), { color: MUTED, size: 9 });
    y += 2;
  };
  h2(t('strengths') + ' - ' + t('catAchieved'));
  listByDomain('achieved');
  h2(t('monitor'));
  para(t('catEmerging'), { size: 8.8, color: MUTED });
  listByDomain('emerging');
  para(t('catNotYet'), { size: 8.8, color: MUTED });
  listByDomain('notYet');
  h2(t('catClarify'));
  listByDomain('clarify');

  h2(t('parentConcerns'));
  if (session.concernDomains.length || session.concerns.trim()) {
    if (session.concernDomains.length) para(session.concernDomains.map((d) => DOMAIN_LABELS[d][lang]).join(', '), { bold: true, size: 9 });
    if (session.concerns.trim()) para(session.concerns.trim(), { size: 9 });
  } else para(t('noConcerns'), { color: MUTED, size: 9 });
  y += 2;

  h2(t('homeActivities'));
  const stage = stageForMonths(session.ageMonths);
  const focus = result.domains.filter((d) => d.notYet.length || d.emerging.length || d.clarify.length).map((d) => d.domain);
  const domainsForActs = focus.length ? focus : result.domains.map((d) => d.domain);
  domainsForActs.forEach((d) => {
    para(DOMAIN_LABELS[d][lang], { bold: true, size: 9.2, color: GREEN });
    HOME_ACTIVITIES[stage][d].forEach((a) => para(a[lang], { bullet: true, indent: 2, size: 8.8 }));
  });
  y += 2;

  h2(lang === 'ms' ? 'Cadangan susulan profesional' : 'Professional follow-up recommendations');
  buildRecommendations(result, session, lang, mods).forEach((r) => para(r, { bullet: true, size: 9 }));
  y += 2;
  callout(lang === 'ms' ? 'Penafian' : 'Disclaimer', pdfSafe(DISCLAIMER[lang]));

  // ---------------- PAGE 4: PROFESSIONAL REVIEW ----------------
  newPage(t('pdfP4'));
  const rv = session.review;
  const box = (label: string, value: string, lines = 4) => {
    const lh = 6.5;
    doc.setFontSize(9);
    const wrapped: string[] = value.trim() ? doc.splitTextToSize(pdfSafe(value.trim()), PAGE_W - 2 * M - 8) : [];
    const n = Math.max(lines, wrapped.length);
    const h = 9 + n * lh;
    ensure(h + 4);
    doc.setDrawColor(203, 212, 228);
    doc.setLineWidth(0.3);
    doc.roundedRect(M, y, PAGE_W - 2 * M, h, 2, 2, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...GREEN);
    doc.text(label, M + 4, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...TEXT);
    for (let i = 0; i < n; i++) {
      const ly = y + 9 + (i + 1) * lh;
      doc.setDrawColor(228, 233, 242);
      doc.line(M + 4, ly, PAGE_W - M - 4, ly);
      if (wrapped[i]) doc.text(wrapped[i], M + 4, ly - 1.6);
    }
    y += h + 5;
  };
  box(t('otComments'), rv.otComments);
  box(t('stComments'), rv.stComments);
  box(t('otherObs'), rv.otherObservations);

  // referral checkboxes
  const refs: ScreeningSession['review']['referral'][] = ['none', 'monitor', 'ot', 'st', 'paeds', 'multi'];
  ensure(42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...GREEN);
  doc.text(t('referral'), M, y + 2);
  y += 7;
  refs.forEach((r, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = M + col * ((PAGE_W - 2 * M) / 2);
    const yy = y + row * 7;
    doc.setDrawColor(...GREEN);
    doc.setLineWidth(0.35);
    doc.rect(x, yy - 3.2, 3.8, 3.8, 'S');
    if (rv.referral === r) {
      doc.setFillColor(...GREEN);
      doc.rect(x + 0.8, yy - 2.4, 2.2, 2.2, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...TEXT);
    doc.text(t(`ref_${r}` as StringKey), x + 6, yy);
  });
  y += 3 * 7 + 6;

  // name / signature
  ensure(30);
  const half = (PAGE_W - 2 * M - 8) / 2;
  const field = (label: string, value: string, x: number, w: number) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...TEXT);
    if (value) doc.text(pdfSafe(value).slice(0, 60), x, y + 6);
    doc.setDrawColor(...MUTED);
    doc.setLineWidth(0.3);
    doc.line(x, y + 8, x + w, y + 8);
    doc.setFontSize(7.8);
    doc.setTextColor(...MUTED);
    doc.text(label, x, y + 12);
  };
  field(t('reviewerName'), rv.reviewerName, M, half);
  field(t('reviewerRole'), rv.reviewerRole, M + half + 8, half);
  y += 20;
  field(t('signature'), '', M, half);
  field(t('date'), '', M + half + 8, half);
  y += 20;

  // ---------------- APPENDIX: complete item-level record ----------------
  newPage(lang === 'ms' ? 'Lampiran: Respons Item' : 'Appendix: Item Responses');
  autoTable(doc, {
    ...tableBase,
    startY: y,
    head: [[t('domain'), t('question'), lang === 'ms' ? 'Respons' : 'Response']],
    body: result.domains.flatMap((d) =>
      [...d.achieved, ...d.emerging, ...d.notYet, ...d.clarify]
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((it) => [pdfSafe(DOMAIN_LABELS[d.domain][lang]), pdfSafe(it.text[lang]), pdfSafe(answerLabel(session.answers[it.id])[lang])]),
    ).concat(
      mods.flatMap((mr) =>
        mr.module.items
          .filter((it) => session.answers[it.id] && mr.categories.some((c) => c.category.id === it.category))
          .map((it) => [
            pdfSafe(`${mr.module.name[lang]}: ${mr.module.categories.find((c) => c.id === it.category)?.label[lang] ?? ''}`),
            pdfSafe(it.text[lang]),
            pdfSafe(answerLabel(session.answers[it.id])[lang]),
          ]),
      ),
    ),
    theme: 'grid',
    styles: { ...tableBase.styles, fontSize: 8 },
    columnStyles: { 0: { cellWidth: 38 }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 30 } },
  });
  y = lastY() + 6;

  // ---------------- FOOTER ON ALL PAGES ----------------
  const n = doc.getNumberOfPages();
  const gen = `${t('generated')}: ${formatDate(new Date().toISOString().slice(0, 10), lang)}`;
  for (let i = 1; i <= n; i++) {
    doc.setPage(i);
    doc.setDrawColor(...TEAL);
    doc.setLineWidth(0.4);
    doc.line(M, PAGE_H - 15, PAGE_W - M, PAGE_H - 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(pdfSafe(lang === 'ms' ? 'Saringan sahaja - bukan diagnosis. ' : 'Screening only - not a diagnosis. ') + gen, M, PAGE_H - 10);
    doc.text(`${t('page')} ${i} ${t('of')} ${n}`, PAGE_W - M, PAGE_H - 10, { align: 'right' });
  }
  return doc;
}

export function downloadReport(session: ScreeningSession, result: ScreeningResult, bank: QuestionBank, lang: Lang, mods: ModuleResult[] = []) {
  const doc = buildReportPdf(session, result, bank, lang, mods);
  doc.save(reportFileName(session));
}
