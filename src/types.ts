export type Lang = 'en' | 'ms';

/** Bilingual text. */
export interface L {
  en: string;
  ms: string;
}

export type DomainId = 'grossMotor' | 'fineMotor' | 'communication' | 'cognitive' | 'socialEmotional';

export const DOMAIN_IDS: DomainId[] = ['grossMotor', 'fineMotor', 'communication', 'cognitive', 'socialEmotional'];

export type AgeBandId = '0-5' | '6-11' | '12-17' | '18-23' | '24-35' | '36-47' | '48-59' | '60-72';

export interface AgeBand {
  id: AgeBandId;
  minMonths: number; // inclusive
  maxMonths: number; // inclusive
  label: L;
}

export type ResponseValue = 'achieved' | 'sometimes' | 'notYet' | 'notSure' | 'notObserved';

export const RESPONSE_VALUES: ResponseValue[] = ['achieved', 'sometimes', 'notYet', 'notSure', 'notObserved'];

export interface QuestionItem {
  id: string;
  domain: DomainId;
  band: AgeBandId;
  text: L;
  /** Optional short hint shown under the question (e.g. how to observe). */
  hint?: L;
}

/**
 * Scoring rules.
 *  - "descriptive": no normative scoring. Only response counts are shown (default, used by the demo bank).
 *  - "points-cutoff": use ONLY when an authorised instrument with official scoring rules is configured.
 *    Points per response are summed per domain and compared to the instrument's official cut-offs.
 */
export type ScoringRules =
  | { mode: 'descriptive' }
  | {
      mode: 'points-cutoff';
      points: Record<ResponseValue, number | null>; // null = item excluded from the total
      /** cutoffs[band][domain] = ordered list, highest minScore first. */
      cutoffs: Partial<Record<AgeBandId, Partial<Record<DomainId, { minScore: number; label: L }[]>>>>;
      source: L; // citation of the official scoring manual
    };

/** Frequency scale used by the supplementary (sensory / learning) modules. */
export type FrequencyValue = 'always' | 'often' | 'sometimes' | 'rarely' | 'never' | 'notSure';
export const FREQUENCY_VALUES: FrequencyValue[] = ['always', 'often', 'sometimes', 'rarely', 'never', 'notSure'];

export type Answers = Record<string, ResponseValue | FrequencyValue>;

export type ModuleId = 'sensory' | 'learning';
export const MODULE_IDS: ModuleId[] = ['sensory', 'learning'];

export interface ModuleCategory {
  id: string;
  label: L;
  description: L;
  /** Home / classroom ideas shown when behaviours in this category are reported often or always. */
  ideas: L[];
}

export interface ModuleItem {
  id: string;
  category: string;
  text: L;
  minMonths: number; // inclusive
  maxMonths: number; // inclusive
}

/**
 * A supplementary questionnaire (e.g. sensory processing patterns, learning preferences).
 * Always descriptive: the app reports how often each behaviour was reported, never a score or label.
 */
export interface SupplementaryModule {
  id: ModuleId;
  name: L;
  intro: L;
  note: L;
  isDemonstration: boolean;
  attribution: L;
  categories: ModuleCategory[];
  items: ModuleItem[];
}

export interface QuestionBank {
  id: string;
  name: L;
  version: string;
  /** true = items are NOT validated clinical items. A warning banner is shown everywhere. */
  isDemonstration: boolean;
  attribution: L;
  licence: L;
  scoring: ScoringRules;
  items: QuestionItem[];
  /** Optional supplementary modules (sensory processing, learning preferences). */
  modules?: SupplementaryModule[];
}

export interface ChildProfile {
  childName: string;
  screeningId: string;
  dob: string; // yyyy-mm-dd
  gender: '' | 'male' | 'female' | 'preferNot';
  caregiverName: string;
  screeningDate: string; // yyyy-mm-dd
  purpose: 'exhibition' | 'parentCheck' | 'followUp' | 'other';
}

export interface ProfessionalReview {
  otComments: string;
  stComments: string;
  otherObservations: string;
  referral: '' | 'none' | 'monitor' | 'ot' | 'st' | 'paeds' | 'multi';
  reviewerName: string;
  reviewerRole: string;
}

export interface ScreeningSession {
  id: string;
  createdAt: string; // ISO
  completedAt?: string; // ISO
  lang: Lang;
  bankId: string;
  bankVersion: string;
  profile: ChildProfile;
  ageMonths: number;
  band: AgeBandId;
  /** Developmental item answers (ResponseValue) and module item answers (FrequencyValue), keyed by item id. */
  answers: Record<string, ResponseValue | FrequencyValue>;
  /** Supplementary modules the parent chose to include. */
  modules?: ModuleId[];
  concerns: string;
  concernDomains: DomainId[];
  review: ProfessionalReview;
}
